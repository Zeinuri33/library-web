"use client"

import { Head, Link } from "@inertiajs/react"
import { motion } from "framer-motion"
import { ArrowRight, ChevronRight, ExternalLink, Moon, Sun } from "lucide-react"
import { useMemo } from "react"
import PublicHeader from "@/components/public-header"
import { useAppearance } from "@/hooks/use-appearance"
import { useThemeClasses } from "@/hooks/use-theme-classes"
import Footer from "@/layouts/footer"

type JenisLayananPublic = {
    id: number
    nama: string
    slug: string
    deskripsi?: string
}

type LayananPublic = {
    id: number
    nama_layanan: string
    slug: string
    url: string | null
    deskripsi: string | null
    jenis_layanan: JenisLayananPublic | null
}

export default function LayananPublic({
    layanans,
    jenisLayanans,
    tentangs,
    activeJenis,
}: {
    layanans: LayananPublic[]
    jenisLayanans: JenisLayananPublic[]
    tentangs?: { nama: string; slug: string; deskripsi?: string }[]
    activeJenis: JenisLayananPublic | null
}) {
    const { tc } = useThemeClasses()
    const { appearance, updateAppearance } = useAppearance()

    const cycleAppearance = () => {
        const modes: Array<'light' | 'dark'> = ['light', 'dark']
        const idx = modes.indexOf(appearance as 'light' | 'dark')
        updateAppearance(modes[(idx + 1) % modes.length])
    }

    const AppearanceIcon = appearance === 'dark' ? Moon : Sun

    // Kelompokkan layanan berdasarkan jenisnya (dipakai pada tampilan "Semua Layanan")
    const groups = useMemo(() => {
        if (activeJenis) return null

        const map = new Map<number | string, { jenis: JenisLayananPublic | null; items: LayananPublic[] }>()

        for (const l of layanans) {
            const key = l.jenis_layanan?.id ?? 'lainnya'

            if (!map.has(key)) {
                map.set(key, { jenis: l.jenis_layanan, items: [] })
            }

            map.get(key)!.items.push(l)
        }

        return [...map.values()].sort((a, b) => (a.jenis?.nama ?? '').localeCompare(b.jenis?.nama ?? ''))
    }, [layanans, activeJenis])

    const renderCard = (l: LayananPublic) => (
        <div
            key={l.id}
            className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-gray-800 dark:bg-gray-900"
        >
            <div className="mb-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                    {l.jenis_layanan?.nama ?? 'Layanan'}
                </span>

                {l.url && (
                    <ExternalLink className="h-4 w-4 text-gray-300 transition-colors duration-300 group-hover:text-emerald-500 dark:text-gray-600" />
                )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {l.nama_layanan}
            </h3>

            <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {l.deskripsi || 'Layanan ini tersedia di Perpustakaan Ibrahimy.'}
            </p>

            {l.url ? (
                <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-5 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:from-emerald-400 hover:to-green-500 hover:shadow-emerald-500/30 bg-gradient-to-r from-emerald-500 to-green-600 ${tc.ring}`}
                >
                    Kunjungi
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
            ) : (
                <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    Tersedia di perpustakaan
                </div>
            )}
        </div>
    )

    return (
        <>
            <Head title={activeJenis ? `${activeJenis.nama} - Layanan` : "Layanan"} />

            <div
                className={`relative min-h-screen overflow-hidden bg-slate-50 font-sans text-foreground transition-all duration-500 dark:bg-slate-950 ${tc.selection}`}
            >
                <div
                    className={`pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tc.orb}`}
                ></div>

                <PublicHeader tentangs={tentangs} jenisLayanans={jenisLayanans} />

                {/* HERO */}
                <section className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-900 py-20 md:py-24">
                    {/* BACKGROUND BLUR */}
                    <motion.div
                        className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.div
                            className={`absolute top-[-6rem] left-[10%] h-56 w-56 rounded-full mix-blend-multiply blur-[130px] dark:mix-blend-lighten ${tc.heroOrb}`}
                            animate={{ y: [0, -20, 0, 15, 0], x: [0, 15, -15, 10, 0] }}
                            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            className={`absolute right-[10%] bottom-[-6rem] h-56 w-56 rounded-full mix-blend-multiply blur-[130px] dark:mix-blend-lighten ${tc.heroOrb}`}
                            animate={{ y: [0, 20, -10, 0], x: [0, -15, 10, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
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
                                {activeJenis ? activeJenis.nama : 'Layanan'}
                            </motion.h1>
                            <motion.p
                                className="mx-auto mt-3 max-w-2xl text-sm text-white/90 md:text-base"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {activeJenis?.deskripsi ||
                                    'Berbagai layanan Perpustakaan Ibrahimy untuk mendukung kegiatan belajar dan penelitian Anda.'}
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
                                <Link
                                    href="/layanan"
                                    className="font-medium text-white transition-opacity hover:opacity-80"
                                >
                                    Layanan
                                </Link>
                                {activeJenis && (
                                    <>
                                        <ChevronRight className="h-4 w-4 opacity-70" />
                                        <span className="font-semibold">
                                            {activeJenis.nama}
                                        </span>
                                    </>
                                )}
                            </motion.nav>
                        </motion.div>
                    </div>
                </section>

                {/* FILTER JENIS */}
                <div className="mx-auto max-w-6xl px-6 pt-8 md:px-12">
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/layanan"
                            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                !activeJenis
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20'
                                    : 'border border-gray-200 bg-white text-gray-700 hover:border-emerald-500/40 hover:text-emerald-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-emerald-400'
                            }`}
                        >
                            Semua Layanan
                        </Link>

                        {jenisLayanans.map((j) => (
                            <Link
                                key={j.id}
                                href={`/layanan/${j.slug}`}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                    activeJenis?.id === j.id
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20'
                                        : 'border border-gray-200 bg-white text-gray-700 hover:border-emerald-500/40 hover:text-emerald-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-emerald-400'
                                }`}
                            >
                                {j.nama}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* CONTENT */}
                <div className="mx-auto max-w-6xl px-6 py-10 md:px-12">
                    {layanans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center dark:border-gray-700">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                Belum ada layanan pada kategori ini
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Silakan pilih kategori lain atau kembali ke semua layanan.
                            </p>
                        </div>
                    ) : activeJenis ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {layanans.map(renderCard)}
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {groups?.map((group, i) => (
                                <motion.div
                                    key={group.jenis?.id ?? 'lainnya'}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                >
                                    <div className="mb-5 flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {group.jenis?.nama ?? 'Layanan Lainnya'}
                                        </h2>
                                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                            {group.items.length}
                                        </span>
                                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {group.items.map(renderCard)}
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

                <Footer tc={tc} tentangs={tentangs} jenisLayanans={jenisLayanans} />
            </div>
        </>
    )
}

LayananPublic.layout = {
    title: 'Layanan Perpustakaan',
    description: 'Daftar layanan Perpustakaan Ibrahimy.',
}
