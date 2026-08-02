"use client"

import { Head, Link } from "@inertiajs/react"
import { motion } from "framer-motion"
import { BookOpen, Calendar, Moon, Sun } from "lucide-react"
import PublicHeader from "@/components/public-header"
import PublicHero from "@/components/public-hero"
import { useAppearance } from "@/hooks/use-appearance"
import { useThemeClasses } from "@/hooks/use-theme-classes"
import Footer from "@/layouts/footer"
import { formatTanggal } from "@/lib/format-date"

type BuletinPublic = {
    id: number
    slug: string
    edisi: string
    label_edisi?: string
    tanggal_terbit: string | null
    pdf_url: string | null
}

export default function BuletinPublic({
    buletins,
    tentangs,
    jenisLayanans,
}: {
    buletins: BuletinPublic[]
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
            <Head title="Buletin" />

            <div
                className={`relative min-h-screen overflow-hidden bg-slate-50 font-sans text-foreground transition-all duration-500 dark:bg-slate-950 ${tc.selection}`}
            >
                <div
                    className={`pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tc.orb}`}
                ></div>

                <PublicHeader tentangs={tentangs} jenisLayanans={jenisLayanans} />

                <PublicHero
                    title="Buletin"
                    subtitle="Koleksi buletin digital Perpustakaan Ibrahimy. Klik edisi untuk membaca."
                    crumbs={[{ label: 'Beranda', href: '/' }, { label: 'Buletin' }]}
                />

                {/* CONTENT */}
                <div className="mx-auto max-w-6xl px-6 py-12 md:px-12">
                    {buletins.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center dark:border-gray-700">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                Belum ada buletin
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Buletin akan tampil di sini setelah diterbitkan.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {buletins.map((b, i) => (
                                <motion.div
                                    key={b.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                >
                                    <Link
                                        href={`/buletin/${b.slug}`}
                                        className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-gray-800 dark:bg-gray-900"
                                    >
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                                            <BookOpen className="h-8 w-8" />
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                            {b.label_edisi || b.edisi}
                                        </h3>

                                        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                            <Calendar className="h-4 w-4" />
                                            {formatTanggal(b.tanggal_terbit) || '—'}
                                        </div>

                                        <div className="mt-5 flex-1" />

                                        <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 group-hover:from-emerald-400 group-hover:to-green-500">
                                            <BookOpen className="h-4 w-4" />
                                            Baca Buletin
                                        </span>
                                    </Link>
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

BuletinPublic.layout = {
    title: 'Buletin Perpustakaan',
    description: 'Koleksi buletin digital Perpustakaan Ibrahimy.',
}
