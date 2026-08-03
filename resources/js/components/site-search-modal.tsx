'use client';

import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowUpRight,
    BookOpen,
    CalendarDays,
    CornerDownLeft,
    Home,
    Info,
    Library,
    Loader2,
    MapPin,
    Megaphone,
    Newspaper,
    Search,
    Sun,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { formatTanggal } from '@/lib/format-date';
import { cn } from '@/lib/utils';

export interface SearchItem {
    group: string;
    title: string;
    description?: string | null;
    url: string;
    external?: boolean;
    date?: string | null;
}

interface SiteSearchModalProps {
    open: boolean;
    onClose: () => void;
}

const GROUP_ORDER = [
    'Halaman',
    'Berita',
    'Buletin',
    'Pengumuman',
    'Kegiatan',
    'Hari Libur',
    'Layanan',
    'Lokasi',
    'Tentang',
];

const GROUP_META: Record<string, { icon: LucideIcon; badge: string; text: string }> = {
    Halaman: { icon: Home, badge: 'bg-slate-500/15 text-slate-600 dark:text-slate-300', text: 'text-slate-500 dark:text-slate-400' },
    Berita: { icon: Newspaper, badge: 'bg-sky-500/15 text-sky-600 dark:text-sky-400', text: 'text-sky-600 dark:text-sky-400' },
    Buletin: { icon: BookOpen, badge: 'bg-violet-500/15 text-violet-600 dark:text-violet-400', text: 'text-violet-600 dark:text-violet-400' },
    Pengumuman: { icon: Megaphone, badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400', text: 'text-amber-600 dark:text-amber-400' },
    Kegiatan: { icon: CalendarDays, badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', text: 'text-emerald-600 dark:text-emerald-400' },
    'Hari Libur': { icon: Sun, badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400', text: 'text-rose-600 dark:text-rose-400' },
    Layanan: { icon: Library, badge: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400', text: 'text-cyan-600 dark:text-cyan-400' },
    Lokasi: { icon: MapPin, badge: 'bg-red-500/15 text-red-600 dark:text-red-400', text: 'text-red-600 dark:text-red-400' },
    Tentang: { icon: Info, badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400', text: 'text-indigo-600 dark:text-indigo-400' },
};

let indexCache: SearchItem[] | null = null;

export default function SiteSearchModal({ open, onClose }: SiteSearchModalProps) {
    const [query, setQuery] = useState('');
    const [index, setIndex] = useState<SearchItem[] | null>(indexCache);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [retryKey, setRetryKey] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const handleClose = useCallback(() => {
        setQuery('');
        setActiveIndex(0);
        onClose();
    }, [onClose]);

    const openItem = useCallback(
        (item: SearchItem) => {
            handleClose();

            if (item.external) {
                window.open(item.url, '_blank', 'noopener,noreferrer');
            } else {
                router.visit(item.url);
            }
        },
        [handleClose],
    );

    // Muat indeks pencarian sekali lalu di-cache agar pembukaan berikutnya instan.
    useEffect(() => {
        if (!open || index) {
            return;
        }

        let cancelled = false;

        fetch('/search')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Gagal memuat indeks');
                }

                return res.json() as Promise<{ data: SearchItem[] }>;
            })
            .then((json) => {
                if (cancelled) {
                    return;
                }

                indexCache = json.data ?? [];
                setIndex(indexCache);
                setError(null);
            })
            .catch(() => {
                if (!cancelled) {
                    setError('Gagal memuat indeks pencarian. Silakan coba lagi.');
                }
            });

        return () => {
            cancelled = true;
        };
    }, [open, index, retryKey]);

    // Fokus input setiap modal dibuka.
    useEffect(() => {
        if (!open) {
            return;
        }

        const timer = window.setTimeout(() => inputRef.current?.focus(), 80);

        return () => window.clearTimeout(timer);
    }, [open]);

    // Kunci scroll body + tutup dengan tombol Escape.
    useEffect(() => {
        if (!open) {
            return;
        }

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                handleClose();

                return;
            }

            // Fokus trap: jaga Tab agar tidak keluar dari panel.
            if (e.key === 'Tab') {
                const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
                );

                if (!focusables || focusables.length === 0) {
                    return;
                }

                const list = Array.from(focusables);
                const first = list[0];
                const last = list[list.length - 1];
                const active = document.activeElement;
                const inside = panelRef.current?.contains(active) ?? false;

                if (e.shiftKey) {
                    if (active === first || !inside) {
                        e.preventDefault();
                        last.focus();
                    }
                } else if (active === last || !inside) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [open, handleClose]);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!index) {
            return [];
        }

        if (!q) {
            // Saat kosong: tampilkan pintasan halaman populer.
            return index.filter((item) => item.group === 'Halaman');
        }

        return index
            .map((item, i) => {
                const title = item.title.toLowerCase();
                const desc = (item.description ?? '').toLowerCase();
                let score = 0;

                if (title.includes(q)) {
                    score += title.startsWith(q) ? 3 : 2;
                }

                if (desc.includes(q)) {
                    score += 1;
                }

                return { item, score, i };
            })
            .filter((x) => x.score > 0)
            .sort((a, b) => b.score - a.score || a.i - b.i)
            .map((x) => x.item);
    }, [query, index]);

    const { grouped, flatResults } = useMemo(() => {
        const flat: { item: SearchItem; flatIndex: number }[] = [];
        const groups = GROUP_ORDER.map((group) => {
            const items = results
                .filter((item) => item.group === group)
                .map((item) => ({ item, flatIndex: flat.length++ }));

            return { group, items };
        }).filter((g) => g.items.length > 0);

        return { grouped: groups, flatResults: flat };
    }, [results]);

    const safeActive = Math.min(activeIndex, Math.max(flatResults.length - 1, 0));

    // Auto-scroll item aktif ke dalam view.
    useEffect(() => {
        const el = listRef.current?.querySelector('[data-active="true"]');
        el?.scrollIntoView({ block: 'nearest' });
    }, [safeActive]);

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, Math.max(flatResults.length - 1, 0)));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const entry = flatResults[safeActive];

            if (entry) {
                openItem(entry.item);
            }
        }
    };

    const buildDescription = (item: SearchItem) => {
        const parts: string[] = [];

        if (item.description) {
            parts.push(item.description);
        }

        if (item.date) {
            parts.push(formatTanggal(item.date ?? null));
        }

        return parts.join(' · ');
    };

    const highlight = (text: string) => {
        const q = query.trim();

        if (!q) {
            return text;
        }

        const idx = text.toLowerCase().indexOf(q.toLowerCase());

        if (idx === -1) {
            return text;
        }

        return (
            <>
                {text.slice(0, idx)}
                <mark className="rounded-sm bg-emerald-500/25 px-0.5 text-emerald-700 dark:bg-emerald-400/25 dark:text-emerald-300">
                    {text.slice(idx, idx + q.length)}
                </mark>
                {text.slice(idx + q.length)}
            </>
        );
    };

    const showLoading = open && !index && !error;
    const kbdClass =
        'rounded border border-slate-300/70 bg-white/60 px-1 py-0.5 font-mono text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400';

    if (typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-[10vh] pb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Pencarian di seluruh halaman"
                >
                    {/* OVERLAY */}
                    <motion.div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* PANEL GLASSMORPHISM */}
                    <motion.div
                        ref={panelRef}
                        initial={{ opacity: 0, y: -16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-2xl shadow-slate-900/20 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/75"
                    >
                        {/* CLOSE */}
                        <button
                            type="button"
                            onClick={handleClose}
                            aria-label="Tutup pencarian"
                            className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-600 dark:hover:bg-slate-800/70 dark:hover:text-slate-300"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* SEARCH BAR */}
                        <div className="flex items-center gap-3 border-b border-slate-200/70 px-5 pr-12 dark:border-slate-800/70">
                            <Search className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setActiveIndex(0);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Cari berita, buletin, pengumuman, layanan, lokasi…"
                                aria-label="Cari di seluruh halaman"
                                className="h-14 w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
                            />
                            {query ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuery('');
                                        setActiveIndex(0);
                                        inputRef.current?.focus();
                                    }}
                                    aria-label="Bersihkan pencarian"
                                    className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-600 dark:hover:bg-slate-800/70 dark:hover:text-slate-300"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            ) : (
                                <kbd className={cn('shrink-0', kbdClass)}>esc</kbd>
                            )}
                        </div>

                        {/* BODY */}
                        {showLoading ? (
                            <div className="flex flex-col items-center justify-center gap-3 px-6 py-14">
                                <Loader2 className="h-6 w-6 animate-spin text-emerald-600 dark:text-emerald-400" />
                                <p className="text-sm text-slate-500 dark:text-slate-400">Memuat indeks pencarian…</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
                                <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setError(null);
                                        setIndex(null);
                                        setRetryKey((k) => k + 1);
                                    }}
                                    className="text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                                >
                                    Coba lagi
                                </button>
                            </div>
                        ) : flatResults.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
                                <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Tidak ditemukan hasil untuk “{query.trim()}”
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    Coba kata kunci lain seperti “layanan”, “berita”, atau “lokasi”.
                                </p>
                            </div>
                        ) : (
                            <>
                                {!query.trim() && (
                                    <p className="px-5 pt-3 text-xs text-slate-400 dark:text-slate-500">
                                        Mulai ketik untuk mencari di seluruh halaman website.
                                    </p>
                                )}
                                <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
                                    {grouped.map((group) => {
                                        const meta = GROUP_META[group.group] ?? GROUP_META.Halaman;
                                        const GroupIcon = meta.icon;

                                        return (
                                            <div key={group.group} className="mb-1">
                                                <div
                                                    className={cn(
                                                        'flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase',
                                                        meta.text,
                                                    )}
                                                >
                                                    <GroupIcon className="h-3.5 w-3.5" />
                                                    {group.group}
                                                </div>

                                                {group.items.map(({ item, flatIndex }) => {
                                                    const Icon = meta.icon;
                                                    const description = buildDescription(item);
                                                    const isActive = flatIndex === safeActive;

                                                    return (
                                                        <div
                                                            key={`${item.url}-${flatIndex}`}
                                                            data-active={isActive}
                                                            role="button"
                                                            tabIndex={-1}
                                                            onClick={() => openItem(item)}
                                                            onMouseEnter={() => setActiveIndex(flatIndex)}
                                                            className={cn(
                                                                'group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150',
                                                                isActive
                                                                    ? 'bg-slate-900/5 dark:bg-white/10'
                                                                    : 'hover:bg-slate-900/5 dark:hover:bg-white/5',
                                                            )}
                                                        >
                                                            <span
                                                                className={cn(
                                                                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                                                                    meta.badge,
                                                                )}
                                                            >
                                                                <Icon className="h-4 w-4" />
                                                            </span>

                                                            <span className="min-w-0 flex-1">
                                                                <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                                                                    {highlight(item.title)}
                                                                </span>
                                                                {description && (
                                                                    <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
                                                                        {highlight(description)}
                                                                    </span>
                                                                )}
                                                            </span>

                                                            {item.external ? (
                                                                <ArrowUpRight
                                                                    className={cn(
                                                                        'h-4 w-4 shrink-0 text-slate-400 transition-opacity',
                                                                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                                                                    )}
                                                                />
                                                            ) : (
                                                                <CornerDownLeft
                                                                    className={cn(
                                                                        'h-4 w-4 shrink-0 text-slate-400 transition-opacity',
                                                                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                                                                    )}
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* FOOTER */}
                        <div className="flex items-center justify-between border-t border-slate-200/70 px-5 py-2.5 text-[11px] text-slate-400 dark:border-slate-800/70 dark:text-slate-500">
                            <span>
                                {flatResults.length > 0
                                    ? `${flatResults.length} hasil ditemukan`
                                    : 'Ketik untuk mencari di seluruh halaman'}
                            </span>
                            <span className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <kbd className={kbdClass}>↑</kbd>
                                    <kbd className={kbdClass}>↓</kbd>
                                    navigasi
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className={kbdClass}>↵</kbd>
                                    buka
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className={kbdClass}>esc</kbd>
                                    tutup
                                </span>
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    );
}
