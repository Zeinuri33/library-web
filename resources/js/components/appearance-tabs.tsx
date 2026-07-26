import { Moon, Sun } from "lucide-react";
import { useAppearance } from "@/hooks/use-appearance";
import { useEffect, useState } from "react";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function AppearanceToggleIcon() {
    const { appearance, updateAppearance } = useAppearance();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const dark =
            appearance === "dark" ||
            (appearance === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);

        setIsDark(dark);
    }, [appearance]);

    const toggle = () => {
        updateAppearance(isDark ? "light" : "dark");
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={toggle}
                    className="text-sidebar-foreground/60 hover:text-sidebar-foreground/90"
                >
                    {isDark ? (
                        <Sun className="size-[18px]" />
                    ) : (
                        <Moon className="size-[18px]" />
                    )}
                    <span>{isDark ? 'Mode Terang' : 'Mode Gelap'}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
