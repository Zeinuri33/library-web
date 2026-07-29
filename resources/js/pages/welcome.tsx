'use client';

import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { dashboard, login } from '@/routes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Footer from '@/layouts/footer';

import { router } from '@inertiajs/react';

export default function Welcome() {
    const [inputValue, setInputValue] = useState('');
    const { themeAccent } = useTheme();

    const themeMaps = {
        emerald: {
            selection: 'selection:bg-emerald-500/30',
            textGradient:
                'from-gray-900 via-emerald-600 to-emerald-500 dark:from-white dark:via-emerald-400 dark:to-emerald-500',
            bgGradient:
                'bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-500',
            ring: 'focus:ring-emerald-500/50',
            shadow: 'hover:shadow-emerald-500/30 dark:hover:shadow-emerald-500/30',
            glow: 'from-emerald-500/10',
            orb: 'bg-emerald-500/20 blur-[150px]',
            heroOrb: 'bg-emerald-500/20',
            textWhite: 'text-white',
        },
        red: {
            selection: 'selection:bg-red-500/30',
            textGradient:
                'from-gray-900 via-red-600 to-red-500 dark:from-white dark:via-red-400 dark:to-red-500',
            bgGradient:
                'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-500',
            ring: 'focus:ring-red-500/50',
            shadow: 'hover:shadow-red-500/30 dark:hover:shadow-red-500/30',
            glow: 'from-red-500/10',
            orb: 'bg-red-500/20 blur-[150px]',
            heroOrb: 'bg-red-500/20',
            textWhite: 'text-white',
        },
        indigo: {
            selection: 'selection:bg-indigo-500/30',
            textGradient:
                'from-gray-900 via-indigo-600 to-indigo-500 dark:from-white dark:via-indigo-400 dark:to-indigo-500',
            bgGradient:
                'bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-500',
            ring: 'focus:ring-indigo-500/50',
            shadow: 'hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/30',
            glow: 'from-indigo-500/10',
            orb: 'bg-indigo-500/20 blur-[150px]',
            heroOrb: 'bg-indigo-500/20',
            textWhite: 'text-white',
        },
    };

    const tc =
        themeMaps[themeAccent as keyof typeof themeMaps] || themeMaps.emerald;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('🔥 SUBMIT JALAN:', inputValue);

        if (!inputValue.trim()) return;

        router.get('/result', {
            q: inputValue,
        });
    };

    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

                <header
                    className={`fixed top-0 left-0 z-[60] w-full transition-all duration-300 ${open ? 'pointer-events-none opacity-0' : 'opacity-100'
                        } ${scrolled
                            ? 'border-b border-gray-200/20 bg-white/70 shadow-sm backdrop-blur-xl dark:border-gray-800/30 dark:bg-gray-950/70'
                            : 'bg-transparent'
                        }`}
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                        {/* LOGO */}
                        <Link href="/" className="flex items-center gap-3">
                            <img
                                src="/kubah.png"
                                className="h-10 dark:hidden"
                                alt="Logo"
                            />

                            <img
                                src="/kubah-putih.png"
                                className="hidden h-10 dark:block"
                                alt="Logo Dark"
                            />

                            <motion.div
                                animate={{
                                    opacity: open ? 0.5 : 1,
                                    scale: open ? 0.98 : 1,
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 200,
                                    damping: 20,
                                }}
                            >
                                <h1
                                    className={`text-sm font-bold bg-gradient-to-r bg-clip-text text-transparent ${tc.textGradient}`}
                                >
                                    Digital Library
                                </h1>

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Perpustakaan Ibrahimy
                                </p>
                            </motion.div>
                        </Link>

                        {/* DESKTOP */}
                        <div className="hidden items-center gap-6 md:flex">
                            <nav className="flex gap-6 text-sm font-medium">
                                <a
                                    href="#home"
                                    className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
                                >
                                    Home
                                </a>
                            </nav>
                            <Link
                                href='https://digilib.ibrahimy.ac.id/docs'
                                className={`inline-flex items-center justify-center gap-2 rounded-md px-7 py-2.5 text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50 ${tc.bgGradient} ${tc.textWhite} ${tc.shadow} ${tc.ring}`}
                            >
                                Panduan
                            </Link>
                        </div>

                        {/* MOBILE BUTTON */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setOpen(!open)}
                                className="relative h-6 w-6"
                            >
                                <motion.span
                                    className="absolute top-0 left-0 h-[2px] w-6 bg-foreground"
                                    animate={{
                                        rotate: open ? 45 : 0,
                                        y: open ? 8 : 0,
                                    }}
                                />
                                <motion.span
                                    className="absolute top-[8px] left-0 h-[2px] w-6 bg-foreground"
                                    animate={{ opacity: open ? 0 : 1 }}
                                />
                                <motion.span
                                    className="absolute top-[16px] left-0 h-[2px] w-6 bg-foreground"
                                    animate={{
                                        rotate: open ? -45 : 0,
                                        y: open ? -8 : 0,
                                    }}
                                />
                            </button>
                        </div>
                    </div>
                </header>
                {/* MOBILE MENU */}
                <AnimatePresence>
                    {open && (
                        <>
                            {/* OVERLAY (NO BLUR) */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40 bg-black/30"
                                onClick={() => setOpen(false)}
                            />

                            {/* MENU FULLSCREEN */}
                            <motion.div
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -100, opacity: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 260,
                                    damping: 20,
                                }}
                                className="fixed top-0 left-0 z-[70] flex w-full flex-col bg-background p-6"
                            >
                                {/* HEADER DI DALAM MENU */}
                                <div className="mb-8 flex items-center justify-between">
                                    {/* LEFT */}
                                    <h1 className="text-lg font-semibold">
                                        Digital Library
                                    </h1>

                                    {/* RIGHT (GROUP) */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setOpen(false)}
                                            className="relative h-6 w-6"
                                        >
                                            <motion.span
                                                className="absolute top-0 left-0 h-[2px] w-6 bg-foreground"
                                                initial={{ rotate: 0 }}
                                                animate={{ rotate: 45, y: 8 }}
                                            />
                                            <motion.span
                                                className="absolute top-[16px] left-0 h-[2px] w-6 bg-foreground"
                                                initial={{ rotate: 0 }}
                                                animate={{ rotate: -45, y: -8 }}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* NAV */}
                                <nav className="flex flex-col gap-5 text-base font-medium">
                                    <a
                                        href="#home"
                                        onClick={() => setOpen(false)}
                                    >
                                        Home
                                    </a>
                                </nav>

                                {/* BUTTON */}
                                <div className="mt-auto pt-6">
                                    {auth.user ? (
                                        <Link href={dashboard()}>
                                            <Button className="w-full rounded-full">
                                                Dashboard
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href='https://digilib.ibrahimy.ac.id/docs'>
                                            <Button
                                                className={`w-full rounded-md px-4 py-6 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${tc.bgGradient} ${tc.textWhite} ${tc.shadow} ${tc.ring}`}
                                            >
                                                Panduan
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* HERO */}
                <section
                    id="home"
                    className="relative min-h-screen w-full px-6 md:px-12"
                >
                    {/* BACKGROUND BLUR */}
                    <motion.div
                        className="pointer-events-none absolute inset-0 z-0 grid grid-cols-2 -space-x-52 opacity-60 dark:opacity-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div
                            className={`h-64 rounded-full mix-blend-multiply blur-[130px] dark:mix-blend-lighten ${tc.heroOrb}`}
                        ></div>
                        <div
                            className={`mt-32 h-64 rounded-full mix-blend-multiply blur-[130px] dark:mix-blend-lighten ${tc.heroOrb}`}
                        ></div>
                    </motion.div>

                    {/* HERO CONTENT */}
                    <motion.div
                        className="relative ml-auto flex flex-col items-center pt-36 lg:flex-row lg:items-center lg:justify-between"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <div className="w-full text-left lg:w-1/2">
                            {/* LOGO */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <img
                                    src="/kubah.png"
                                    alt="Kubah"
                                    className="w-45 md:w-45 dark:hidden"
                                />
                                <img
                                    src="/kubah-putih.png"
                                    alt="Kubah Dark"
                                    className="hidden w-45 md:w-45 dark:block"
                                />
                            </motion.div>

                            {/* TITLE */}
                            <motion.h1
                                className="text-left text-4xl leading-[1.05] font-extrabold tracking-normal text-gray-900 md:text-5xl lg:text-6xl xl:text-7xl dark:text-white"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                Ibrahimy <br />
                                <span
                                    className={`bg-gradient-to-r bg-clip-text text-transparent ${tc.textGradient}`}
                                >
                                    Digital Library
                                </span>
                            </motion.h1>

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
                                        className="w-full rounded-xl bg-white dark:bg-gray-900 px-5 py-4 pr-28 text-gray-900 dark:text-gray-100 shadow-lg focus:outline-none"
                                    />

                                    {inputValue.length === 0 && (
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            {displayText}
                                            <span className="animate-pulse">|</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${tc.bgGradient} ${tc.textWhite} ${tc.shadow} ${tc.ring} shadow-md`}
                                    >
                                        Cari
                                    </button>
                                </form>
                            </motion.div>

                            {/* DESC */}
                            <motion.p
                                className="mt-4 text-gray-400 dark:text-gray-400 text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Digilib memudahkan pengguna mengakses dan menelusuri koleksi.
                            </motion.p>
                        </div>

                    </motion.div>

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
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950"></div>
                    </motion.div>

                    {/* MARQUEE */}
                    <motion.div
                        className="relative my-21 overflow-hidden"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{
                            WebkitMaskImage:
                                'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                            maskImage:
                                'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                        }}
                    >
                        <div
                            className="flex w-max items-center gap-12"
                            style={{ animation: 'marquee 25s linear infinite' }}
                        >
                            {[...Array(2)]
                                .flatMap(() => [
                                    '/apps-logo/0.png',
                                    '/apps-logo/1.png',
                                    '/apps-logo/2.png',
                                    '/apps-logo/3.png',
                                    '/apps-logo/4.png',
                                    '/apps-logo/5.png',
                                    '/apps-logo/6.png',
                                    '/apps-logo/7.png',
                                    '/apps-logo/8.png',
                                ])
                                .map((src, i) => (
                                    <a
                                        key={i}
                                        className="group flex items-center justify-center"
                                    >
                                        <img
                                            src={src}
                                            className="h-9 w-auto grayscale transition duration-300 group-hover:grayscale-0"
                                            loading="lazy"
                                            alt={`logo-${i}`}
                                        />
                                    </a>
                                ))}
                        </div>
                        <style>
                            {`
                            @keyframes marquee {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                            `}
                        </style>
                    </motion.div>
                </section>



                <Footer tc={tc} />
            </div>
        </>
    );
}
