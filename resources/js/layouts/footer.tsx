"use client";

import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Facebook,
    Instagram,
    Mail,
    Youtube,
} from "lucide-react";

interface FooterProps {
    tc: any;
    tentangs?: { nama: string; slug: string; deskripsi?: string }[];
    jenisLayanans?: { id: number; nama: string; slug: string; deskripsi?: string }[];
}

export default function Footer({ tc, tentangs, jenisLayanans }: FooterProps) {
    return (
        <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-900">
            {/* ANIMATED ORBS */}
            <motion.div
                className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/40 mix-blend-multiply blur-[120px] dark:mix-blend-lighten"
                animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-green-300/40 mix-blend-multiply blur-[130px] dark:mix-blend-lighten"
                animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* GLASSMORPHISM OVERLAY */}
            <div className="pointer-events-none absolute inset-0 bg-white/10 backdrop-blur-[2px] dark:bg-black/10"></div>

            {/* GRID OVERLAY */}
            <div
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            ></div>

            <div className="relative z-[2] mx-auto max-w-6xl px-6 py-16">
                <div className="grid gap-12 md:grid-cols-2">
                    {/* LEFT */}
                    <div>
                        <h2 className="bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-xl font-bold text-transparent">
                            Perpustakaan Ibrahimy
                        </h2>

                        <p className="mt-4 max-w-md text-emerald-50/85">
                            Perpustakaan Ibrahimy adalah pusat informasi dan literasi Pondok Pesantren Salafiyah Syafi’iyah Sukorejo Situbondo yang melayani santri, mahasiswa, dosen, dan masyarakat.
                        </p>

                        {/* SOCIAL */}
                        <div className="mt-6 flex gap-3">
                            {[
                                {
                                    icon: Facebook,
                                    href: "https://www.facebook.com/perpustakaan.ibrahimy.1",
                                },
                                {
                                    icon: Instagram,
                                    href: "https://instagram.com/ibrahimy.library",
                                },
                                {
                                    icon: Youtube,
                                    href: "https://youtube.com/@PerpustakaanIbrahimy",
                                },
                                {
                                    icon: Mail,
                                    href: "mailto:library@ibrahimy.ac.id",
                                },
                            ].map((item, i) => {
                                const Icon = item.icon;

                                return (
                                    <a
                                        key={i}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white hover:bg-white hover:text-emerald-700 ${tc.ring}`}
                                    >
                                        <Icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT MENU (sama dengan menu header) */}
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {/* MENU */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold text-white">
                                Menu
                            </h3>

                            <ul className="space-y-2 text-emerald-50/80">
                                <li>
                                    <Link
                                        className="transition-colors duration-300 hover:text-white"
                                        href="/"
                                    >
                                        Beranda
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        className="transition-colors duration-300 hover:text-white"
                                        href="/berita"
                                    >
                                        Berita
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        className="transition-colors duration-300 hover:text-white"
                                        href="/buletin"
                                    >
                                        Buletin
                                    </Link>
                                </li>

                                <li>
                                    <a
                                        className={`transition-colors duration-300 hover:text-white ${tc.ring}`}
                                        href="https://digilib.ibrahimy.ac.id/docs"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Panduan
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* INFORMASI */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold text-white">
                                Informasi
                            </h3>

                            <ul className="space-y-2 text-emerald-50/80">
                                <li>
                                    <Link
                                        className="transition-colors duration-300 hover:text-white"
                                        href="/informasi/pengumuman"
                                    >
                                        Pengumuman
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        className="transition-colors duration-300 hover:text-white"
                                        href="/informasi/kegiatan"
                                    >
                                        Kegiatan
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        className="transition-colors duration-300 hover:text-white"
                                        href="/informasi/hari-libur"
                                    >
                                        Hari Libur
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* LAYANAN */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold text-white">
                                Layanan
                            </h3>

                            <ul className="space-y-2 text-emerald-50/80">
                                <li>
                                    <Link
                                        className="transition-colors duration-300 hover:text-white"
                                        href="/layanan"
                                    >
                                        Semua Layanan
                                    </Link>
                                </li>

                                {jenisLayanans?.map((j) => (
                                    <li key={j.id}>
                                        <Link
                                            className="transition-colors duration-300 hover:text-white"
                                            href={`/layanan/${j.slug}`}
                                        >
                                            {j.nama}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* TENTANG */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold text-white">
                                Tentang
                            </h3>

                            <ul className="space-y-2 text-emerald-50/80">
                                {tentangs && tentangs.length > 0 ? (
                                    tentangs.map((t) => (
                                        <li key={t.slug}>
                                            <Link
                                                className="transition-colors duration-300 hover:text-white"
                                                href={`/tentang/${t.slug}`}
                                            >
                                                {t.nama}
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <li>
                                        <Link
                                            className="transition-colors duration-300 hover:text-white"
                                            href="/"
                                        >
                                            Profil
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="mt-12 flex flex-col items-center justify-between border-t border-white/10 pt-6 text-sm text-emerald-50/80 sm:flex-row">
                    <p>
                        © {new Date().getFullYear()} Ibrahimy Library.
                        All rights reserved.
                    </p>

                    <p className="mt-2 sm:mt-0">
                        Developed by{" "}
                        <span className="font-medium text-white">
                            @Zeinuri
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
