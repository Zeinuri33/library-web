'use client';

import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    MapPin,
    Megaphone,
    Newspaper,
    Radio,
    RefreshCw,
    Sun,
    Users,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfoTicker from '@/components/info-ticker';
import type { InfoTickerItem } from '@/components/info-ticker';
import { useKiosk } from '@/hooks/use-kiosk';
import { formatTanggal } from '@/lib/format-date';
import { nextBuka, statusHariIni } from '@/lib/jam-buka';
import type { JamBukaItem } from '@/lib/jam-buka';

type PengunjungData = {
    tanggal?: string | null;
    total_pengunjung_hari_ini?: number;
    total_shift_ini?: number;
    current_shift?: string | null;
    detail_ruangan?: { ruang: string; jumlah: number }[];
} | null;

type BeritaItem = {
    id: number;
    judul: string;
    slug: string;
    tanggal: string | null;
};

type KegiatanItem = {
    id: number;
    nama: string;
    tanggal: string | null;
    waktu?: string | null;
    nama_lokasi?: string | null;
    tempat?: string | null;
};

type PengumumanItem = {
    id: number;
    judul: string;
    slug: string;
    created_at: string | null;
    deskripsi?: string;
};

type HariLiburItem = {
    id: number;
    nama: string;
    tanggal: string | null;
};

type LokasiUtama = {
    id: number;
    nama: string;
    jam_buka?: JamBukaItem[];
} | null;

const fmt = (n?: number) =>
    n === undefined || n === null ? '--' : n.toLocaleString('id-ID');

const pad = (n: number) => String(n).padStart(2, '0');

