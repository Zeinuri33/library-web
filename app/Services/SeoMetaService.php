<?php

namespace App\Services;

use Illuminate\Support\Str;

class SeoMetaService
{
    private const MAX_DESCRIPTION_LENGTH = 160;

    public function __construct(private readonly HtmlToTextService $htmlToText) {}

    /**
     * Build Open Graph meta data for the given Inertia page.
     *
     * @param  array<string, mixed>  $page
     * @return array{title: string, description: string, image: string, type: string, url: string}
     */
    public function forPage(array $page, string $url): array
    {
        $component = $page['component'] ?? null;
        $props = $page['props'] ?? [];

        $item = match ($component) {
            'berita/show' => $props['berita'] ?? null,
            'pengumuman/show' => $props['pengumuman'] ?? null,
            'tentang/show' => $props['tentang'] ?? null,
            'buletin/show' => $props['buletin'] ?? null,
            default => null,
        };

        $defaults = $this->defaults($url);

        if (! is_array($item)) {
            return $defaults;
        }

        $title = $item['judul'] ?? $item['nama'] ?? $item['edisi'] ?? $defaults['title'];

        $description = $defaults['description'];
        if (! empty($item['isi'])) {
            $description = Str::limit($this->textFromHtml((string) $item['isi']), self::MAX_DESCRIPTION_LENGTH);
        }

        $image = $defaults['image'];
        if (! empty($item['thumbnail'])) {
            $image = $this->absoluteUrl((string) $item['thumbnail']);
        }

        return [
            'title' => (string) $title,
            'description' => $description,
            'image' => $image,
            'type' => 'article',
            'url' => $url,
        ];
    }

    /**
     * @return array{title: string, description: string, image: string, type: string, url: string}
     */
    private function defaults(string $url): array
    {
        return [
            'title' => (string) config('app.name', 'Perpustakaan Ibrahimy'),
            'description' => 'Website resmi Perpustakaan Ibrahimy — layanan, berita, dan informasi terkini.',
            'image' => url('logo%20perpus.png'),
            'type' => 'website',
            'url' => $url,
        ];
    }

    private function absoluteUrl(string $url): string
    {
        return Str::startsWith($url, ['http://', 'https://', '//'])
            ? $url
            : url($url);
    }

    /**
     * Ubah HTML konten menjadi teks polos, dengan spasi antar blok dan
     * entitas HTML yang sudah di-decode (mis. &amp; -> &).
     */
    private function textFromHtml(string $html): string
    {
        $html = str_ireplace('<br>', ' ', $html);
        $html = preg_replace('#</(p|div|h[1-6]|li|ul|ol|blockquote|section|tr|td)>#i', ' $0', $html) ?? $html;

        $text = $this->htmlToText->convert($html);

        return html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }
}
