import { Breadcrumbs } from '@/components/breadcrumbs';
import AppearanceToggleIcon from '@/components/appearance-tabs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-14 shrink-0 items-center bg-background/80 backdrop-blur-md px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">

            {/* Kiri */}
            <div className="flex items-center gap-3">
                <SidebarTrigger className="size-7 rounded-lg hover:bg-transparent hover:text-primary transition-all duration-200" />
                <div className="hidden sm:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            {/* Kanan */}
            <div className="ml-auto">
                <AppearanceToggleIcon />
            </div>

        </header>
    );
}
