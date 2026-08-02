import { Link, usePage } from '@inertiajs/react'
import {
    LayoutGrid,
    Users,
    Info,
    MapPin,
    CalendarOff,
    Megaphone,
    CalendarDays,
    Newspaper,
} from 'lucide-react'
import AppLogo from '@/components/app-logo'
import AppearanceToggleIcon from '@/components/appearance-tabs'
import { NavMain } from '@/components/nav-main'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarSeparator,
} from '@/components/ui/sidebar'
import { dashboard } from '@/routes'

export function AppSidebar() {

    const { auth } = usePage().props as any
    const permissions = auth?.permissions ?? []

    const can = (perm: string) => permissions.includes(perm)


    // children
    const userChildren = [
        ...(can('lihat-user') ? [{ title: 'List Pengguna', href: '/admin/users' }] : []),
        ...(can('lihat-role') ? [{ title: 'Role', href: '/admin/roles' }] : []),
        ...(can('edit-user') ? [{ title: 'Akses', href: '/admin/permissions' }] : []),
    ]


    const groups = [
        {
            label: "Dashboard",
            items: [
                {
                    title: 'Beranda',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
            ]
        },
        {
            label: "Konten",
            items: [
                
                ...(can('lihat-tentang')
                    ? [{
                        title: 'Tentang',
                        icon: Info,
                        href: '/admin/tentang',
                    }]
                    : []),
                ...(can('lihat-lokasi')
                    ? [{
                        title: 'Lokasi',
                        icon: MapPin,
                        href: '/admin/lokasi',
                    }]
                    : []),
                ...(can('lihat-pengumuman')
                    ? [{
                        title: 'Pengumuman',
                        icon: Megaphone,
                        href: '/admin/pengumuman',
                    }]
                    : []),
                ...(can('lihat-berita')
                    ? [{
                        title: 'Berita',
                        icon: Newspaper,
                        href: '/admin/berita',
                    }]
                    : []),
                ...(can('lihat-kegiatan')
                    ? [{
                        title: 'Kegiatan',
                        icon: CalendarDays,
                        href: '/admin/kegiatan',
                    }]
                    : []),
                ...(can('lihat-hari-libur')
                    ? [{
                        title: 'Hari Libur',
                        icon: CalendarOff,
                        href: '/admin/hari-libur',
                    }]
                    : []),
            ]
        },

        {
            label: "User",
            items: [
                ...(userChildren.length > 0
                    ? [{
                        title: 'Pengguna',
                        icon: Users,
                        children: userChildren,
                    }]
                    : []),
            ]
        },
    ]

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="pb-2">
                <Link href={dashboard()} prefetch className="flex items-center gap-2.5">
                    <AppLogo />
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-1 gap-0">
                {groups.map((group) => (
                    group.items.length > 0 && (
                        <NavMain
                            key={group.label}
                            items={group.items}
                            label={group.label}
                        />
                    )
                ))}
            </SidebarContent>

            <SidebarSeparator />

            <SidebarFooter className="pb-3 gap-1">
                <AppearanceToggleIcon />
            </SidebarFooter>
        </Sidebar>
    )
}
