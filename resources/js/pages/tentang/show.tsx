"use client"

import { Head, Link } from "@inertiajs/react"
import { motion } from "framer-motion"
import { ChevronRight, Link2, Moon, Sun } from "lucide-react"
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa"
import { toast } from "sonner"
import PublicHeader from "@/components/public-header"
import { Button } from "@/components/ui/button"
import { useAppearance } from "@/hooks/use-appearance"
import { useThemeClasses } from "@/hooks/use-theme-classes"
import Footer from "@/layouts/footer"

export default function ShowTentang({
    tentang,
    tentangs,
    jenisLayanans,
}: {
    tentang: any
    tentangs?: { nama: string; slug: string; deskripsi?: string }[]
    jenisLayanans?: { id: number; nama: string; slug: string; deskripsi?: string }[]
}) {
    const { tc } = useThemeClasses()
    const { appearance, updateAppearance } = useAppearance()

    const cycleAppearance = () => {
        const modes: Array<'light' | 'dark'> = ['light', 'dark']
        const idx = modes.indexOf(appearance)
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

    const waShare = `https://wa.me/?text=${encodeURIComponent(`${tentang.nama} - ${pageUrl}`)}`
    const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`

    return (
        <>
            <Head title={tentang.nama} />

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
                            animate={{
                                y: [0, -20, 0, 15, 0],
                                x: [0, 15, -15, 10, 0],
                            }}
                            transition={{
                                duration: 12,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                        <motion.div
                            className={`absolute right-[10%] bottom-[-6rem] h-56 w-56 rounded-full mix-blend-multiply blur-[130px] dark:mix-blend-lighten ${tc.heroOrb}`}
                            animate={{
                                y: [0, 20, -10, 0],
                                x: [0, -15, 10, 0],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
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
                                {tentang.nama}
                            </motion.h1>
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
                                <span className="font-semibold">{tentang.nama}</span>
                            </motion.nav>
                        </motion.div>
                    </div>
                </section>

                <div className="mx-auto max-w-4xl px-4 py-12">
                    <article className="max-w-none [&_h1]:text-4xl [&_h1]:font-black [&_h2]:text-3xl [&_h2]:font-bold [&_p]:leading-7 [&_p]:min-h-[2rem] [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-sm [&_blockquote]:text-muted-foreground [&_blockquote_p]:!leading-6 [&_blockquote_p]:!min-h-0 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium [&_img]:my-4 [&_img]:rounded-none">
                        <div dangerouslySetInnerHTML={{ __html: tentang.isi }} />
                    </article>

                    <div className="mt-10 border-t pt-8">
                        <p className="mb-4 text-sm font-semibold text-muted-foreground">
                            Bagikan halaman ini
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
                                title="Bagikan ke Instagram"
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E4405F] text-white shadow-md transition-transform duration-200 hover:scale-110"
                            >
                                <FaInstagram className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleCopy}
                                className="flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium shadow-md transition-colors duration-200 hover:bg-muted"
                            >
                                <Link2 className="h-4 w-4" />
                                Salin Tautan
                            </button>
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
