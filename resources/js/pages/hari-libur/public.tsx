"use client"

import { Head } from "@inertiajs/react"
import { motion } from "framer-motion"
import { CalendarOff, MapPin, Moon, Sun } from "lucide-react"
import PublicHeader from "@/components/public-header"
import PublicHero from "@/components/public-hero"
import { useAppearance } from "@/hooks/use-appearance"
import { useThemeClasses } from "@/hooks/use-theme-classes"
import Footer from "@/layouts/footer"
import { formatTanggal } from "@/lib/format-date"

type HariLiburPublic = {
    id: number
    nama: string
    tanggal: string | null
    keterangan: string | null
    nama_lokasis: string[]
    label_mode?: string
    label_shif?: string
}

export default function HariLiburPublic({
    hariLiburs,
    tentangs,
    jenisLayanans,
}: {
    hariLiburs: HariLiburPublic[]
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
            <Head title="Hari Libur" />

            <div
                className={`relative min-h-screen overflow-hidden bg-slate-50 font-sans text-foreground transition-all duration-500 dark:bg-slate-950 ${tc.selection}`}
            >
                <div
                    className={`pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tc.orb}`}
                ></div>

                <PublicHeader tentangs={tentangs} jenisLayanans={jenisLayanans} />

                <PublicHero
                    title="Hari Libur"
                    subtitle="Jadwal hari libur dan penutupan layanan Perpustakaan Ibrahimy."
                    crumbs={[{ label: 'Beranda', href: '/' }, { label: 'Informasi', href: '/informasi/hari-libur' }, { label: 'Hari Libur' }]}
                />

                {/* CONTENT */}
                <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
                    {hariLiburs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center dark:border-gray-700">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                Tidak ada hari libur terjadwal
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Jadwal hari libur akan tampil di sini.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {hariLiburs.map((h, i) => (
                                <motion.div
                                    key={h.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                    className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                                        <CalendarOff className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {h.nama}
                                        </h3>

                                        <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                            {formatTanggal(h.tanggal)}
                                        </p>

                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                                {h.label_mode}
                                            </span>

                                            {h.label_shif && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                                    {h.label_shif}
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                            <MapPin className="h-4 w-4 flex-shrink-0" />
                                            {h.nama_lokasis?.join(', ') || 'Semua Lokasi'}
                                        </p>

                                        {h.keterangan && (
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                {h.keterangan}
                                            </p>
                                        )}
                                    </div>
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

HariLiburPublic.layout = {
    title: 'Hari Libur Perpustakaan',
    description: 'Jadwal hari libur Perpustakaan Ibrahimy.',
}
