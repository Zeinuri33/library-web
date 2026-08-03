"use client"

import { Head, Link } from "@inertiajs/react"
import { motion } from "framer-motion"
import {
    ArrowLeft,
    Calendar,
    ChevronRight,
    Link2,
    Moon,
    Sun,
} from "lucide-react"
import { FaFacebookF, FaWhatsapp } from "react-icons/fa"
import { toast } from "sonner"
import PublicHeader from "@/components/public-header"
import { useAppearance } from "@/hooks/use-appearance"
import { useThemeClasses } from "@/hooks/use-theme-classes"
import Footer from "@/layouts/footer"
import { formatTanggal } from "@/lib/format-date"

type BeritaPublic = {
    id: number
    judul: string
    slug: string
    thumbnail: string | null
    isi: string
    tanggal: string | null
    deskripsi?: string
}

export default function ShowBerita({
    berita,
    beritaLainnya,
    tentangs,
    jenisLayanans,
}: {
    berita: BeritaPublic
    beritaLainnya: BeritaPublic[]
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

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            toast('Tautan disalin')
        } catch {
            toast('Gagal menyalin tautan')
        }
    }

    const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
    const waShare = `https://wa.me/?text=${encodeURIComponent(`${berita.judul} - ${pageUrl}`)}`
    const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`

    return (
        <>
            <Head title={berita.judul} />

            <div
                className={`relative min-h-screen overflow-hidden bg-slate-50 font-sans text-foreground transition-all duration-500 dark:bg-slate-950 ${tc.selection}`}
            >
                <div
                    className={`pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tc.orb}`}
                ></div>

                <PublicHeader tentangs={tentangs} jenisLayanans={jenisLayanans} />

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
                            animate={{ y: [0, -20, 0, 15, 0], x: [0, 15, -15, 10, 0] }}
                            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            className={`absolute right-[10%] bottom-[-6rem] h-56 w-56 rounded-full mix-blend-multiply blur-[130px] dark:mix-blend-lighten ${tc.heroOrb}`}
                            animate={{ y: [0, 20, -10, 0], x: [0, -15, 10, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
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
                            <motion.nav
                                className="flex items-center justify-center gap-1.5 text-sm text-white/90 md:text-base"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
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
                                    href="/berita"
                                    className="font-medium text-white transition-opacity hover:opacity-80"
                                >
                                    Berita
                                </Link>
                            </motion.nav>

                            <motion.h1
                                className="mt-4 text-3xl font-extrabold leading-tight tracking-normal text-white md:text-4xl lg:text-5xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                {berita.judul}
                            </motion.h1>

                            <motion.div
                                className="mt-4 flex items-center justify-center gap-2 text-sm text-white/85"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Calendar className="h-4 w-4" />
                                {formatTanggal(berita.tanggal, true) || '—'}
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* CONTENT */}
                <div className="mx-auto max-w-4xl px-4 py-12">
                    {berita.thumbnail && (
                        <motion.img
                            src={berita.thumbnail}
                            alt={berita.judul}
                            className="mb-8 w-full rounded-2xl object-cover shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        />
                    )}

                    <article className="max-w-none [&_h1]:text-4xl [&_h1]:font-black [&_h2]:text-3xl [&_h2]:font-bold [&_p]:leading-7 [&_p]:min-h-[2rem] [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-sm [&_blockquote]:text-muted-foreground [&_blockquote_p]:!leading-6 [&_blockquote_p]:!min-h-0 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium [&_img]:my-4 [&_img]:rounded-none">
                        <div dangerouslySetInnerHTML={{ __html: berita.isi }} />
                    </article>

                    {/* SHARE */}
                    <div className="mt-10 border-t pt-8">
                        <p className="mb-4 text-sm font-semibold text-muted-foreground">
                            Bagikan berita ini
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href={waShare}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Bagikan ke WhatsApp"
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-transform duration-200 hover:scale-110"
                            >
                                <FaWhatsapp className="h-5 w-5" />
                            </a>
                            <a
                                href={fbShare}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Bagikan ke Facebook"
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md transition-transform duration-200 hover:scale-110"
                            >
                                <FaFacebookF className="h-5 w-5" />
                            </a>
                            <button
                                onClick={handleCopy}
                                className="flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium shadow-md transition-colors duration-200 hover:bg-muted"
                            >
                                <Link2 className="h-4 w-4" />
                                Salin Tautan
                            </button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Link
                            href="/berita"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Berita
                        </Link>
                    </div>

                    {/* BERITA LAINNYA */}
                    {beritaLainnya.length > 0 && (
                        <div className="mt-14">
                            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                                Berita Lainnya
                            </h2>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {beritaLainnya.map((b) => (
                                    <Link
                                        key={b.id}
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
                                                    className="w-12 opacity-80"
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-1 flex-col p-4">
                                            <div className="mb-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatTanggal(b.tanggal) || '—'}
                                            </div>

                                            <h3 className="line-clamp-2 text-sm font-bold text-gray-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                                {b.judul}
                                            </h3>
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

ShowBerita.layout = {
    title: 'Berita',
    description: 'Kabar dan informasi terbaru dari Perpustakaan Ibrahimy.',
}
