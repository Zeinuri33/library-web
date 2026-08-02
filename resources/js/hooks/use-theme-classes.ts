export const tc = {
    selection: 'selection:bg-emerald-500/30',
    textGradient:
        'from-emerald-500 to-green-600 dark:from-emerald-400 dark:to-green-500',
    bgGradient: 'bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-900',
    ring: 'focus:ring-emerald-500/50',
    shadow: 'hover:shadow-emerald-500/30 dark:hover:shadow-emerald-500/30',
    glow: 'from-emerald-500/10',
    orb: 'bg-emerald-500/20 blur-[150px]',
    heroOrb: 'bg-emerald-500/20',
    textWhite: 'text-white',
    footerBg: 'bg-white dark:bg-slate-950',
    footerBorder: 'border-gray-200 dark:border-gray-800',
    socialBorder: 'border-gray-200 dark:border-gray-700',
    bgSoft: 'bg-gray-50 dark:bg-gray-900',
    text: 'text-gray-900 dark:text-white',
    textPrimary: 'text-emerald-600 dark:text-emerald-400',
};

export function useThemeClasses() {
    return { tc, themeAccent: 'emerald' };
}
