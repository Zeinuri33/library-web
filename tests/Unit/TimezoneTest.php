<?php

namespace Tests\Unit;

use Tests\TestCase;

class TimezoneTest extends TestCase
{
    /**
     * Jam buka perpustakaan disimpan dalam waktu lokal WIB. Deteksi shift
     * pengunjung membandingkan now() dengan jam buka, sehingga timezone aplikasi
     * harus konsisten dengan WIB. Jika bergeser (mis. kembali ke UTC), angka
     * per-shift di TV pengunjung tertukar — mis. shift malam menampilkan jumlah
     * pengunjung shift siang.
     */
    public function test_app_timezone_is_asia_jakarta(): void
    {
        $this->assertSame('Asia/Jakarta', config('app.timezone'));
        $this->assertSame('Asia/Jakarta', date_default_timezone_get());
    }
}
