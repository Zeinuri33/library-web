export const formatTanggal = (tanggal: string | null, withWeekday = false) => {
    if (!tanggal) return ''

    try {
        return new Date(tanggal).toLocaleDateString('id-ID', {
            ...(withWeekday ? { weekday: 'long' as const } : {}),
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    } catch {
        return tanggal
    }
}
