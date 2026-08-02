'use client';

import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useThemeClasses } from '@/hooks/use-theme-classes';
import { dashboard } from '@/routes';

interface PublicHeaderProps {
    tentangs?: { nama: string; slug: string; deskripsi?: string }[];
    jenisLayanans?: { id: number; nama: string; slug: string; deskripsi?: string }[];
}

export default function PublicHeader({ tentangs, jenisLayanans }: PublicHeaderProps) {
    const { tc } = useThemeClasses();
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

    return (
        <>
            <header
                className={`fixed top-0 left-0 z-[60] w-full transition-all duration-300 ${open ? 'pointer-events-none opacity-0' : 'opacity-100'
                    } ${
                        scrolled
                            ? 'border-b border-gray-200/20 bg-white/70 shadow-sm backdrop-blur-xl dark:border-gray-800/30 dark:bg-gray-950/70'
                            : 'bg-transparent'
                    }`}
            >
                <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-4">
                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-3 justify-self-start">
                        <img
                            src="/kubah.png"
                            className={`h-10 ${scrolled ? 'dark:hidden' : 'hidden'}`}
                            alt="Logo"
                        />

                        <img
                            src="/kubah-putih.png"
                            className={`h-10 ${scrolled ? 'hidden dark:block' : ''}`}
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
                                className={`text-sm font-bold bg-clip-text text-transparent ${
                                    scrolled ? 'bg-gray-900 dark:bg-white' : 'bg-white dark:bg-white'
                                }`}
                            >
                                Perpustakaan Ibrahimy
                            </h1>

                            <p
                                className={`text-xs ${
                                    scrolled ? 'text-gray-600 dark:text-gray-400' : 'text-white dark:text-white'
                                }`}
                            >
                                NPP: 3512142F2006567
                            </p>
                        </motion.div>
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav
                        className={`hidden items-center justify-center gap-6 text-sm font-medium md:flex ${
                            scrolled ? '' : 'text-white dark:text-white'
                        }`}
                    >
                        <a
                            href="/"
                            className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
                        >
                            Home
                        </a>
                        {tentangs && tentangs.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="relative inline-flex items-center gap-1 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
                                    >
                                        Tentang
                                        <ChevronDown className="h-3 w-3" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    className="z-[100] w-64 space-y-1 border border-white/40 bg-white/60 p-1.5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60"
                                >
                                    {tentangs.map((t) => (
                                        <DropdownMenuItem key={t.slug} asChild>
                                            <Link
                                                href={`/tentang/${t.slug}`}
                                                className="relative flex flex-col items-start gap-0 py-1.5 pr-6 focus:bg-gray-200! focus:text-black! dark:focus:bg-black! dark:focus:text-white!"
                                            >
                                                <span className="font-medium leading-none">
                                                    {t.nama}
                                                </span>
                                                {t.deskripsi && (
                                                    <span className="line-clamp-1 -mt-0.5 w-full text-xs leading-none text-muted-foreground">
                                                        {t.deskripsi}
                                                    </span>
                                                )}
                                                <ChevronRight className="absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2" />
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    <Link
                        href="/berita"
                        className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
                    >
                        Berita
                    </Link>



                    {/* INFORMASI DROPDOWN */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="relative inline-flex items-center gap-1 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
                            >
                                Informasi
                                <ChevronDown className="h-3 w-3" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            className="z-[100] w-64 space-y-1 border border-white/40 bg-white/60 p-1.5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60"
                        >
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/informasi/pengumuman"
                                    className="relative flex flex-col items-start gap-0 py-1.5 pr-6 focus:bg-gray-200! focus:text-black! dark:focus:bg-black! dark:focus:text-white!"
                                >
                                    <span className="font-medium leading-none">Pengumuman</span>
                                    <span className="line-clamp-1 -mt-0.5 w-full text-xs leading-none text-muted-foreground">
                                        Informasi resmi terbaru
                                    </span>
                                    <ChevronRight className="absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2" />
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link
                                    href="/informasi/kegiatan"
                                    className="relative flex flex-col items-start gap-0 py-1.5 pr-6 focus:bg-gray-200! focus:text-black! dark:focus:bg-black! dark:focus:text-white!"
                                >
                                    <span className="font-medium leading-none">Kegiatan</span>
                                    <span className="line-clamp-1 -mt-0.5 w-full text-xs leading-none text-muted-foreground">
                                        Agenda kegiatan perpustakaan
                                    </span>
                                    <ChevronRight className="absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2" />
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link
                                    href="/informasi/hari-libur"
                                    className="relative flex flex-col items-start gap-0 py-1.5 pr-6 focus:bg-gray-200! focus:text-black! dark:focus:bg-black! dark:focus:text-white!"
                                >
                                    <span className="font-medium leading-none">Hari Libur</span>
                                    <span className="line-clamp-1 -mt-0.5 w-full text-xs leading-none text-muted-foreground">
                                        Jadwal libur dan tutup layanan
                                    </span>
                                    <ChevronRight className="absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2" />
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* LAYANAN DROPDOWN */}
                    {jenisLayanans && jenisLayanans.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="relative inline-flex items-center gap-1 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
                                >
                                    Layanan
                                    <ChevronDown className="h-3 w-3" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className="z-[100] w-72 space-y-1 border border-white/40 bg-white/60 p-1.5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60"
                            >
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/layanan"
                                        className="relative flex flex-col items-start gap-0 py-1.5 pr-6 focus:bg-gray-200! focus:text-black! dark:focus:bg-black! dark:focus:text-white!"
                                    >
                                        <span className="font-medium leading-none">
                                            Semua Layanan
                                        </span>
                                        <span className="line-clamp-1 -mt-0.5 w-full text-xs leading-none text-muted-foreground">
                                            Seluruh daftar layanan
                                        </span>
                                        <ChevronRight className="absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2" />
                                    </Link>
                                </DropdownMenuItem>

                                <div className="my-1 h-px bg-gray-200/70 dark:bg-gray-800/70" />

                                {jenisLayanans.map((j) => (
                                    <DropdownMenuItem key={j.id} asChild>
                                        <Link
                                            href={`/layanan/${j.slug}`}
                                            className="relative flex flex-col items-start gap-0 py-1.5 pr-6 focus:bg-gray-200! focus:text-black! dark:focus:bg-black! dark:focus:text-white!"
                                        >
                                            <span className="font-medium leading-none">
                                                {j.nama}
                                            </span>
                                            {j.deskripsi && (
                                                <span className="line-clamp-1 -mt-0.5 w-full text-xs leading-none text-muted-foreground">
                                                    {j.deskripsi}
                                                </span>
                                            )}
                                            <ChevronRight className="absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2" />
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <Link
                        href="/buletin"
                        className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
                    >
                        Buletin
                    </Link>
                    </nav>

                    {/* RIGHT SIDE */}
                    <div className="col-start-3 flex items-center justify-self-end gap-6">
                        <Link
                            href='https://digilib.ibrahimy.ac.id/docs'
                            className={`hidden items-center justify-center gap-2 rounded-md px-7 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:from-emerald-400 hover:to-green-500 hover:shadow-emerald-500/30 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50 md:inline-flex dark:hover:shadow-emerald-500/30 bg-gradient-to-r from-emerald-500 to-green-600 text-white ${tc.ring}`}
                        >
                            Panduan
                        </Link>

                        {/* MOBILE BUTTON */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setOpen(!open)}
                                className="relative h-6 w-6"
                            >
                                <motion.span
                                    className={`absolute top-0 left-0 h-[2px] w-6 ${
                                        scrolled ? 'bg-foreground' : 'bg-white dark:bg-white'
                                    }`}
                                    animate={{
                                        rotate: open ? 45 : 0,
                                        y: open ? 8 : 0,
                                    }}
                                />
                                <motion.span
                                    className={`absolute top-[8px] left-0 h-[2px] w-6 ${
                                        scrolled ? 'bg-foreground' : 'bg-white dark:bg-white'
                                    }`}
                                    animate={{ opacity: open ? 0 : 1 }}
                                />
                                <motion.span
                                    className={`absolute top-[16px] left-0 h-[2px] w-6 ${
                                        scrolled ? 'bg-foreground' : 'bg-white dark:bg-white'
                                    }`}
                                    animate={{
                                        rotate: open ? -45 : 0,
                                        y: open ? -8 : 0,
                                    }}
                                />
                            </button>
                        </div>
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

                                {tentangs && tentangs.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                            Tentang
                                            <ChevronDown className="h-3 w-3" />
                                        </span>
                                        <div className="flex flex-col gap-3 border-l border-border pl-4">
                                            {tentangs.map((t) => (
                                                <Link
                                                    key={t.slug}
                                                    href={`/tentang/${t.slug}`}
                                                    onClick={() => setOpen(false)}
                                                    className="text-sm"
                                                >
                                                    {t.nama}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Link
                                    href="/berita"
                                    onClick={() => setOpen(false)}
                                    className="text-base font-medium"
                                >
                                    Berita
                                </Link>

                                <Link
                                    href="/buletin"
                                    onClick={() => setOpen(false)}
                                    className="text-base font-medium"
                                >
                                    Buletin
                                </Link>

                                <div className="flex flex-col gap-3">
                                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                        Informasi
                                        <ChevronDown className="h-3 w-3" />
                                    </span>
                                    <div className="flex flex-col gap-3 border-l border-border pl-4">
                                        <Link
                                            href="/informasi/pengumuman"
                                            onClick={() => setOpen(false)}
                                            className="text-sm"
                                        >
                                            Pengumuman
                                        </Link>
                                        <Link
                                            href="/informasi/kegiatan"
                                            onClick={() => setOpen(false)}
                                            className="text-sm"
                                        >
                                            Kegiatan
                                        </Link>
                                        <Link
                                            href="/informasi/hari-libur"
                                            onClick={() => setOpen(false)}
                                            className="text-sm"
                                        >
                                            Hari Libur
                                        </Link>
                                    </div>
                                </div>

                                {jenisLayanans && jenisLayanans.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            href="/layanan"
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-1 text-base font-medium"
                                        >
                                            Layanan
                                            <ChevronDown className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                        </Link>
                                        <div className="flex flex-col gap-3 border-l border-border pl-4">
                                            {jenisLayanans.map((j) => (
                                                <Link
                                                    key={j.id}
                                                    href={`/layanan/${j.slug}`}
                                                    onClick={() => setOpen(false)}
                                                    className="text-sm"
                                                >
                                                    {j.nama}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                            className={`w-full rounded-md px-4 py-6 text-base font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:from-emerald-400 hover:to-green-500 hover:shadow-emerald-500/30 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:hover:shadow-emerald-500/30 bg-gradient-to-r from-emerald-500 to-green-600 text-white ${tc.ring}`}
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
        </>
    );
}
