import { useTheme } from '@/context/ThemeContext';

export const themeMaps = {
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

export function useThemeClasses() {
    const { themeAccent } = useTheme();
    const tc = themeMaps[themeAccent as keyof typeof themeMaps] || themeMaps.emerald;

    return { tc, themeAccent };
}
