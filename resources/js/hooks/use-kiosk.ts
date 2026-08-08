'use client';

import { useEffect } from 'react';

const CURSOR_CLASS = 'kiosk-hide-cursor';

interface UseKioskOptions {
    enabled: boolean;
    /** Berapa ms tanpa gerakan mouse sebelum kursor disembunyikan. */
    idleMs?: number;
    /** Reload penuh berkala agar layar TV tidak pernah macet/stuck. 0 = nonaktif. */
    reloadMs?: number;
}

type WakeLock = { release: () => Promise<void> };

type NavigatorWithWakeLock = Navigator & {
    wakeLock?: { request: (type: 'screen') => Promise<WakeLock> };
};

/**
 * Mode kiosk otomatis untuk layar TV / papan digital (halaman publik pengunjung).
 *
 * Saat aktif:
 * - Meminta fullscreen (otomatis saat halaman dimuat, dan lagi pada interaksi
 *   pertama pengguna — browser hanya mengizinkan fullscreen dari user gesture).
 * - Setelah `idleMs` tanpa gerakan mouse, kursor disembunyikan.
 * - Screen Wake Lock agar layar tidak mati/dim redup (best effort).
 * - Memblokir navigasi tak sengaja: klik kanan, Ctrl/Cmd+W/T/N/R/S,
 *   Alt+Panah (back/forward), Backspace, dan peringatan sebelum menutup tab.
 * - Reload penuh berkala (`reloadMs`) agar layar selalu segar setelah berjam-jam.
 *
 * Matikan dengan `?kiosk=0` pada URL atau set PENGUNJUNG_KIOSK=false di .env.
 */
export function useKiosk({ enabled, idleMs = 3000, reloadMs = 30 * 60 * 1000 }: UseKioskOptions) {
    useEffect(() => {
        if (!enabled) {
            return;
        }

        const root = document.documentElement;
        const finePointer = window.matchMedia?.('(pointer: fine)').matches ?? true;

        let wakeLock: WakeLock | null = null;
        let idleTimer: number | undefined;
        let reloadTimer: number | undefined;

        /* ---------------- Fullscreen ---------------- */

        const tryFullscreen = () => {
            if (document.fullscreenElement) {
                return;
            }

            root.requestFullscreen?.().catch(() => {
                // Browser menolak tanpa user gesture — tidak apa-apa, akan
                // dicoba lagi pada interaksi berikutnya.
            });
        };

        const onGesture = () => tryFullscreen();

        /* ---------------- Kursor idle ---------------- */

        const showCursor = () => {
            root.classList.remove(CURSOR_CLASS);
            window.clearTimeout(idleTimer);

            idleTimer = window.setTimeout(() => {
                root.classList.add(CURSOR_CLASS);
            }, idleMs);
        };

        /* ---------------- Wake Lock ---------------- */

        const requestWakeLock = async () => {
            try {
                const nav = navigator as NavigatorWithWakeLock;

                if (!nav.wakeLock) {
                    return;
                }

                wakeLock = await nav.wakeLock.request('screen');
            } catch {
                // Tidak didukung / ditolak — abaikan.
                wakeLock = null;
            }
        };

        /* ---------------- Blokir navigasi tak sengaja ---------------- */

        const onKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const target = e.target as HTMLElement | null;
            const isTyping =
                target?.tagName === 'INPUT' ||
                target?.tagName === 'TEXTAREA' ||
                target?.isContentEditable;

            const mod = e.ctrlKey || e.metaKey;

            if (isTyping && !mod && !e.altKey) {
                return;
            }

            if (mod && ['w', 't', 'n', 'r', 's'].includes(key)) {
                e.preventDefault();
            }

            if (e.altKey && (key === 'arrowleft' || key === 'arrowright')) {
                e.preventDefault();
            }

            if (key === 'backspace' && !isTyping) {
                e.preventDefault();
            }
        };

        const onContextMenu = (e: MouseEvent) => e.preventDefault();

        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };

        const onVisibilityChange = () => {
            // Wake Lock dilepas otomatis saat tab tersembunyi — minta lagi.
            if (document.visibilityState === 'visible') {
                requestWakeLock();
            }
        };

        /* ---------------- Init ---------------- */

        tryFullscreen();

        if (finePointer) {
            showCursor();
        }

        window.addEventListener('pointerdown', onGesture, { capture: true });
        window.addEventListener('keydown', onGesture, { capture: true });
        window.addEventListener('touchstart', onGesture, { capture: true });
        window.addEventListener('pointermove', showCursor, { capture: true });
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('contextmenu', onContextMenu);
        window.addEventListener('beforeunload', onBeforeUnload);
        document.addEventListener('visibilitychange', onVisibilityChange);

        requestWakeLock();

        if (reloadMs > 0) {
            reloadTimer = window.setInterval(() => {
                window.location.reload();
            }, reloadMs);
        }

        return () => {
            window.clearTimeout(idleTimer);
            window.clearInterval(reloadTimer);
            window.removeEventListener('pointerdown', onGesture, { capture: true });
            window.removeEventListener('keydown', onGesture, { capture: true });
            window.removeEventListener('touchstart', onGesture, { capture: true });
            window.removeEventListener('pointermove', showCursor, { capture: true });
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('contextmenu', onContextMenu);
            window.removeEventListener('beforeunload', onBeforeUnload);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            root.classList.remove(CURSOR_CLASS);

            wakeLock?.release().catch(() => {});

            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        };
    }, [enabled, idleMs, reloadMs]);

    return null;
}
