"use client"

import { Head } from "@inertiajs/react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Moon, Sun } from "lucide-react"
import PublicHeader from "@/components/public-header"
import PublicHero from "@/components/public-hero"
import { useAppearance } from "@/hooks/use-appearance"
import { useThemeClasses } from "@/hooks/use-theme-classes"
import Footer from "@/layouts/footer"
import { formatTanggal } from "@/lib/format-date"

type KegiatanPublic = {
    id: number
    nama: string
    tanggal: string | null
    waktu_mulai: string | null
    waktu_selesai: string | null
    tempat: string | null
    deskripsi: string | null
    waktu?: string | null
    nama_lokasi?: string | null
}

export default function KegiatanPublic({
    kegiatans,
    tentangs,
    jenisLayanans,
}: {
    kegiatans: KegiatanPublic[]
    tentangs?: { nama: string; slug: string; deskripsi?: string }[]
    jenisLayanans?: { id: number; nama: string; slug: string; deskripsi?: string }[]
}) {
    const { tc } = useThemeClasses()
    const { appearance, updateAppearance } = useAppearance()

    const cycleAppearance = () => {
        const modes: Array<'light' | 'dark'> = ['light', 'dark']
        const idx = modes.indexOf(appearance as 'light' | 'dark')
        updateAppearance(modes[(idx + 1) % modes.length])
    }

    const AppearanceIcon = appearance === 'dark' ? Moon : Sun

    return (
        <>
            <Head title="Kegiatan" />

            <div
                className={`relative min-h-screen overflow-hidden bg-slate-50 font-sans text-foreground transition-all duration-500 dark:bg-slate-950 ${tc.selection}`}
            >
                <div
                    className={`pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tc.orb}`}
                ></div>

                <PublicHeader tentangs={tentangs} jenisLayanans={jenisLayanans} />

                <PublicHero
                    title="Kegiatan"
                    subtitle="Agenda dan kegiatan yang diselenggarakan oleh Perpustakaan Ibrahimy."
                    crumbs={[{ label: 'Beranda', href: '/' }, { label: 'Informasi', href: '/informasi/kegiatan' }, { label: 'Kegiatan' }]}
                />

                {/* CONTENT */}
                <div className="mx-auto max-w-6xl px-6 py-12 md:px-12">
                    {kegiatans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center dark:border-gray-700">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                Belum ada kegiatan
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Kegiatan akan tampil di sini setelah dijadwalkan.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {kegiatans.map((k, i) => (
                                <motion.div
                                    key={k.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                    className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                                            <Calendar className="h-5 w-5" />
                                        </div>

                                        {k.waktu && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                                <Clock className="h-3 w-3" />
                                                {k.waktu}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {k.nama}
                                    </h3>

                                    <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                        {formatTanggal(k.tanggal)}
                                    </p>

                                    {(k.nama_lokasi || k.tempat) && (
                                        <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                            <MapPin className="h-4 w-4 flex-shrink-0" />
                                            {k.nama_lokasi || k.tempat}
                                        </p>
                                    )}

                                    {k.deskripsi && (
                                        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                            {k.deskripsi}
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={cycleAppearance}
                    className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-xl dark:bg-gray-800 dark:text-white"
                    title={`Mode: ${appearance}`}
                >
                    <AppearanceIcon className="h-5 w-5" />
                </button>

                <Footer tc={tc} />
            </div>
        </>
    )
}

KegiatanPublic.layout = {
    title: 'Kegiatan Perpustakaan',
    description: 'Agenda dan kegiatan Perpustakaan Ibrahimy.',
}
