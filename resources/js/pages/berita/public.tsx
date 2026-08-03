'use client';

import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun,
} from 'lucide-react';
import PublicHeader from '@/components/public-header';
import { useAppearance } from '@/hooks/use-appearance';
import { useThemeClasses } from '@/hooks/use-theme-classes';
import Footer from '@/layouts/footer';
import { formatTanggal } from '@/lib/format-date';

type BeritaPublic = {
    id: number;
    judul: string;
    slug: string;
    thumbnail: string | null;
    isi: string;
    tanggal: string | null;
    deskripsi?: string;
};

type BeritaPagination = {
    data: BeritaPublic[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

export default function BeritaPublic({
    beritas,
    tentangs,
    jenisLayanans,
}: {
    beritas: BeritaPagination;
    tentangs?: { nama: string; slug: string; deskripsi?: string }[];
    jenisLayanans?: {
        id: number;
        nama: string;
        slug: string;
        deskripsi?: string;
    }[];
}) {
    const { tc } = useThemeClasses();
    const { appearance, updateAppearance } = useAppearance();

    const cycleAppearance = () => {
        const modes: Array<'light' | 'dark'> = ['light', 'dark'];
        const idx = modes.indexOf(appearance as 'light' | 'dark');
        updateAppearance(modes[(idx + 1) % modes.length]);
    };

    const AppearanceIcon = appearance === 'dark' ? Moon : Sun;

    return (
        <>
            <Head title="Berita" />

            <div
                className={`relative min-h-screen overflow-hidden bg-slate-50 font-sans text-foreground transition-all duration-500 dark:bg-slate-950 ${tc.selection}`}
            >
                <div
                    className={`pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tc.orb}`}
                ></div>

                <PublicHeader
                    tentangs={tentangs}
                    jenisLayanans={jenisLayanans}
                />

                {/* HERO */}
                <section className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-900 py-20 md:py-24">
                    <motion.div
                        className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.div
                            className={`absolute top-[-6rem] left-[10%] h-56 w-56 rounded-full mix-blend-multiply blur-[130px] dark:mix-blend-lighten ${tc.heroOrb}`}
                            animate={{
                                y: [0, -20, 0, 15, 0],
                                x: [0, 15, -15, 10, 0],
                            }}
                            transition={{
                                duration: 12,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                        <motion.div
                            className={`absolute right-[10%] bottom-[-6rem] h-56 w-56 rounded-full mix-blend-multiply blur-[130px] dark:mix-blend-lighten ${tc.heroOrb}`}
                            animate={{ y: [0, 20, -10, 0], x: [0, -15, 10, 0] }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </motion.div>

                    <div className="pointer-events-none absolute inset-0 z-[1] bg-white/10 backdrop-blur-[2px] dark:bg-black/10"></div>

                    <div
                        className="pointer-events-none absolute inset-0 z-[1] opacity-30"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    ></div>

                    <div className="relative z-[2] mx-auto flex max-w-4xl items-center justify-center px-6 text-center md:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            <motion.img
                                src="/kubah-putih.png"
                                alt="Kubah"
                                className="mx-auto w-24 md:w-28"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                            />
                            <motion.h1
                                className="mt-4 text-4xl font-extrabold tracking-normal text-white md:text-5xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                Berita
                            </motion.h1>
                            <motion.p
                                className="mx-auto mt-3 max-w-2xl text-sm text-white/90 md:text-base"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Kabar dan informasi terbaru dari Perpustakaan
                                Ibrahimy.
                            </motion.p>
                            <motion.nav
                                className="mt-4 flex items-center justify-center gap-1.5 text-sm text-white/90 md:text-base"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                aria-label="Breadcrumb"
                            >
                                <Link
                                    href="/"
                                    className="font-medium text-white transition-opacity hover:opacity-80"
                                >
                                    Beranda
                                </Link>
                                <ChevronRight className="h-4 w-4 opacity-70" />
                                <span className="font-semibold">Berita</span>
                            </motion.nav>
                        </motion.div>
                    </div>
                </section>

                {/* CONTENT */}
                <div className="mx-auto max-w-6xl px-6 py-12 md:px-12">
                    {beritas.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center dark:border-gray-700">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                Belum ada berita
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Berita akan tampil di sini setelah diterbitkan.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {beritas.data.map((b, i) => (
                                    <motion.div
                                        key={b.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: i * 0.05,
                                            duration: 0.5,
                                        }}
                                    >
                                        <Link
                                            href={`/berita/${b.slug}`}
                                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-gray-800 dark:bg-gray-900"
                                        >
                                            {b.thumbnail ? (
                                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                    <img
                                                        src={b.thumbnail}
                                                        alt={b.judul}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-900">
                                                    <img
                                                        src="/kubah-putih.png"
                                                        alt="Kubah"
                                                        className="w-16 opacity-80"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex flex-1 flex-col p-5">
                                                <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {formatTanggal(b.tanggal) ||
                                                        '—'}
                                                </div>

                                                <h3 className="line-clamp-2 text-base font-bold text-gray-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                                    {b.judul}
                                                </h3>

                                                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                                    {b.deskripsi}
                                                </p>

                                                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                    Baca Selengkapnya
                                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* PAGINATION */}
                            {beritas.last_page > 1 && (
                                <nav
                                    className="mt-10 flex flex-col items-center gap-4"
                                    aria-label="Paginasi berita"
                                >
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Menampilkan{' '}
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                            {(beritas.current_page - 1) *
                                                beritas.per_page +
                                                1}
                                            –
                                            {Math.min(
                                                beritas.current_page *
                                                    beritas.per_page,
                                                beritas.total,
                                            )}
                                        </span>{' '}
                                        dari{' '}
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                            {beritas.total}
                                        </span>{' '}
                                        berita
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                                        {/* PREV */}
                                        {beritas.prev_page_url ? (
                                            <Link
                                                href={beritas.prev_page_url}
                                                preserveScroll
                                                className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:text-emerald-600 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                <span className="hidden sm:inline">
                                                    Sebelumnya
                                                </span>
                                            </Link>
                                        ) : (
                                            <span className="flex h-10 cursor-not-allowed items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-300 opacity-70 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-600">
                                                <ChevronLeft className="h-4 w-4" />
                                                <span className="hidden sm:inline">
                                                    Sebelumnya
                                                </span>
                                            </span>
                                        )}

                                        {/* PAGE NUMBERS */}
                                        {beritas.links
                                            .slice(1, -1)
                                            .map((link, i) =>
                                                link.url === null ? (
                                                    <span
                                                        key={`ellipsis-${i}`}
                                                        className="flex h-10 items-center px-2 text-sm text-gray-400 dark:text-gray-500"
                                                    >
                                                        …
                                                    </span>
                                                ) : (
                                                    <Link
                                                        key={`${link.label}-${i}`}
                                                        href={link.url}
                                                        preserveScroll
                                                        aria-current={
                                                            link.active
                                                                ? 'page'
                                                                : undefined
                                                        }
                                                        className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-all duration-200 ${
                                                            link.active
                                                                ? 'border-transparent bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
                                                                : 'border-gray-200 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:text-emerald-600 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400'
                                                        }`}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                ),
                                            )}

                                        {/* NEXT */}
                                        {beritas.next_page_url ? (
                                            <Link
                                                href={beritas.next_page_url}
                                                preserveScroll
                                                className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:text-emerald-600 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
                                            >
                                                <span className="hidden sm:inline">
                                                    Berikutnya
                                                </span>
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        ) : (
                                            <span className="flex h-10 cursor-not-allowed items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-300 opacity-70 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-600">
                                                <span className="hidden sm:inline">
                                                    Berikutnya
                                                </span>
                                                <ChevronRight className="h-4 w-4" />
                                            </span>
                                        )}
                                    </div>
                                </nav>
                            )}
                        </>
                    )}
                </div>

                <button
                    onClick={cycleAppearance}
                    className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-xl dark:bg-gray-800 dark:text-white"
                    title={`Mode: ${appearance}`}
                >
                    <AppearanceIcon className="h-5 w-5" />
                </button>

                <Footer
                    tc={tc}
                    tentangs={tentangs}
                    jenisLayanans={jenisLayanans}
                />
            </div>
        </>
    );
}

BeritaPublic.layout = {
    title: 'Berita Perpustakaan',
    description: 'Kabar dan informasi terbaru dari Perpustakaan Ibrahimy.',
};
