"use client"

import { Head, Link } from "@inertiajs/react"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Calendar, Download, Moon, Sun } from "lucide-react"
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

export default function ShowBuletin({
    buletin,
    buletinLainnya,
    tentangs,
    jenisLayanans,
}: {
    buletin: BuletinPublic
    buletinLainnya: BuletinPublic[]
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
            <Head title={buletin.edisi} />

            <div
                className={`relative min-h-screen overflow-hidden bg-slate-50 font-sans text-foreground transition-all duration-500 dark:bg-slate-950 ${tc.selection}`}
            >
                <div
                    className={`pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tc.orb}`}
                ></div>

                <PublicHeader tentangs={tentangs} jenisLayanans={jenisLayanans} />

                <PublicHero
                    title={buletin.label_edisi || buletin.edisi}
                    subtitle={`Terbit ${formatTanggal(buletin.tanggal_terbit) || '—'}`}
                    crumbs={[{ label: 'Beranda', href: '/' }, { label: 'Buletin', href: '/buletin' }]}
                />

                {/* CONTENT */}
                <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
                    {/* ACTIONS */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <Link
                            href="/buletin"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Buletin
                        </Link>

                        {buletin.pdf_url && (
                            <a
                                href={buletin.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:from-emerald-400 hover:to-green-500"
                            >
                                <Download className="h-4 w-4" />
                                Unduh PDF
                            </a>
                        )}
                    </div>

                    {/* PDF VIEWER */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
                    >
                        {buletin.pdf_url ? (
                            <iframe
                                src={buletin.pdf_url}
                                title={buletin.edisi}
                                className="h-[75vh] w-full"
                                loading="lazy"
                            />
                        ) : (
                            <div className="flex h-[40vh] flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
                                <BookOpen className="h-10 w-10" />
                                <p>File buletin tidak tersedia.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* BULELIN LAINNYA */}
                    {buletinLainnya.length > 0 && (
                        <div className="mt-14">
                            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                                Buletin Lainnya
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {buletinLainnya.map((b) => (
                                    <Link
                                        key={b.id}
                                        href={`/buletin/${b.slug}`}
                                        className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-gray-800 dark:bg-gray-900"
                                    >
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                                            <BookOpen className="h-6 w-6" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="line-clamp-1 text-sm font-bold text-gray-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                                {b.label_edisi || b.edisi}
                                            </h3>
                                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                {formatTanggal(b.tanggal_terbit) || '—'}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
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

                <Footer tc={tc} tentangs={tentangs} jenisLayanans={jenisLayanans} />
            </div>
        </>
    )
}

ShowBuletin.layout = {
    title: 'Buletin',
    description: 'Buletin digital Perpustakaan Ibrahimy.',
}
