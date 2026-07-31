'use client';

import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppearance } from '@/hooks/use-appearance';
import { Sun, Moon } from 'lucide-react';
import Footer from '@/layouts/footer';
import PublicHeader from '@/components/public-header';
import { useThemeClasses } from '@/hooks/use-theme-classes';

export default function Welcome({ tentangs }: { tentangs?: { nama: string; slug: string }[] }) {
    const [inputValue, setInputValue] = useState('');
    const { appearance, updateAppearance } = useAppearance();
    const { tc } = useThemeClasses();

    const cycleAppearance = () => {
        const modes: Array<'light' | 'dark'> = ['light', 'dark'];
        const idx = modes.indexOf(appearance);
        updateAppearance(modes[(idx + 1) % modes.length]);
    };

    const AppearanceIcon = appearance === 'dark' ? Moon : Sun;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim()) return;

        router.get('/result', {
            q: inputValue,
        });
    };

    //animasi search bar
    const texts = [
        'Cari koleksi...',
        'Cari Buku...',
        'Cari Jurnal...',
        'Cari Skripsi...',
        'Cari Artikel...',
    ];

    const [textIndex, setTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        if (inputValue.length > 0) return;

        const currentText = texts[textIndex];

        const interval = setInterval(() => {
            setDisplayText(currentText.slice(0, charIndex));

            setCharIndex((prev) => {
                const next = prev + 1;

                if (next > currentText.length) {
                    clearInterval(interval);

                    setTimeout(() => {
                        setTextIndex((t) => (t + 1) % texts.length);
                        setCharIndex(0);
                    }, 200);

                    return prev;
                }

                return next;
            });
        }, 120);

        return () => clearInterval(interval);
    }, [charIndex, textIndex, inputValue]);

    return (
        <>
            <Head title="Home" />

            <div
                className={`relative min-h-screen overflow-hidden bg-slate-50 font-sans text-foreground transition-all duration-500 dark:bg-slate-950 ${tc.selection}`}
            >
                {/* ORB BACKGROUND */}
                <div
                    className={`pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tc.orb}`}
                ></div>

                <PublicHeader tentangs={tentangs} />

                {/* HERO */}
                <section
                    id="home"
                    className="relative min-h-screen w-full bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-900"
                >
                    {/* BACKGROUND BLUR */}
                    <motion.div
                        className="pointer-events-none absolute inset-0 z-0 grid grid-cols-2 -space-x-52 opacity-60 dark:opacity-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.div
                            className={`h-64 rounded-full mix-blend-multiply blur-[130px] dark:mix-blend-lighten ${tc.heroOrb}`}
                            animate={{
                                y: [0, -30, 0, 20, 0],
                                x: [0, 20, -20, 10, 0],
                            }}
                            transition={{
                                duration: 12,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                        <motion.div
                            className={`mt-32 h-64 rounded-full mix-blend-multiply blur-[130px] dark:mix-blend-lighten ${tc.heroOrb}`}
                            animate={{
                                y: [0, 25, -15, 0],
                                x: [0, -25, 15, 0],
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
                    <div className="relative z-[2] mx-auto flex min-h-screen max-w-7xl items-center px-6 md:px-12">
                        <motion.div
                            className="flex w-full flex-col items-center lg:flex-row lg:items-center"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            <div className="w-full text-left text-white lg:w-1/2">
                            {/* LOGO */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <img
                                    src="/kubah-putih.png"
                                    alt="Kubah"
                                    className="w-45 md:w-45"
                                />
                            </motion.div>

                            {/* TITLE */}
                            <motion.h1
                                className="text-left text-5xl leading-[1.05] font-extrabold tracking-normal text-white md:text-6xl lg:text-7xl xl:text-7xl"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                Perpustakaan<br />
                                <span className="text-white">
                                    Ibrahimy
                                </span>
                            </motion.h1>

                            {/* DESC */}
                            <motion.p
                                className="mt-4 text-white text-md"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Membangun intelektual paripurna menuju pemberdayaan ummat.
                            </motion.p>

                            {/* SEARCH FORM */}
                            <motion.div
                                className="mt-6 flex"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.6 }}
                            >
                                <form
                                    onSubmit={handleSearch}
                                    className="relative w-full max-w-lg"
                                >
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="w-full rounded-xl bg-white/20 px-5 py-4 pr-28 text-white placeholder-white/50 shadow-lg focus:outline-none backdrop-blur-md"
                                    />

                                    {inputValue.length === 0 && (
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                                            {displayText}
                                            <span className="animate-pulse">|</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md px-6 py-2.5 text-sm font-semibold text-emerald-700 bg-white shadow-lg transition-all duration-300 hover:bg-emerald-50 ${tc.ring}`}
                                    >
                                        Cari
                                    </button>
                                </form>
                            </motion.div>

                            
                        </div>

                    </motion.div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <motion.div
                        className="pointer-events-none absolute bottom-0 right-0 z-10 hidden lg:block"
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                    >
                        <img
                            src="/menara.png"
                            alt="Menara"
                            className="h-auto max-h-[90vh] w-auto object-contain"
                        />
                    </motion.div>


                </section>



                {/* FLOATING THEME TOGGLE */}
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
    );
}
