'use client';

import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Calendar,
    Clock,
    Library,
    MapPin,
    Megaphone,
    Moon,
    Newspaper,
    Sun,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { JadwalTable, StatusPill } from '@/components/jadwal-table';
import PublicHeader from '@/components/public-header';
import { useAppearance } from '@/hooks/use-appearance';
import { useThemeClasses } from '@/hooks/use-theme-classes';
import Footer from '@/layouts/footer';
import { formatTanggal } from '@/lib/format-date';
import { NAMA_HARI, statusHariIni } from '@/lib/jam-buka';
import type { JamBukaItem } from '@/lib/jam-buka';

type JenisLayananItem = {
    id: number;
    nama: string;
    slug: string;
    deskripsi?: string;
    layanans_count?: number;
};

type LokasiItem = {
    id: number;
    nama: string;
    slug: string;
    alamat: string | null;
    is_utama?: boolean;
    jam_buka?: JamBukaItem[];
};

type PengumumanItem = {
    id: number;
    judul: string;
    slug: string;
    created_at: string | null;
    deskripsi?: string;
};

type KegiatanItem = {
    id: number;
    nama: string;
    tanggal: string | null;
    waktu?: string | null;
    tempat: string | null;
    nama_lokasi?: string | null;
};

type BeritaItem = {
    id: number;
    judul: string;
    slug: string;
    thumbnail: string | null;
    tanggal: string | null;
    deskripsi?: string;
};

function SectionHeading({
    eyebrow,
    title,
    description,
    href,
    linkLabel = 'Lihat Semua',
}: {
    eyebrow: string;
    title: string;
    description?: string;
    href?: string;
    linkLabel?: string;
}) {
    const { tc } = useThemeClasses();

    return (
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-600 uppercase dark:bg-emerald-500/15 dark:text-emerald-400">
                    {eyebrow}
                </span>

                <h2 className={`mt-3 text-3xl font-extrabold tracking-tight md:text-4xl ${tc.text}`}>
                    {title}
                </h2>

                {description && (
                    <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        {description}
                    </p>
                )}
            </div>

            {href && (
                <Link
                    href={href}
                    className="group inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-emerald-500/40 hover:text-emerald-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-emerald-400"
                >
                    {linkLabel}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            )}
        </div>
    );
}

