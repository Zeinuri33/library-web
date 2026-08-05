<?php

namespace Tests\Unit;

use App\Services\HtmlToTextService;
use App\Services\SeoMetaService;
use Tests\TestCase;

class SeoMetaServiceTest extends TestCase
{
    private function service(): SeoMetaService
    {
        return new SeoMetaService(new HtmlToTextService());
    }

    public function test_berita_show_page_uses_berita_props_for_meta(): void
    {
        $meta = $this->service()->forPage([
            'component' => 'berita/show',
            'props' => [
                'berita' => [
                    'judul' => 'Judul Berita Contoh',
                    'isi' => '<p>Ini adalah isi berita yang cukup panjang untuk dijadikan deskripsi preview saat dibagikan ke WhatsApp.</p>',
                    'thumbnail' => 'http://localhost/storage/berita/contoh.jpg',
                ],
            ],
        ], 'http://localhost/berita/judul-berita-contoh');

        $this->assertSame('Judul Berita Contoh', $meta['title']);
        $this->assertStringContainsString('Ini adalah isi berita', $meta['description']);
        $this->assertSame('http://localhost/storage/berita/contoh.jpg', $meta['image']);
        $this->assertSame('article', $meta['type']);
        $this->assertSame('http://localhost/berita/judul-berita-contoh', $meta['url']);
    }

    public function test_description_is_stripped_from_html_and_truncated(): void
    {
        $longText = str_repeat('Kata-kata untuk menguji pemotongan deskripsi. ', 20);

        $meta = $this->service()->forPage([
            'component' => 'berita/show',
            'props' => [
                'berita' => [
                    'judul' => 'Berita Panjang',
                    'isi' => "<h2>Subjudul</h2><p>{$longText}</p>",
                    'thumbnail' => null,
                ],
            ],
        ], 'http://localhost/berita/berita-panjang');

        $this->assertStringNotContainsString('<h2>', $meta['description']);
        $this->assertLessThanOrEqual(163, mb_strlen($meta['description']));
    }

    public function test_description_decodes_entities_and_separates_blocks(): void
    {
        $meta = $this->service()->forPage([
            'component' => 'berita/show',
            'props' => [
                'berita' => [
                    'judul' => 'Berita Entitas',
                    'isi' => '<p>Bagian pertama &amp; kedua.</p><p>Baris lanjutan &quot;kutipan&quot;.</p>',
                    'thumbnail' => null,
                ],
            ],
        ], 'http://localhost/berita/berita-entitas');

        $this->assertStringContainsString('Bagian pertama & kedua.', $meta['description']);
        $this->assertStringContainsString('Baris lanjutan "kutipan".', $meta['description']);
        $this->assertStringNotContainsString('&amp;', $meta['description']);
        // Harus ada spasi pemisah antar paragraf, bukan "kedua.Baris"
        $this->assertStringContainsString('kedua. Baris', $meta['description']);
    }

    public function test_unknown_page_uses_defaults(): void
    {
        $meta = $this->service()->forPage([
            'component' => 'dashboard',
            'props' => [],
        ], 'http://localhost/admin/dashboard');

        $this->assertSame(config('app.name'), $meta['title']);
        $this->assertSame('website', $meta['type']);
        $this->assertSame('http://localhost/admin/dashboard', $meta['url']);
        $this->assertNotEmpty($meta['image']);
    }
}
