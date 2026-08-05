'use client';

import { Link } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Megaphone,
    Newspaper,
    Radio,
    Sun,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { formatTanggal } from '@/lib/format-date';
import { cn } from '@/lib/utils';

export type InfoTickerType = 'berita' | 'pengumuman' | 'kegiatan' | 'hari-libur';

export interface InfoTickerItem {
    id: string;
    type: InfoTickerType;
    label: string;
    title: string;
    date?: string | null;
    href: string;
}

interface InfoTickerProps {
    items: InfoTickerItem[];
    /** Kelas tambahan untuk menyesuaikan lebar/posisi dari halaman pemakai. */
    className?: string;
}

const ROTATE_MS = 4500;

const TYPE_META: Record<InfoTickerType, { icon: LucideIcon; chip: string; badge: string }> = {
    berita: { icon: Newspaper, chip: 'bg-white/20 text-white', badge: 'bg-white/25 text-white' },
    pengumuman: { icon: Megaphone, chip: 'bg-white/20 text-white', badge: 'bg-white/25 text-white' },
    kegiatan: { icon: Calendar, chip: 'bg-white/20 text-white', badge: 'bg-white/25 text-white' },
    'hari-libur': { icon: Sun, chip: 'bg-white/20 text-white', badge: 'bg-white/25 text-white' },
};

export default function InfoTicker({ items, className }: InfoTickerProps) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const reducedMotion = useReducedMotion();

    const count = items.length;

    const goTo = useCallback(
        (index: number) => {
            if (count === 0) {
                return;
            }

            setCurrent(((index % count) + count) % count);
        },
        [count],
    );

    const prev = useCallback(() => {
        goTo(current - 1);
    }, [current, goTo]);

    const next = useCallback(() => {
        goTo(current + 1);
    }, [current, goTo]);

    // Otomatis pindah ke item berikutnya setiap ROTATE_MS.
    // Progres bar digerakkan dengan animasi CSS berdurasi sama (dengan `key` baru
    // di setiap `current`), sehingga bar selalu restart dan sinkron dengan rotasi.
    useEffect(() => {
        if (count === 0 || paused || reducedMotion) {
            return;
        }

        const timer = window.setTimeout(() => {
            setCurrent((c) => (c + 1) % count);
        }, ROTATE_MS);

        return () => window.clearTimeout(timer);
    }, [count, paused, reducedMotion, current]);

    if (count === 0) {
        return null;
    }

    const item = items[current];
    const meta = TYPE_META[item.type];
    const Icon = meta.icon;

    return (
        <div
            className={cn('relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-xl shadow-black/10 backdrop-blur-md', className)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* HEADER */}
            <div className="flex items-center justify-between gap-3 border-b border-white/15 px-5 py-3">
                <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/80 uppercase">
                    <Radio className="h-3.5 w-3.5 text-emerald-300" />
                    Informasi Terbaru
                </span>

                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={item.id}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                        className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold', meta.chip)}
                    >
                        <Icon className="h-3 w-3" />
                        {item.label}
                    </motion.span>
                </AnimatePresence>
            </div>

            {/* BODY */}
            <div aria-live="polite" aria-atomic="true" className="px-5 py-4">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="min-h-[68px]"
                    >
                        <Link href={item.href} className="group block">
                            <div className="flex items-start gap-3">
                                <span className={cn('flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl', meta.badge)}>
                                    <Icon className="h-5 w-5" />
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="block text-[15px] leading-snug font-semibold text-white line-clamp-2 transition-colors duration-300 group-hover:text-emerald-300">
                                        {item.title}
                                    </span>

                                    {item.date && (
                                        <span className="mt-1.5 flex items-center gap-1.5 text-xs text-white/60">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {formatTanggal(item.date)}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </Link>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* FOOTER: PROGRESS BAR + DOTS + ARROWS */}
            <div className="relative flex items-center justify-between gap-3 border-t border-white/15 px-5 py-2.5">
                {/* PROGRESS BAR — garis di atas indikator titik */}
                {!reducedMotion && (
                    <div
                        key={`ticker-progress-${current}`}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 -translate-y-1/2 rounded-r-full bg-white"
                        style={{
                            animation: `ticker-progress ${ROTATE_MS}ms linear forwards`,
                            animationPlayState: paused ? 'paused' : 'running',
                        }}
                    />
                )}
                <div className="flex items-center gap-1.5">
                    {items.map((it, i) => (
                        <button
                            key={it.id}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Tampilkan ${it.label}: ${it.title}`}
                            className={cn(
                                'h-1.5 rounded-full transition-all duration-300',
                                i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70',
                            )}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={prev}
                        aria-label="Informasi sebelumnya"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={next}
                        aria-label="Informasi berikutnya"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