export default function Welcome({
    tentangs,
    jenisLayanans,
    lokasis,
    pengumumans,
    kegiatans,
    beritas,
}: {
    tentangs?: { nama: string; slug: string; deskripsi?: string }[];
    jenisLayanans?: JenisLayananItem[];
    lokasis?: LokasiItem[];
    pengumumans?: PengumumanItem[];
    kegiatans?: KegiatanItem[];
    beritas?: BeritaItem[];
}) {
    const [inputValue, setInputValue] = useState('');
    const { appearance, updateAppearance } = useAppearance();
    const { tc } = useThemeClasses();

    const cycleAppearance = () => {
        const modes: Array<'light' | 'dark'> = ['light', 'dark'];
        const idx = modes.indexOf(appearance as 'light' | 'dark');
        updateAppearance(modes[(idx + 1) % modes.length]);
    };

    const AppearanceIcon = appearance === 'dark' ? Moon : Sun;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim()) {
return;
}

        router.get('/result', {
            q: inputValue,
        });
    };

    //animasi search bar
    const texts = [
        'Cari koleksi...',
        'Cari Buku...',
        'Cari Jurnal...',
        'Cari Skripsi...',
        'Cari Artikel...',
    ];

    const [textIndex, setTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        if (inputValue.length > 0) {
return;
}

        const currentText = texts[textIndex];

        const interval = setInterval(() => {
            setDisplayText(currentText.slice(0, charIndex));

            setCharIndex((prev) => {
                const next = prev + 1;

                if (next > currentText.length) {
                    clearInterval(interval);

                    setTimeout(() => {
                        setTextIndex((t) => (t + 1) % texts.length);
                        setCharIndex(0);
                    }, 200);

                    return prev;
                }

                return next;
            });
        }, 120);

        return () => clearInterval(interval);
    }, [charIndex, textIndex, inputValue]);

    return (
        <>
            <Head title="Home" />

            <div
                className={`relative min-h-screen overflow-hidden bg-slate-50 font-sans text-foreground transition-all duration-500 dark:bg-slate-950 ${tc.selection}`}
            >
                {/* ORB BACKGROUND */}
                <div
                    className={`pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tc.orb}`}
                ></div>

                <PublicHeader tentangs={tentangs} jenisLayanans={jenisLayanans} />

                {/* HERO */}
                <section
                    id="home"
                    className="relative min-h-screen w-full bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-900"
                >
                    {/* BACKGROUND BLUR */}
                    <motion.div
                        className="pointer-events-none absolute inset-0 z-0 grid grid-cols-2 -space-x-52 opacity-60 dark:opacity-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.div
                            className={`h-64 rounded-full mix-blend-multiply blur-[130px] dark:mix-blend-lighten ${tc.heroOrb}`}
                            animate={{
                                y: [0, -30, 0, 20, 0],
                                x: [0, 20, -20, 10, 0],
                            }}
                            transition={{
                                duration: 12,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                        <motion.div
                            className={`mt-32 h-64 rounded-full mix-blend-multiply blur-[130px] dark:mix-blend-lighten ${tc.heroOrb}`}
                            animate={{
                                y: [0, 25, -15, 0],
                                x: [0, -25, 15, 0],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </motion.div>

                    {/* GLASSMORPHISM OVERLAY */}
                    <div className="pointer-events-none absolute inset-0 z-[1] bg-white/10 backdrop-blur-[2px] dark:bg-black/10"></div>

                    {/* GRID OVERLAY */}
                    <div
                        className="pointer-events-none absolute inset-0 z-[1] opacity-30"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    ></div>

                    {/* HERO CONTENT */}
                    <div className="relative z-[2] mx-auto flex min-h-screen max-w-7xl items-center px-6 md:px-12">
                        <motion.div
                            className="flex w-full flex-col items-center lg:flex-row lg:items-center"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            <div className="w-full text-left text-white lg:w-1/2">
                            {/* LOGO */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <img
                                    src="/kubah-putih.png"
                                    alt="Kubah"
                                    className="w-45 md:w-45"
                                />
                            </motion.div>

                            {/* TITLE */}
                            <motion.h1
                                className="text-left text-5xl leading-[1.05] font-extrabold tracking-normal text-white md:text-6xl lg:text-7xl xl:text-7xl"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                Perpustakaan<br />
                                <span className="text-white">
                                    Ibrahimy
                                </span>
                            </motion.h1>

                            {/* DESC */}
                            <motion.p
                                className="mt-4 text-white text-md"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Membangun intelektual paripurna menuju pemberdayaan ummat.
                            </motion.p>

                            {/* SEARCH FORM */}
                            <motion.div
                                className="mt-6 flex"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.6 }}
                            >
                                <form
                                    onSubmit={handleSearch}
                                    className="relative w-full max-w-lg"
                                >
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="w-full rounded-xl bg-white/20 px-5 py-4 pr-28 text-white placeholder-white/50 shadow-lg focus:outline-none backdrop-blur-md"
                                    />

                                    {inputValue.length === 0 && (
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                                            {displayText}
                                            <span className="animate-pulse">|</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md px-6 py-2.5 text-sm font-semibold text-emerald-700 bg-white shadow-lg transition-all duration-300 hover:bg-green-500 hover:text-white ${tc.ring}`}
                                    >
                                        Cari
                                    </button>
                                </form>
                            </motion.div>

                            
                        </div>

                    </motion.div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <motion.div
                        className="pointer-events-none absolute bottom-0 right-0 z-10 hidden lg:block"
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                    >
                        <img
                            src="/menara.png"
                            alt="Menara"
                            className="h-auto max-h-[90vh] w-auto object-contain"
                        />
                    </motion.div>


                </section>

                {/* LAYANAN SECTION */}
                <section id="layanan" className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
                    <SectionHeading
                        eyebrow="Layanan"
                        title="Layanan Perpustakaan"
                        description="Pilih kategori layanan Perpustakaan Ibrahimy sesuai kebutuhan belajar, riset, dan literasi Anda."
                        href="/layanan"
                    />

                    {!jenisLayanans || jenisLayanans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
                            <Library className="h-10 w-10 text-gray-400" />
                            <p className="mt-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                                Belum ada jenis layanan
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Jenis layanan akan tampil di sini setelah ditambahkan.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {jenisLayanans.map((j, i) => (
                                <motion.div
                                    key={j.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                >
                                    <Link
                                        href={`/layanan/${j.slug}`}
                                        className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-gray-800 dark:bg-gray-900"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                                                <Library className="h-5 w-5" />
                                            </div>

                                            {typeof j.layanans_count === 'number' && j.layanans_count > 0 && (
                                                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                                    {j.layanans_count} Layanan
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="mt-4 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                            {j.nama}
                                        </h3>

                                        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                            {j.deskripsi || 'Temukan berbagai layanan pada kategori ini.'}
                                        </p>

                                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                            Lihat Layanan
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* JAM BUKA SECTION */}
                <section
                    id="jam-buka"
                    className="border-y border-gray-200 bg-white py-16 md:py-20 dark:border-gray-800 dark:bg-gray-900/40"
                >
                    <div className="mx-auto max-w-7xl px-6 md:px-12">
                        <SectionHeading
                            eyebrow="Jam Buka"
                            title="Jam Buka Setiap Lokasi"
                            description="Jadwal operasional layanan di setiap lokasi, dengan sorotan jadwal hari ini."
                        />

                        {!lokasis || lokasis.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
                                <Clock className="h-10 w-10 text-gray-400" />
                                <p className="mt-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    Belum ada jadwal jam buka
                                </p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Jadwal akan tampil di sini setelah lokasi ditambahkan.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* LOKASI UTAMA (DIINPUT PERTAMA) */}
                                {lokasis.map((loc) => {
                                    if (!loc.is_utama) {
                                        return null;
                                    }

                                    const status = statusHariIni(loc.jam_buka);

                                    return (
                                        <motion.div
                                            key={loc.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-white via-white to-emerald-50 p-6 shadow-xl shadow-emerald-500/10 md:p-8 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/40 dark:border-emerald-500/30">
                                                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

                                                <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-4">
                                                            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30">
                                                                <MapPin className="h-7 w-7" />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <h3 className="text-xl font-extrabold text-gray-900 md:text-2xl dark:text-white">
                                                                        {loc.nama}
                                                                    </h3>
                                                                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                                                                        Lokasi Utama
                                                                    </span>
                                                                </div>

                                                                {loc.alamat && (
                                                                    <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                                                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                                        {loc.alamat}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-white/70 p-5 backdrop-blur-sm dark:border-emerald-500/20 dark:bg-gray-900/70">
                                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                                <p className="text-sm font-semibold whitespace-nowrap text-gray-900 dark:text-white">
                                                                    Hari Ini · {NAMA_HARI[status.hari]}
                                                                </p>
                                                                <StatusPill sedangBuka={status.sedangBuka} />
                                                            </div>

                                                            {status.shifts.length > 0 ? (
                                                                <div
                                                                    className={`mt-2 flex flex-col items-start gap-0.5 text-sm font-medium ${
                                                                        status.sedangBuka
                                                                            ? 'text-emerald-700 dark:text-emerald-400'
                                                                            : 'text-gray-600 dark:text-gray-400'
                                                                    }`}
                                                                >
                                                                    {status.shifts.map((s) => (
                                                                        <span key={s}>{s}</span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p
                                                                    className={`mt-2 text-sm font-medium ${
                                                                        status.sedangBuka
                                                                            ? 'text-emerald-700 dark:text-emerald-400'
                                                                            : 'text-gray-600 dark:text-gray-400'
                                                                    }`}
                                                                >
                                                                    Tutup
                                                                </p>
                                                            )}
                                                        </div>

                                                        <Link
                                                            href={`/lokasi/${loc.slug}`}
                                                            className="mt-4 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:from-emerald-400 hover:to-green-500 hover:shadow-emerald-500/30 bg-gradient-to-r from-emerald-500 to-green-600"
                                                        >
                                                            Lihat Detail
                                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                        </Link>
                                                    </div>

                                                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                                                            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                                Jadwal 7 Hari
                                                            </span>
                                                            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                        <JadwalTable jamBuka={loc.jam_buka} />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {/* LOKASI LAINNYA (terbaru di posisi paling kanan) */}
                                {lokasis.some((loc) => !loc.is_utama) && (
                                    <div
                                        className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                        style={{ direction: 'rtl' }}
                                    >
                                        {lokasis
                                            .filter((loc) => !loc.is_utama)
                                            .map((loc, i) => {
                                                const status = statusHariIni(loc.jam_buka);

                                                return (
                                                    <motion.div
                                                        key={loc.id}
                                                        dir="ltr"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.05, duration: 0.5 }}
                                                    >
                                                        <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-slate-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-gray-800 dark:bg-gray-900">
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                                                                    <MapPin className="h-5 w-5" />
                                                                </div>
                                                                <StatusPill sedangBuka={status.sedangBuka} />
                                                            </div>

                                                            <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                                                                {loc.nama}
                                                            </h3>

                                                            {loc.alamat && (
                                                                <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                                                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                                    {loc.alamat}
                                                                </p>
                                                            )}

                                                            <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                                                                <JadwalTable jamBuka={loc.jam_buka} compact />
                                                            </div>

                                                            <Link
                                                                href={`/lokasi/${loc.slug}`}
                                                                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
                                                            >
                                                                Lihat Detail
                                                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>

                {/* PENGUMUMAN & KEGIATAN SECTION */}
                <section id="informasi" className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
                    <SectionHeading
                        eyebrow="Informasi"
                        title="Pengumuman & Kegiatan"
                        description="Informasi resmi dan agenda kegiatan terbaru dari Perpustakaan Ibrahimy."
                    />

                    <div className="grid gap-10 lg:grid-cols-2">
                        {/* PENGUMUMAN */}
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                                    <Megaphone className="h-4 w-4" />
                                </div>
                                <h3 className={`text-xl font-bold ${tc.text}`}>Pengumuman</h3>
                                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                                <Link
                                    href="/informasi/pengumuman"
                                    className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
                                >
                                    Lihat Semua
                                </Link>
                            </div>

                            {!pengumumans || pengumumans.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-700">
                                    <Megaphone className="h-8 w-8 text-gray-400" />
                                    <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">
                                        Belum ada pengumuman
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pengumumans.map((p, i) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05, duration: 0.5 }}
                                        >
                                            <Link
                                                href={`/informasi/pengumuman/${p.slug}`}
                                                className="group flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-gray-800 dark:bg-gray-900"
                                            >
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                                    <Megaphone className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {formatTanggal(p.created_at) || '—'}
                                                    </div>

                                                    <h4 className="line-clamp-2 font-bold text-gray-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                                        {p.judul}
                                                    </h4>

                                                    <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                                        {p.deskripsi}
                                                    </p>
                                                </div>

                                                <div className="flex flex-shrink-0 items-center self-center text-emerald-600 dark:text-emerald-400">
                                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* KEGIATAN */}
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <h3 className={`text-xl font-bold ${tc.text}`}>Kegiatan</h3>
                                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                                <Link
                                    href="/informasi/kegiatan"
                                    className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
                                >
                                    Lihat Semua
                                </Link>
                            </div>

                            {!kegiatans || kegiatans.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-700">
                                    <Calendar className="h-8 w-8 text-gray-400" />
                                    <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">
                                        Belum ada kegiatan
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {kegiatans.map((k, i) => (
                                        <motion.div
                                            key={k.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05, duration: 0.5 }}
                                        >
                                            <div className="group flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-gray-800 dark:bg-gray-900">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                                    <Calendar className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {formatTanggal(k.tanggal) || '—'}
                                                        {k.waktu && (
                                                            <>
                                                                <span>·</span>
                                                                <Clock className="h-3.5 w-3.5" />
                                                                {k.waktu}
                                                            </>
                                                        )}
                                                    </div>

                                                    <h4 className="line-clamp-2 font-bold text-gray-900 dark:text-white">
                                                        {k.nama}
                                                    </h4>

                                                    {(k.nama_lokasi || k.tempat) && (
                                                        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                                            {k.nama_lokasi || k.tempat}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* BERITA SECTION */}
                <section
                    id="berita"
                    className="border-t border-gray-200 bg-white py-16 md:py-20 dark:border-gray-800 dark:bg-gray-900/40"
                >
                    <div className="mx-auto max-w-7xl px-6 md:px-12">
                        <SectionHeading
                            eyebrow="Berita"
                            title="Kabar Terbaru"
                            description="Berita dan informasi terbaru seputar Perpustakaan Ibrahimy."
                            href="/berita"
                        />

                        {!beritas || beritas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
                                <Newspaper className="h-10 w-10 text-gray-400" />
                                <p className="mt-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    Belum ada berita
                                </p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Berita akan tampil di sini setelah diterbitkan.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {beritas.map((b, i) => (
                                    <motion.div
                                        key={b.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05, duration: 0.5 }}
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
                                                    {formatTanggal(b.tanggal) || '—'}
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
                        )}
                    </div>
                </section>

                {/* FLOATING THEME TOGGLE */}
                <button
                    onClick={cycleAppearance}
                    className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-xl dark:bg-gray-800 dark:text-white"
                    title={`Mode: ${appearance}`}
                >
                    <AppearanceIcon className="h-5 w-5" />
                </button>

                <Footer tc={tc} tentangs={tentangs} jenisLayanans={jenisLayanans} />
            </div>
        </>
    );
}
