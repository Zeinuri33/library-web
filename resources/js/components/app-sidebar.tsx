import { Link, usePage } from '@inertiajs/react'
import {
    LayoutGrid,
    Users,
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
        ...(can('lihat-user') ? [{ title: 'List Pengguna', href: '/users' }] : []),
        ...(can('lihat-role') ? [{ title: 'Role', href: '/roles' }] : []),
        ...(can('edit-user') ? [{ title: 'Akses', href: '/permissions' }] : []),
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
                ...(userChildren.length > 0
                    ? [{
                        title: 'Pengguna',
                        icon: Users,
                        children: userChildren,
                    }]
                    : []),
            ]
        },

        {
            label: "Master",
            items: [
                
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
