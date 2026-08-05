<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\Buletin;
use App\Models\HariLibur;
use App\Models\JenisLayanan;
use App\Models\Kegiatan;
use App\Models\Layanan;
use App\Models\Lokasi;
use App\Models\Pengumuman;
use App\Models\Tentang;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Membangun indeks pencarian dari seluruh konten halaman publik
     * (berita, buletin, pengumuman, kegiatan, hari libur, layanan,
     * lokasi, tentang, serta halaman statis) dalam bentuk JSON.
     */
    public function index(Request $request)
    {
        $pages = [
            ['group' => 'Halaman', 'title' => 'Beranda', 'description' => 'Halaman utama Perpustakaan Ibrahimy', 'url' => '/'],
            ['group' => 'Halaman', 'title' => 'Berita', 'description' => 'Kumpulan berita perpustakaan', 'url' => '/berita'],
            ['group' => 'Halaman', 'title' => 'Buletin', 'description' => 'Kumpulan buletin digital', 'url' => '/buletin'],
            ['group' => 'Halaman', 'title' => 'Layanan', 'description' => 'Daftar layanan perpustakaan', 'url' => '/layanan'],
            ['group' => 'Halaman', 'title' => 'Pengumuman', 'description' => 'Informasi resmi terbaru', 'url' => '/informasi/pengumuman'],
            ['group' => 'Halaman', 'title' => 'Kegiatan', 'description' => 'Agenda kegiatan perpustakaan', 'url' => '/informasi/kegiatan'],
            ['group' => 'Halaman', 'title' => 'Hari Libur', 'description' => 'Jadwal libur dan tutup layanan', 'url' => '/informasi/hari-libur'],
            ['group' => 'Halaman', 'title' => 'Pengunjung', 'description' => 'Statistik kunjungan perpustakaan secara langsung', 'url' => '/pengunjung'],
        ];

        $beritas = Berita::orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($b) => [
                'group' => 'Berita',
                'title' => $b->judul,
                'description' => $b->deskripsi,
                'url' => '/berita/'.$b->slug,
                'date' => $b->tanggal?->toDateString(),
            ]);

        $buletins = Buletin::orderBy('tanggal_terbit', 'desc')
            ->get()
            ->map(fn ($b) => [
                'group' => 'Buletin',
                'title' => $b->label_edisi,
                'description' => null,
                'url' => '/buletin/'.$b->slug,
                'date' => $b->tanggal_terbit?->toDateString(),
            ]);

        $pengumumans = Pengumuman::orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($p) => [
                'group' => 'Pengumuman',
                'title' => $p->judul,
                'description' => $p->deskripsi,
                'url' => '/informasi/pengumuman/'.$p->slug,
                'date' => $p->created_at?->toDateString(),
            ]);

        $kegiatans = Kegiatan::with('lokasi')
            ->orderBy('tanggal', 'desc')
            ->get()
            ->map(fn ($k) => [
                'group' => 'Kegiatan',
                'title' => $k->nama,
                'description' => $k->nama_lokasi,
                'url' => '/informasi/kegiatan',
                'date' => $k->tanggal?->toDateString(),
            ]);

        $lokasiNama = Lokasi::pluck('nama', 'id');

        $hariLiburs = HariLibur::orderBy('tanggal', 'desc')
            ->get()
            ->map(function ($h) use ($lokasiNama) {
                $ids = $h->lokasi_ids ?? [];
                $namaLokasi = empty($ids)
                    ? 'Semua Lokasi'
                    : collect($ids)->map(fn ($id) => $lokasiNama->get($id))->filter()->values()->implode(', ');

                return [
                    'group' => 'Hari Libur',
                    'title' => $h->nama,
                    'description' => $namaLokasi,
                    'url' => '/informasi/hari-libur',
                    'date' => $h->tanggal?->toDateString(),
                ];
            });

        $layanans = Layanan::orderBy('nama_layanan')
            ->get()
            ->map(fn ($l) => [
                'group' => 'Layanan',
                'title' => $l->nama_layanan,
                'description' => $l->deskripsi ?: ($l->jenisLayanan?->nama ?? null),
                'url' => $l->url ?: ($l->jenisLayanan?->slug ? '/layanan/'.$l->jenisLayanan->slug : '/layanan'),
                'external' => (bool) $l->url,
            ]);

        $jenisLayanans = JenisLayanan::orderBy('nama')
            ->get()
            ->map(fn ($j) => [
                'group' => 'Layanan',
                'title' => $j->nama,
                'description' => $j->deskripsi,
                'url' => '/layanan/'.$j->slug,
            ]);

        $lokasis = Lokasi::orderByDesc('is_utama')
            ->orderBy('nama')
            ->get()
            ->map(fn ($l) => [
                'group' => 'Lokasi',
                'title' => $l->nama,
                'description' => $l->alamat ?: $l->deskripsi,
                'url' => '/lokasi/'.$l->slug,
            ]);

        $tentangs = Tentang::orderBy('nama')
            ->get()
            ->map(fn ($t) => [
                'group' => 'Tentang',
                'title' => $t->nama,
                'description' => $t->deskripsi,
                'url' => '/tentang/'.$t->slug,
            ]);

        return response()->json([
            'data' => collect([...$pages, ...$beritas, ...$buletins, ...$pengumumans, ...$kegiatans, ...$hariLiburs, ...$layanans, ...$jenisLayanans, ...$lokasis, ...$tentangs])
                ->values()
                ->all(),
        ]);
    }
}
