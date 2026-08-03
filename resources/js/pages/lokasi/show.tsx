"use client"

import { Head, Link } from "@inertiajs/react"
import { motion } from "framer-motion"
import { divIcon } from "leaflet"
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    ExternalLink,
    Mail,
    MapPin,
    Moon,
    Phone,
    Sun,
} from "lucide-react"
import { LayersControl, MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

import { JadwalTable, StatusPill } from "@/components/jadwal-table"
import PublicHeader from "@/components/public-header"
import PublicHero from "@/components/public-hero"
import { useAppearance } from "@/hooks/use-appearance"
import { useThemeClasses } from "@/hooks/use-theme-classes"
import Footer from "@/layouts/footer"
import { NAMA_HARI, statusHariIni } from "@/lib/jam-buka"
import type { JamBukaItem } from "@/lib/jam-buka"

type LokasiPublic = {
    id: number
    nama: string
    slug: string
    alamat: string | null
    telepon: string | null
    email: string | null
    deskripsi: string | null
    latitude: number | null
    longitude: number | null
    is_utama: boolean
    jam_buka?: JamBukaItem[]
}

const markerIcon = divIcon({
    className: "",
    html: `<div style="position:relative;width:20px;height:28px;">
        <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:16px;height:16px;border-radius:9999px;background:#10b981;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.45);"></div>
        <div style="position:absolute;top:15px;left:50%;transform:translateX(-50%) rotate(45deg);width:9px;height:9px;background:#10b981;"></div>
    </div>`,
    iconSize: [20, 28],
    iconAnchor: [10, 28],
})

function LokasiMap({
    latitude,
    longitude,
    nama,
}: {
    latitude: number
    longitude: number
    nama: string
}) {
    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={18}
            className="h-full w-full"
        >
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="🛰️ Hybrid">
                    <TileLayer
                        attribution="Google Maps"
                        url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                        maxZoom={22}
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="🗺️ Street">
                    <TileLayer
                        attribution="Google Maps"
                        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                        maxZoom={22}
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="📸 Satellite">
                    <TileLayer
                        attribution="Google Maps"
                        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                        maxZoom={22}
                    />
                </LayersControl.BaseLayer>
            </LayersControl>

            <Marker position={[latitude, longitude]} icon={markerIcon}>
                <Popup>{nama}</Popup>
            </Marker>
        </MapContainer>
    )
}

