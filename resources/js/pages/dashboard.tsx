import { Head } from '@inertiajs/react';
import { Users, Shield, ArrowUpRight, TrendingUp, ArrowUp, Newspaper, Megaphone, CalendarDays, CalendarOff, MapPin, Info, HandPlatter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { dashboard } from '@/routes';

interface ActivityLogItem {
    id: number;
    method: string;
    path: string;
    deskripsi: string | null;
    created_at: string;
    user: { id: number; name: string } | null;
}

interface DashboardProps {
    totalUsers?: number;
    totalBerita?: number;
    totalKegiatan?: number;
    totalPengumuman?: number;
    totalHariLibur?: number;
    totalLokasi?: number;
    totalLayanan?: number;
    totalTentang?: number;
    activityLogs?: ActivityLogItem[];
}

export default function Dashboard({
    totalUsers,
    totalBerita,
    totalKegiatan,
    totalPengumuman,
    totalHariLibur,
    totalLokasi,
    totalLayanan,
    totalTentang,
    activityLogs = [],
}: DashboardProps) {
    const stats = [
        {
            title: 'Pengguna',
            value: totalUsers ?? 0,
            icon: Users,
            color: 'from-violet-500/20 to-violet-600/10',
            iconColor: 'text-violet-600 dark:text-violet-400',
            bgIcon: 'bg-violet-100 dark:bg-violet-900/30',
        },
        {
            title: 'Berita',
            value: totalBerita ?? 0,
            icon: Newspaper,
            color: 'from-sky-500/20 to-sky-600/10',
            iconColor: 'text-sky-600 dark:text-sky-400',
            bgIcon: 'bg-sky-100 dark:bg-sky-900/30',
        },
        {
            title: 'Kegiatan',
            value: totalKegiatan ?? 0,
            icon: CalendarDays,
            color: 'from-emerald-500/20 to-emerald-600/10',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            bgIcon: 'bg-emerald-100 dark:bg-emerald-900/30',
        },
        {
            title: 'Pengumuman',
            value: totalPengumuman ?? 0,
            icon: Megaphone,
            color: 'from-amber-500/20 to-amber-600/10',
            iconColor: 'text-amber-600 dark:text-amber-400',
            bgIcon: 'bg-amber-100 dark:bg-amber-900/30',
        },
        {
            title: 'Hari Libur',
            value: totalHariLibur ?? 0,
            icon: CalendarOff,
            color: 'from-rose-500/20 to-rose-600/10',
            iconColor: 'text-rose-600 dark:text-rose-400',
            bgIcon: 'bg-rose-100 dark:bg-rose-900/30',
        },
        {
            title: 'Lokasi',
            value: totalLokasi ?? 0,
            icon: MapPin,
            color: 'from-blue-500/20 to-blue-600/10',
            iconColor: 'text-blue-600 dark:text-blue-400',
            bgIcon: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            title: 'Layanan',
            value: totalLayanan ?? 0,
            icon: HandPlatter,
            color: 'from-teal-500/20 to-teal-600/10',
            iconColor: 'text-teal-600 dark:text-teal-400',
            bgIcon: 'bg-teal-100 dark:bg-teal-900/30',
        },
        {
            title: 'Tentang',
            value: totalTentang ?? 0,
            icon: Info,
            color: 'from-orange-500/20 to-orange-600/10',
            iconColor: 'text-orange-600 dark:text-orange-400',
            bgIcon: 'bg-orange-100 dark:bg-orange-900/30',
        },
    ];

    const quickLinks = [
        { label: 'Kelola Pengguna', href: '/admin/users', icon: Users, desc: 'Atur data dan hak akses pengguna' },
        { label: 'Kelola Role', href: '/admin/roles', icon: Shield, desc: 'Atur grup dan peran pengguna' },
        { label: 'Kelola Berita', href: '/admin/berita', icon: Newspaper, desc: 'Kelola berita perpustakaan' },
        { label: 'Kelola Kegiatan', href: '/admin/kegiatan', icon: CalendarDays, desc: 'Catat kegiatan dan acara' },
        { label: 'Kelola Pengumuman', href: '/admin/pengumuman', icon: Megaphone, desc: 'Terbitkan pengumuman' },
        { label: 'Kelola Hari Libur', href: '/admin/hari-libur', icon: CalendarOff, desc: 'Atur hari libur perpustakaan' },
        { label: 'Kelola Lokasi', href: '/admin/lokasi', icon: MapPin, desc: 'Kelola data lokasi dan jam buka' },
        { label: 'Kelola Layanan', href: '/admin/layanan', icon: HandPlatter, desc: 'Kelola layanan perpustakaan' },
        { label: 'Kelola Tentang', href: '/admin/tentang', icon: Info, desc: 'Kelola profil dan informasi' },
    ];

    const methodStyles: Record<string, string> = {
        POST: 'bg-emerald-500',
        PUT: 'bg-amber-500',
        PATCH: 'bg-amber-500',
        DELETE: 'bg-rose-500',
    };

    const formatDate = (value: string) =>
        new Date(value).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const quickGridRef = useRef<HTMLDivElement>(null);
    const [quickHeight, setQuickHeight] = useState(0);

    useEffect(() => {
        const el = quickGridRef.current;

        if (!el) {
            return;
        }

        const update = () => setQuickHeight(el.offsetHeight);
        update();

        const observer = new ResizeObserver(update);
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Selamat datang di panel administrasi
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        const hasValue = stat.value > 0;

                        return (
                            <div
                                key={stat.title}
                                className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5"
                            >
                                {/* Background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-60`} />

                                <div className="relative z-10 flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {stat.title}
                                        </p>
                                        <p className="text-3xl font-bold tracking-tight">
                                            {stat.value.toLocaleString('id-ID')}
                                        </p>
                                    </div>

                                    <div className={`rounded-xl p-3 ${stat.bgIcon} ${stat.iconColor} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>

                                {/* Trend indicator */}
                                <div className="relative z-10 mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    {hasValue ? (
                                        <ArrowUp className="h-3.5 w-3.5 text-blue-500" />
                                    ) : (
                                        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/50" />
                                    )}
                                    <span>{hasValue ? 'Tersedia' : 'Belum ada data'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Links + Riwayat Log */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Quick Links */}
                    <div className="space-y-4 lg:col-span-2">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            AKSI CEPAT
                        </h2>
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3" ref={quickGridRef}>
                            {quickLinks.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="group flex items-center gap-4 rounded-xl border bg-card p-4 shadow-soft transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 hover:bg-sidebar-hover"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.label}</p>
                                            <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Riwayat Log Sistem */}
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            RIWAYAT LOG SISTEM
                        </h2>
                        <div
                            className="flex flex-col rounded-xl border bg-card p-4 shadow-soft"
                            style={{ height: quickHeight || undefined }}
                        >
                            {activityLogs.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
                            ) : (
                                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
                                    {activityLogs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                                        >
                                            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${methodStyles[log.method] ?? 'bg-muted-foreground/40'}`} />
                                            <div className="min-w-0 flex-1 space-y-0.5">
                                                <p className="text-sm leading-snug">{log.deskripsi}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {log.user?.name ?? 'System'} &bull; {formatDate(log.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Beranda',
            href: dashboard(),
        },
    ],
};
