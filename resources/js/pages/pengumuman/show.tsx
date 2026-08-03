"use client"

import { Head, Link } from "@inertiajs/react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Link2, Moon, Sun } from "lucide-react"
import { FaFacebookF, FaWhatsapp } from "react-icons/fa"
import { toast } from "sonner"
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
}

export default function ShowPengumuman({
    pengumuman,
    pengumumanLainnya,
    tentangs,
    jenisLayanans,
}: {
    pengumuman: PengumumanPublic
    pengumumanLainnya: PengumumanPublic[]
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
    const waShare = `https://wa.me/?text=${encodeURIComponent(`${pengumuman.judul} - ${pageUrl}`)}`
    const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`

    return (
        <>
            <Head title={pengumuman.judul} />

            <div
                className={`relative min-h-screen overflow-hidden bg-slate-50 font-sans text-foreground transition-all duration-500 dark:bg-slate-950 ${tc.selection}`}
            >
                <div
                    className={`pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tc.orb}`}
                ></div>

                <PublicHeader tentangs={tentangs} jenisLayanans={jenisLayanans} />

                <PublicHero
                    title={pengumuman.judul}
                    crumbs={[
                        { label: 'Beranda', href: '/' },
                        { label: 'Pengumuman', href: '/informasi/pengumuman' },
                    ]}
                />

                {/* CONTENT */}
                <div className="mx-auto max-w-4xl px-4 py-12">
                    <motion.div
                        className="mb-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Calendar className="h-4 w-4" />
                        {formatTanggal(pengumuman.created_at, true) || '—'}
                    </motion.div>

                    <article className="max-w-none [&_h1]:text-4xl [&_h1]:font-black [&_h2]:text-3xl [&_h2]:font-bold [&_p]:leading-7 [&_p]:min-h-[2rem] [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-sm [&_blockquote]:text-muted-foreground [&_blockquote_p]:!leading-6 [&_blockquote_p]:!min-h-0 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium [&_img]:my-4 [&_img]:rounded-none">
                        <div dangerouslySetInnerHTML={{ __html: pengumuman.isi }} />
                    </article>

                    {/* SHARE */}
                    <div className="mt-10 border-t pt-8">
                        <p className="mb-4 text-sm font-semibold text-muted-foreground">
                            Bagikan pengumuman ini
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
                            href="/informasi/pengumuman"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Pengumuman
                        </Link>
                    </div>

                    {/* PENGUMUMAN LAINNYA */}
                    {pengumumanLainnya.length > 0 && (
                        <div className="mt-14">
                            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                                Pengumuman Lainnya
                            </h2>

                            <div className="space-y-3">
                                {pengumumanLainnya.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/informasi/pengumuman/${p.slug}`}
                                        className="group flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-gray-800 dark:bg-gray-900"
                                    >
                                        <div className="min-w-0">
                                            <h3 className="line-clamp-1 text-sm font-bold text-gray-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                                {p.judul}
                                            </h3>
                                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                {formatTanggal(p.created_at) || '—'}
                                            </p>
                                        </div>

                                        <ArrowLeft className="h-4 w-4 flex-shrink-0 rotate-180 text-emerald-600 transition-transform duration-300 group-hover:translate-x-1 dark:text-emerald-400" />
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

ShowPengumuman.layout = {
    title: 'Pengumuman',
    description: 'Pengumuman Perpustakaan Ibrahimy.',
}
