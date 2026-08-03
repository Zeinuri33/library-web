import { Link, usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

type LokasiItem = {
    id: number;
    nama: string;
    alamat: string | null;
    telepon: string | null;
    email: string | null;
};

export default function AuthLoginLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name, lokasis } = usePage().props as {
        name: string;
        lokasis?: LokasiItem[];
    };

    const utama = lokasis?.[0];

    return (
        <div className="relative grid min-h-svh bg-background lg:grid-cols-2">
            {/* LEFT: LOGIN FORM */}
            <div className="relative flex flex-col items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-6">
                        {/* Logo */}
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex h-28 w-28 items-center justify-center rounded-md">
                                {/* Logo Light */}
                                <img
                                    src="/kubah.png"
                                    alt="Kubah"
                                    className="h-24 w-auto object-contain dark:hidden"
                                />

                                {/* Logo Dark */}
                                <img
                                    src="/kubah-putih.png"
                                    alt="Kubah Dark"
                                    className="hidden h-24 w-auto object-contain dark:block"
                                />
                            </div>

                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-semibold">{title}</h1>
                            <p className="text-sm text-balance text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>

            {/* RIGHT: MENARA CARD */}
            <div className="relative hidden overflow-hidden lg:block">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-900" />

                {/* Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Orbs */}
                <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-20 -bottom-24 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />

                {/* Brand */}
                <Link
                    href={home()}
                    className="absolute top-8 left-8 z-20 flex items-center text-lg font-medium text-white"
                >
                    <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                    {name}
                </Link>

                {/* Card with Contact Info */}
                <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto p-10">
                    <Card className="w-full max-w-md border-white/20 bg-white/95 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardContent className="flex flex-col items-center px-8 py-10">
                            <div className="text-center">
                                <img
                                    src="/kubah.png"
                                    alt="Logo Perpustakaan Ibrahimy"
                                    className="mx-auto h-16 w-auto object-contain"
                                />

                                <p className="mt-3 text-sm font-bold text-gray-800">
                                    Perpustakaan Ibrahimy
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                    Membangun intelektual paripurna menuju
                                    pemberdayaan ummat.
                                </p>
                            </div>

                            {utama && (
                                <>
                                    <div className="my-6 h-px w-full bg-gray-100" />

                                    <div className="flex w-full flex-col gap-5">
                                        {utama.alamat && (
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                                                    <MapPin className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                                                        Alamat
                                                    </p>
                                                    <p className="mt-0.5 text-sm leading-relaxed font-medium text-gray-700">
                                                        {utama.alamat}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {utama.telepon && (
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                                                    <Phone className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                                                        Telepon
                                                    </p>
                                                    <p className="mt-0.5 text-sm font-medium text-gray-700">
                                                        {utama.telepon}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {utama.email && (
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                                                    <Mail className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                                                        Email
                                                    </p>
                                                    <p className="mt-0.5 text-sm font-medium break-all text-gray-700">
                                                        {utama.email}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
