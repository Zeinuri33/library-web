"use client"

import { Link } from "@inertiajs/react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { useThemeClasses } from "@/hooks/use-theme-classes"

type Crumb = {
    label: string
    href?: string
}

export default function PublicHero({
    title,
    subtitle,
    crumbs = [],
}: {
    title: string
    subtitle?: string
    crumbs?: Crumb[]
}) {
    const { tc } = useThemeClasses()

    return (
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
                        {title}
                    </motion.h1>

                    {subtitle && (
                        <motion.p
                            className="mx-auto mt-3 max-w-2xl text-sm text-white/90 md:text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {subtitle}
                        </motion.p>
                    )}

                    {crumbs.length > 0 && (
                        <motion.nav
                            className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-sm text-white/90 md:text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            aria-label="Breadcrumb"
                        >
                            {crumbs.map((c, i) => (
                                <span key={i} className="flex items-center gap-1.5">
                                    {i > 0 && <ChevronRight className="h-4 w-4 opacity-70" />}

                                    {c.href ? (
                                        <Link
                                            href={c.href}
                                            className="font-medium text-white transition-opacity hover:opacity-80"
                                        >
                                            {c.label}
                                        </Link>
                                    ) : (
                                        <span className="font-semibold">{c.label}</span>
                                    )}
                                </span>
                            ))}
                        </motion.nav>
                    )}
                </motion.div>
            </div>
        </section>
    )
}