export default function ShowLokasi({
    lokasi,
    lokasiLainnya,
    tentangs,
    jenisLayanans,
}: {
    lokasi: LokasiPublic
    lokasiLainnya: {
        id: number
        nama: string
        slug: string
        alamat: string | null
        is_utama: boolean
    }[]
    tentangs?: { nama: string; slug: string; deskripsi?: string }[]
    jenisLayanans?: { id: number; nama: string; slug: string; deskripsi?: string }[]
}) {
    const { tc } = useThemeClasses()
    const { appearance, updateAppearance } = useAppearance()

    const cycleAppearance = () => {
        const modes: Array<"light" | "dark"> = ["light", "dark"]
        const idx = modes.indexOf(appearance as "light" | "dark")
        updateAppearance(modes[(idx + 1) % modes.length])
    }

    const AppearanceIcon = appearance === "dark" ? Moon : Sun

    const status = statusHariIni(lokasi.jam_buka)
    const hasCoords = lokasi.latitude !== null && lokasi.longitude !== null
    const mapsUrl = hasCoords
        ? `https://www.google.com/maps?q=${lokasi.latitude},${lokasi.longitude}`
        : null

    return (
        <>
            <Head title={lokasi.nama} />

            <div
                className={`relative min-h-screen overflow-hidden bg-slate-50 font-sans text-foreground transition-all duration-500 dark:bg-slate-950 ${tc.selection}`}
            >
                <div
                    className={`pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tc.orb}`}
                ></div>

                <PublicHeader tentangs={tentangs} jenisLayanans={jenisLayanans} />

                <PublicHero
                    title={lokasi.nama}
                    subtitle={lokasi.alamat ?? "Detail lokasi Perpustakaan Ibrahimy."}
                    crumbs={[
                        { label: "Beranda", href: "/" },
                        { label: "Lokasi", href: "/#jam-buka" },
                        { label: lokasi.nama },
                    ]}
                />

                {/* CONTENT */}
                <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* MAIN */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* STATUS HARI INI */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="rounded-2xl border border-emerald-500/30 bg-white p-5 shadow-sm dark:border-emerald-500/20 dark:bg-gray-900"
                            >
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
                                                ? "text-emerald-700 dark:text-emerald-400"
                                                : "text-gray-600 dark:text-gray-400"
                                        }`}
                                    >
                                        {status.shifts.map((s) => (
                                            <span key={s}>{s}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Tutup
                                    </p>
                                )}

                                {lokasi.is_utama && (
                                    <span className="mt-3 inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                                        Lokasi Utama
                                    </span>
                                )}
                            </motion.div>

                            {/* DESKRIPSI */}
                            {lokasi.deskripsi && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                                        Tentang Lokasi
                                    </h2>
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                        {lokasi.deskripsi}
                                    </p>
                                </motion.div>
                            )}

                            {/* IDENTITAS */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.5 }}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                            >
                                <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                                    Informasi Kontak
                                </h2>

                                <div className="space-y-3">
                                    {lokasi.alamat && (
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                                    Alamat
                                                </p>
                                                <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                                                    {lokasi.alamat}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {lokasi.telepon && (
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                                <Phone className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                                    Telepon
                                                </p>
                                                <a
                                                    href={`tel:${lokasi.telepon}`}
                                                    className="mt-0.5 inline-block text-sm text-gray-700 transition-colors hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
                                                >
                                                    {lokasi.telepon}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {lokasi.email && (
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                                    Email
                                                </p>
                                                <a
                                                    href={`mailto:${lokasi.email}`}
                                                    className="mt-0.5 inline-block text-sm text-gray-700 transition-colors hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
                                                >
                                                    {lokasi.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* JAM BUKA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                            >
                                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Jam Buka
                                    </h2>
                                    <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <JadwalTable jamBuka={lokasi.jam_buka} />
                            </motion.div>

                            {/* MAP */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.5 }}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Lokasi di Peta
                                    </h2>

                                    {mapsUrl && (
                                        <a
                                            href={mapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:from-emerald-400 hover:to-green-500"
                                        >
                                            Buka di Google Maps
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                </div>

                                {hasCoords ? (
                                    <div className="relative z-0 h-[340px] w-full">
                                        <LokasiMap
                                            latitude={lokasi.latitude!}
                                            longitude={lokasi.longitude!}
                                            nama={lokasi.nama}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center bg-gray-50 py-20 text-center dark:bg-gray-950/40">
                                        <MapPin className="h-10 w-10 text-gray-400" />
                                        <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Lokasi belum dipetakan
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Koordinat lokasi belum diisi oleh pengelola.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* SIDEBAR */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                            >
                                <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                                    Lokasi Lainnya
                                </h2>

                                {lokasiLainnya.length === 0 ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Tidak ada lokasi lain.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {lokasiLainnya.map((l) => (
                                            <Link
                                                key={l.id}
                                                href={`/lokasi/${l.slug}`}
                                                className="group flex items-start gap-3 rounded-xl border border-gray-200 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-gray-800"
                                            >
                                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                                    <MapPin className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="flex flex-wrap items-center gap-1.5 text-sm font-bold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                                        {l.nama}
                                                        {l.is_utama && (
                                                            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold tracking-wide text-emerald-600 uppercase dark:text-emerald-400">
                                                                Utama
                                                            </span>
                                                        )}
                                                    </p>

                                                    {l.alamat && (
                                                        <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                                                            {l.alamat}
                                                        </p>
                                                    )}
                                                </div>

                                                <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-emerald-500 dark:text-gray-600" />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </div>

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
    )
}

ShowLokasi.layout = {
    title: "Lokasi",
    description: "Detail lokasi dan jam buka Perpustakaan Ibrahimy.",
}
