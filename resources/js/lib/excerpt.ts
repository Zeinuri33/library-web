const MAX_EXCERPT_LENGTH = 160

/**
 * Ubah HTML menjadi cuplikan teks polos untuk pesan share:
 * - beri spasi antar blok agar kata tidak menyambung
 * - buang tag, decode entitas umum (mis. &amp; -> &)
 * - potong ke maxLength karakter
 */
export function shareExcerpt(html: string, maxLength: number = MAX_EXCERPT_LENGTH): string {
    const text = (html || '')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/(p|div|h[1-6]|li|ul|ol|blockquote|section|tr|td)>/gi, ' $&')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#0*39;/gi, "'")
        // Entitas numerik umum dari paste Word/Tiptap
        .replace(/&#0*8216;/gi, "'")
        .replace(/&#0*8217;/gi, "'")
        .replace(/&#0*8220;/gi, '"')
        .replace(/&#0*8221;/gi, '"')
        .replace(/&#0*8211;/gi, '–')
        .replace(/&#0*8212;/gi, '—')
        .replace(/&#0*8230;/gi, '…')
        .replace(/\s+/g, ' ')
        .trim()

    return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text
}

/**
 * Susun teks pesan WhatsApp: judul + cuplikan isi + URL.
 */
export function waShareText(title: string, html: string, url: string): string {
    const excerpt = shareExcerpt(html)

    return excerpt ? `${title}\n\n${excerpt}\n\n${url}` : `${title}\n\n${url}`
}
