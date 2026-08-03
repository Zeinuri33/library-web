"use client"

import { Head, Link } from "@inertiajs/react"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Megaphone, Moon, Sun } from "lucide-react"
import PublicHeader from "@/components/public-header"
import PublicHero from "@/components/public-hero"
import { useAppearance } from "@/hooks/use-appearance"
import { useThemeClasses } from "@/hooks/use-theme-classes"
import Footer from "@/layouts/footer"
import { formatTanggal } from "@/lib/format-date"

type PengumumanPublic = {
    id: number
    judul: string
    slug: string
    isi: string
    created_at: string | null
    deskripsi?: string
}

export default function PengumumanPublic({
    pengumumans,
    tentangs,
    jenisLayanans,
}: {
    pengumumans: PengumumanPublic[]
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
            <Head title="Pengumuman" />

            <div
                className={`relative min-h-screen overflow-hidden bg-slate-50 font-sans text-foreground transition-all duration-500 dark:bg-slate-950 ${tc.selection}`}
            >
                <div
                    className={`pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tc.orb}`}
                ></div>

                <PublicHeader tentangs={tentangs} jenisLayanans={jenisLayanans} />

                <PublicHero
                    title="Pengumuman"
                    subtitle="Informasi dan pengumuman resmi dari Perpustakaan Ibrahimy."
                    crumbs={[{ label: 'Beranda', href: '/' }, { label: 'Informasi', href: '/informasi/pengumuman' }, { label: 'Pengumuman' }]}
                />

                {/* CONTENT */}
                <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
                    {pengumumans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center dark:border-gray-700">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                Belum ada pengumuman
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Pengumuman akan tampil di sini setelah diterbitkan.
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
                                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                                            <Megaphone className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatTanggal(p.created_at) || '—'}
                                            </div>

                                            <h3 className="line-clamp-2 font-bold text-gray-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                                {p.judul}
                                            </h3>

                                            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                                {p.deskripsi}
                                            </p>
                                        </div>

                                        <div className="flex flex-shrink-0 items-center self-center text-emerald-600 dark:text-emerald-400">
                                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
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

                <Footer tc={tc} tentangs={tentangs} jenisLayanans={jenisLayanans} />
            </div>
        </>
    )
}

PengumumanPublic.layout = {
    title: 'Pengumuman Perpustakaan',
    description: 'Informasi dan pengumuman resmi dari Perpustakaan Ibrahimy.',
}
