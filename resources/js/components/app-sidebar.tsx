import { Link, usePage } from '@inertiajs/react'
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Users,
 } from 'lucide-react'
import AppLogo from '@/components/app-logo'
import { NavFooter } from '@/components/nav-footer'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar'
import { dashboard } from '@/routes'
import type { NavItem } from '@/types'

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/zeinuri33/digilib',
        icon: FolderGit2,
    },
    {
        title: 'Website',
        href: '/',
        icon: BookOpen,
    },
]

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
                        icon: LayoutGrid,
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
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="group-data-[collapsible=icon]:p-2 hover:bg-sidebar-hover">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator />

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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