export default function PengunjungPublic({
    pengunjung,
    beritas,
    kegiatans,
    pengumumans,
    hariLiburs,
    lokasiUtama,
    kiosk = false,
}: {
    pengunjung: PengunjungData;
    beritas: BeritaItem[];
    kegiatans: KegiatanItem[];
    pengumumans: PengumumanItem[];
    hariLiburs: HariLiburItem[];
    lokasiUtama: LokasiUtama;
    /** Mode kiosk otomatis (layar TV). Bisa dimatikan via `?kiosk=0`. */
    kiosk?: boolean;
}) {
    const [data, setData] = useState<PengunjungData>(pengunjung);
    const [lastSync, setLastSync] = useState<Date>(() => new Date());
    const [refreshing, setRefreshing] = useState(false);
    const [now, setNow] = useState(() => new Date());
    const inFlight = useRef(false);

    const refresh = useCallback(async () => {
        // Hindari request bertumpuk saat interval polling sangat cepat (1 detik).
        if (inFlight.current) {
            return;
        }

        inFlight.current = true;
        setRefreshing(true);

        try {
            const res = await fetch('/pengunjung/data');

            if (res.ok) {
                const json = await res.json();

                if (json?.status === 'success' && json.data) {
                    setData(json.data);
                    setLastSync(new Date());
                }
            }
        } catch {
            // Biarkan data lama tetap tampil
        } finally {
            inFlight.current = false;
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        // Muat segera saat halaman dibuka (ditunda 0ms agar tidak sinkron),
        // lalu poll ulang setiap 1 detik agar nyaris real-time.
        const timer = setTimeout(refresh, 0);
        const id = setInterval(refresh, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(id);
        };
    }, [refresh]);

    useEffect(() => {
        // Jam digital di pojok kanan atas (berdetak setiap detik).
        const id = setInterval(() => setNow(new Date()), 1000);

        return () => clearInterval(id);
    }, []);

    // Mode kiosk otomatis untuk layar TV. `?kiosk=0` di URL menonaktifkannya
    // (mis. saat tes/administrasi dari browser biasa).
    const kioskParam =
        typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('kiosk')
            : null;
    const kioskEnabled = kioskParam === '0' ? false : kiosk;

    useKiosk({ enabled: kioskEnabled });

    const tickerItems: InfoTickerItem[] = [
        ...beritas.map((b) => ({
            id: `berita-${b.id}`,
            type: 'berita' as const,
            label: 'Berita',
            title: b.judul,
            date: b.tanggal,
            href: `/berita/${b.slug}`,
        })),
        ...pengumumans.map((p) => ({
            id: `pengumuman-${p.id}`,
            type: 'pengumuman' as const,
            label: 'Pengumuman',
            title: p.judul,
            date: p.created_at,
            href: `/informasi/pengumuman/${p.slug}`,
        })),
        ...kegiatans.map((k) => ({
            id: `kegiatan-${k.id}`,
            type: 'kegiatan' as const,
            label: 'Kegiatan',
            title: k.nama,
            date: k.tanggal,
            href: '/informasi/kegiatan',
        })),
        ...hariLiburs.map((h) => ({
            id: `hari-libur-${h.id}`,
            type: 'hari-libur' as const,
            label: 'Hari Libur',
            title: h.nama,
            date: h.tanggal,
            href: '/informasi/hari-libur',
        })),
    ];

    const total = data?.total_pengunjung_hari_ini;
    const totalShift = data?.total_shift_ini ?? total;
    const rooms = data?.detail_ruangan ?? [];
    const status = statusHariIni(lokasiUtama?.jam_buka, now);

    // Label mengikuti SHIFT AKTIF dari server (bukan shift pertama hari ini),
    // agar konsisten dengan total_shift_ini yang dihitung per shift.
    const activeShift = data?.current_shift ?? null;
    const aktifLabel = activeShift
        ? status.shifts.find((s) => s.toLowerCase().startsWith(activeShift))
        : undefined;
    const shiftLabel = aktifLabel
        ? `Shift ${aktifLabel}`
        : activeShift
          ? `Shift ${activeShift.charAt(0).toUpperCase() + activeShift.slice(1)}`
          : status.sedangBuka
            ? 'Sedang Buka'
            : 'Di Luar Jam Buka';

    // Countdown menuju jam buka berikutnya (saat tutup)
    const nextOpen = lokasiUtama ? nextBuka(lokasiUtama.jam_buka, now) : null;
    const remainingMs = nextOpen ? Math.max(0, nextOpen.getTime() - now.getTime()) : 0;
    const days = Math.floor(remainingMs / 86400000);
    const hours = Math.floor(remainingMs / 3600000) % 24;
    const minutes = Math.floor(remainingMs / 60000) % 60;
    const seconds = Math.floor(remainingMs / 1000) % 60;
    const targetLabel = nextOpen
        ? `${nextOpen.toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })} · ${pad(nextOpen.getHours())}.${pad(nextOpen.getMinutes())}`
        : '';

    return (
        <>
            <Head title="Pengunjung" />

            {/* Layar TV: tanpa scroll di md+; di layar kecil (mis. hp) diizinkan scroll agar konten tidak terpotong */}
            <div
                className={`relative flex min-h-dvh w-full flex-col overflow-y-auto bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-900 font-sans md:h-dvh md:overflow-hidden ${kioskEnabled ? 'select-none' : ''}`}
                onClickCapture={
                    kioskEnabled
                        ? (e) => {
                              // Mode kiosk: cegah tautan mengarah keluar layar TV.
                              const target = e.target as HTMLElement | null;

                              if (target?.closest('a')) {
                                  e.preventDefault();
                                  e.stopPropagation();
                              }
                          }
                        : undefined
                }
            >
                {/* ANIMATED ORBS (seperti hero halaman beranda) */}
                <motion.div
                    className="pointer-events-none absolute inset-0 z-0 opacity-60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <motion.div
                        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-300/40 mix-blend-multiply blur-[130px] dark:mix-blend-lighten"
                        animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
                        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute -right-24 -bottom-24 h-[28rem] w-[28rem] rounded-full bg-green-300/40 mix-blend-multiply blur-[140px] dark:mix-blend-lighten"
                        animate={{ y: [0, -25, 0], x: [0, 20, 0] }}
                        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
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

                {/* CONTENT — layout buka vs tutup */}
                {status.sedangBuka ? (
                    <div className="relative z-[2] mx-auto grid min-h-0 w-full max-w-[1700px] flex-1 grid-cols-1 gap-8 overflow-hidden px-6 py-6 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:px-10 md:py-8 xl:px-14">
                    {/* ================= KIRI: COUNTER ================= */}
                    <div className="flex min-h-0 flex-col justify-between gap-4">
                        <Branding />

                        {/* JAM KECIL — di atas status (tanpa card) */}
                        <div className="flex items-center justify-center">
                            <DigitalClock now={now} />
                        </div>

                        {/* STATUS BUKA/TUTUP */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {lokasiUtama && (
                                <StatusPill
                                    sedangBuka={status.sedangBuka}
                                    shifts={status.shifts}
                                />
                            )}
                        </div>

                        {/* ANGKA TOTAL RAKSASA — label mengikuti shift jam buka */}
                        <div className="flex flex-col items-center">
                            <p className="text-xs font-semibold tracking-[0.25em] text-emerald-100/90 uppercase md:text-sm">
                                {shiftLabel}
                            </p>

                            <div className="mt-1 flex items-center gap-4 md:mt-2 md:gap-6">
                                <motion.span
                                    key={fmt(totalShift)}
                                    initial={{ scale: 0.85, opacity: 0.4 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 260,
                                        damping: 18,
                                    }}
                                    className="bg-gradient-to-b from-white via-white to-emerald-200 bg-clip-text text-9xl leading-none font-extrabold text-transparent drop-shadow-lg md:text-[10rem] xl:text-[14rem]"
                                >
                                    {fmt(totalShift)}
                                </motion.span>

                                {/* Total pengunjung hari ini — di bawah ikon users (seukuran ikon) */}
                                <div className="hidden flex-col items-center gap-1.5 sm:flex">
                                    <Users className="h-14 w-14 text-emerald-100/60 md:h-16 md:w-16" />
                                    <span className="text-4xl leading-none font-extrabold text-white md:text-5xl">
                                        {fmt(total)}
                                    </span>
                                    <span className="text-[10px] font-semibold tracking-widest text-white/60 uppercase">
                                        Total Hari Ini
                                    </span>
                                </div>
                            </div>

                            {data?.tanggal && (
                                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-md">
                                    <Calendar className="h-4 w-4" />
                                    {formatTanggal(data.tanggal)}
                                </p>
                            )}
                        </div>

                        {/* RINCIAN PER RUANGAN */}
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-xs font-bold tracking-widest text-white/90 uppercase md:text-sm">
                                    Rincian Per Ruangan
                                </h2>
                                <div className="ml-4 h-px flex-1 bg-white/20"></div>
                            </div>

                            {rooms.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-white/30 bg-white/10 py-4 text-center text-sm text-white/70 backdrop-blur-md">
                                    Belum ada pengunjung di ruangan manapun hari ini.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
                                    {[...rooms]
                                        .sort((a, b) => b.jumlah - a.jumlah)
                                        .map((item, i) => (
                                            <motion.div
                                                key={item.ruang}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.06, duration: 0.4 }}
                                                className="group rounded-xl border border-white/20 bg-white/10 p-2.5 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20 md:p-3"
                                            >
                                                <div className="truncate text-[10px] font-bold tracking-widest text-white/60 uppercase transition-colors duration-300 group-hover:text-white md:text-xs">
                                                    {item.ruang}
                                                </div>
                                                <div className="mt-0.5 text-2xl font-extrabold text-white md:text-3xl">
                                                    {fmt(item.jumlah)}
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* ================= KANAN: INFORMASI BERGERAK ================= */}
                    <div className="flex min-h-0 flex-col justify-center gap-6">
                        {/* INFO TICKER — tinggi pas dengan konten & tidak berubah-ubah antar item */}
                        {tickerItems.length > 0 && (
                            <motion.div
                                className="w-full"
                                animate={{ y: [0, -8, 0] }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            >
                                <InfoTicker items={tickerItems} className="w-full max-w-none" />
                            </motion.div>
                        )}

                        {/* AGENDA KEGIATAN — selalu tampil */}
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 1.2,
                            }}
                            className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md md:p-5"
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white">
                                    <Calendar className="h-4 w-4" />
                                </span>
                                <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                                    Agenda Kegiatan
                                </h3>
                            </div>

                            {kegiatans.length === 0 ? (
                                <p className="rounded-lg border border-dashed border-white/20 py-3 text-center text-sm text-white/60">
                                    Belum ada kegiatan yang dijadwalkan.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {kegiatans.slice(0, 2).map((k) => (
                                        <div key={k.id}>
                                            <p className="line-clamp-1 text-sm font-semibold text-white">
                                                {k.nama}
                                            </p>
                                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/60">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatTanggal(k.tanggal)}
                                                {(k.nama_lokasi || k.tempat) && (
                                                    <>
                                                        <span>·</span>
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {k.nama_lokasi || k.tempat}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* HARI LIBUR — selalu tampil */}
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 1.8,
                            }}
                            className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md md:p-5"
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white">
                                    <Sun className="h-4 w-4" />
                                </span>
                                <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                                    Hari Libur
                                </h3>
                            </div>

                            {hariLiburs.length === 0 ? (
                                <p className="rounded-lg border border-dashed border-white/20 py-3 text-center text-sm text-white/60">
                                    Belum ada hari libur terdekat.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {hariLiburs.slice(0, 2).map((h) => (
                                        <div key={h.id}>
                                            <p className="line-clamp-1 text-sm font-semibold text-white">
                                                {h.nama}
                                            </p>
                                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/60">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatTanggal(h.tanggal)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
                ) : (
                    /* ============ LAYOUT SAAT TUTUP: COUNTDOWN + CARD INFO ============ */
                    <div className="relative z-[2] mx-auto flex min-h-0 w-full max-w-[1700px] flex-1 flex-col gap-6 overflow-hidden px-6 py-6 md:px-10 md:py-8 xl:px-14">
                        {/* TOP ROW: branding saja */}
                        <div>
                            <Branding />
                        </div>

                        {/* COUNTDOWN BESAR DI TENGAH */}
                        <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
                            {/* JAM + BADGE — diposisikan lebih ke bawah */}
                            <div className="flex flex-col items-center gap-2">
                                <DigitalClock now={now} small />
                                <StatusPill
                                    sedangBuka={status.sedangBuka}
                                    shifts={status.shifts}
                                />
                            </div>

                            <p className="mt-6 text-xs font-semibold tracking-[0.25em] text-emerald-100/90 uppercase md:text-sm">
                                Perpustakaan Sedang Tutup
                            </p>

                            <h2 className="mt-1 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-lg font-extrabold text-transparent md:text-2xl">
                                Buka Dalam
                            </h2>

                            {nextOpen ? (
                                <>
                                    <div className="mt-5 flex items-center gap-3 md:gap-6">
                                        {days > 0 && (
                                            <CountdownBlock value={pad(days)} label="Hari" />
                                        )}
                                        <CountdownBlock value={pad(hours)} label="Jam" />
                                        <CountdownBlock value={pad(minutes)} label="Menit" />
                                        <CountdownBlock value={pad(seconds)} label="Detik" />
                                    </div>

                                    <p className="mt-2 text-sm text-white/70 md:text-base">
                                        Buka: {targetLabel}
                                    </p>
                                </>
                            ) : (
                                <p className="mt-6 rounded-xl border border-dashed border-white/25 px-6 py-4 text-sm text-white/70 md:text-base">
                                    Jadwal buka belum diatur.
                                </p>
                            )}
                        </div>

                        {/* CARD INFO DI BAWAH COUNTDOWN — 3 card, tinggi stabil */}
                        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <InfoListCard
                                icon={Newspaper}
                                title="Berita"
                                emptyText="Belum ada berita."
                                items={beritas.map((b) => ({
                                    id: `berita-${b.id}`,
                                    title: b.judul,
                                    date: b.tanggal,
                                }))}
                            />

                            <InfoListCard
                                icon={Calendar}
                                title="Agenda Kegiatan"
                                emptyText="Belum ada kegiatan yang dijadwalkan."
                                items={kegiatans.map((k) => ({
                                    id: `kegiatan-${k.id}`,
                                    title: k.nama,
                                    date: k.tanggal,
                                    sub: k.nama_lokasi || k.tempat || null,
                                }))}
                            />

                            <InfoListCard
                                icon={Sun}
                                title="Hari Libur"
                                emptyText="Belum ada hari libur terdekat."
                                items={hariLiburs.map((h) => ({
                                    id: `hari-libur-${h.id}`,
                                    title: h.nama,
                                    date: h.tanggal,
                                }))}
                            />
                        </div>
                    </div>
                )}

                {/* BADGE SINKRON — pojok kanan atas (disembunyikan dalam mode kiosk) */}
                {!kioskEnabled && (
                    <div className="absolute top-4 right-4 z-[3] flex items-center gap-2 md:top-6 md:right-8">
                        <p className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white/80 backdrop-blur-md md:text-sm">
                            <Clock className="h-4 w-4" />
                            Sinkron: {lastSync.toLocaleTimeString('id-ID')}
                        </p>
                        <button
                            type="button"
                            onClick={refresh}
                            disabled={refreshing}
                            title="Perbarui data"
                            aria-label="Perbarui data"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white/80 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/50 hover:text-white disabled:pointer-events-none disabled:opacity-60"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                            />
                        </button>
                    </div>
                )}

                {/* TEKS BERJALAN PENGUMUMAN — sepanjang layar di bagian bawah */}
                {pengumumans.length > 0 && (
                    <div className="relative z-[3] mx-4 mb-4 overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md md:mx-10 md:mb-6">
                        <div className="flex w-max animate-[marquee_18s_linear_infinite]">
                            {[0, 1].map((dup) => (
                                <div
                                    key={dup}
                                    aria-hidden={dup === 1}
                                    className="flex shrink-0 items-center gap-10 py-2.5 pr-10 md:py-3"
                                >
                                    {pengumumans.slice(0, 4).map((p) => (
                                        <span
                                            key={`${dup}-${p.id}`}
                                            className="flex items-center gap-2.5 text-sm font-medium whitespace-nowrap text-white/90 md:text-base"
                                        >
                                            <Megaphone className="h-4 w-4 shrink-0 text-emerald-300 md:h-5 md:w-5" />
                                            <span className="font-bold text-white">{p.judul}</span>
                                            {p.created_at && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-white/85">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatTanggal(p.created_at)}
                                                </span>
                                            )}
                                            {p.deskripsi && (
                                                <span className="text-white/75">
                                                    — {p.deskripsi}
                                                </span>
                                            )}
                                            <span className="ml-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* OVERLAY ERROR (jika data pengunjung tidak tersedia) */}
                {data === null && (
                    <div className="absolute inset-0 z-[5] flex items-center justify-center bg-emerald-950/70 backdrop-blur-sm">
                        <div className="mx-6 flex max-w-md flex-col items-center rounded-3xl border border-white/20 bg-white/10 px-8 py-10 text-center backdrop-blur-xl">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300">
                                <Radio className="h-7 w-7" />
                            </div>
                            <p className="mt-4 text-lg font-bold text-white">
                                Data pengunjung tidak tersedia
                            </p>
                            <p className="mt-1 text-sm text-white/70">
                                Gagal terhubung ke server pemantau pengunjung.
                                Silakan coba lagi.
                            </p>
                            <button
                                type="button"
                                onClick={refresh}
                                disabled={refreshing}
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-emerald-700 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
                            >
                                <RefreshCw
                                    className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                                />
                                Muat Ulang
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function Branding() {
    return (
        <div className="flex items-center gap-3">
            <img
                src="/kubah-putih.png"
                alt="Kubah"
                className="h-12 w-12 md:h-14 md:w-14"
            />
            <div className="min-w-0">
                <h1 className="truncate bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-lg font-extrabold text-transparent md:text-2xl">
                    Perpustakaan Ibrahimy
                </h1>
                <p className="text-xs text-emerald-100/80 md:text-sm">
                    NPP: 3512142F2006567
                </p>
            </div>
        </div>
    );
}

function DigitalClock({ now, small = false }: { now: Date; small?: boolean }) {
    return (
        <p
            className={`leading-none font-extrabold tracking-tight text-white tabular-nums drop-shadow ${
                small ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl lg:text-5xl'
            }`}
        >
            {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
        </p>
    );
}

function StatusPill({ sedangBuka, shifts }: { sedangBuka: boolean; shifts: string[] }) {
    return (
        <span
            className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-2 whitespace-nowrap backdrop-blur-md ${
                sedangBuka
                    ? 'border-emerald-300/40 bg-emerald-400/20'
                    : 'border-rose-300/40 bg-rose-400/20'
            }`}
        >
            <span className="relative flex h-2.5 w-2.5">
                <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                        sedangBuka ? 'bg-emerald-300' : 'bg-rose-300'
                    }`}
                ></span>
                <span
                    className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                        sedangBuka ? 'bg-emerald-300' : 'bg-rose-300'
                    }`}
                ></span>
            </span>
            <span
                className={`text-xs font-bold tracking-widest uppercase ${
                    sedangBuka ? 'text-emerald-100' : 'text-rose-100'
                }`}
            >
                {sedangBuka ? 'Sedang Buka' : 'Saat Ini Tutup'}
            </span>
            {shifts.length > 0 && (
                <span className="text-xs font-medium text-white/70">
                    {shifts.join(' · ')}
                </span>
            )}
        </span>
    );
}

function CountdownBlock({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <span className="min-w-[3ch] rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-6xl font-extrabold text-white tabular-nums backdrop-blur-md md:px-7 md:py-5 md:text-8xl">
                {value}
            </span>
            <span className="text-xs font-bold tracking-widest text-white/70 uppercase md:text-sm">
                {label}
            </span>
        </div>
    );
}

function InfoListCard({
    icon: Icon,
    title,
    items,
    emptyText,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    items: { id: string; title: string; date: string | null; sub?: string | null }[];
    emptyText: string;
}) {
    return (
        <div className="flex h-full min-h-[150px] flex-col rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md md:min-h-[170px] md:p-5">
            <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white">
                    <Icon className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                    {title}
                </h3>
            </div>

            {items.length === 0 ? (
                <p className="rounded-lg border border-dashed border-white/20 py-3 text-center text-sm text-white/60">
                    {emptyText}
                </p>
            ) : (
                <div className="space-y-3">
                    {items.map((it) => (
                        <div key={it.id}>
                            <p className="line-clamp-1 text-sm font-semibold text-white">
                                {it.title}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/60">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatTanggal(it.date)}
                                {it.sub && (
                                    <>
                                        <span>·</span>
                                        <MapPin className="h-3.5 w-3.5" />
                                        {it.sub}
                                    </>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

PengunjungPublic.layout = {
    title: 'Statistik Pengunjung',
    description: 'Statistik kunjungan harian Perpustakaan Ibrahimy secara langsung.',
};
