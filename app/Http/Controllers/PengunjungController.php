<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\HariLibur;
use App\Models\Kegiatan;
use App\Models\Lokasi;
use App\Models\Pengumuman;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class PengunjungController extends Controller
{
    private const API_URL = 'https://opac.ibrahimy.ac.id/api/PengunjungApiController.php?token=pengunjungAPI97';

    /**
     * Mengambil data pengunjung dari API eksternal secara server-side.
     *
     * Data sukses di-cache 1 detik agar angka nyaris real-time. Nilai null
     * (API sedang tidak terjangkau) sengaja TIDAK di-cache agar tombol muat
     * ulang di sisi klien langsung mencoba ulang. Mengembalikan null jika
     * API tidak dapat dijangkau sehingga halaman tetap bisa dirender.
     */
    private function fetchPengunjung(): ?array
    {
        try {
            $cached = Cache::get('pengunjung.live');

            if ($cached !== null) {
                return $cached;
            }

            $fresh = $this->fetchFromApi();

            if ($fresh !== null) {
                Cache::put('pengunjung.live', $fresh, 1);
            }

            return $fresh;
        } catch (\Throwable) {
            // Cache store bermasalah (mis. DB turun) — ambil langsung dari API.
            return $this->fetchFromApi();
        }
    }

    private function fetchFromApi(): ?array
    {
        try {
            $response = Http::timeout(6)->acceptJson()->get(self::API_URL);

            if (! $response->successful()) {
                return null;
            }

            $result = $response->json();

            if (($result['status'] ?? null) !== 'success') {
                return null;
            }

            return $result['data'] ?? null;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Lokasi utama perpustakaan (tempat jadwal jam buka diambil).
     */
    private function jadwalUtama(): ?Lokasi
    {
        return Lokasi::where('is_utama', true)->first() ?? Lokasi::first();
    }

    /**
     * Menentukan shift yang sedang aktif saat ini berdasarkan jadwal jam buka
     * lokasi utama. Mengembalikan 'pagi'/'siang'/'malam', atau null jika tutup.
     */
    private function currentShift(): ?string
    {
        try {
            // Cache pendek (2 detik) agar TV yang mem-poll tiap detik tidak
            // membebani DB dengan query jadwal berulang kali.
            $cached = Cache::get('pengunjung.current_shift');

            if (is_string($cached)) {
                return $cached === 'closed' ? null : $cached;
            }

            $shift = $this->detectCurrentShift();

            Cache::put('pengunjung.current_shift', $shift ?? 'closed', 2);

            return $shift;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Mendeteksi shift aktif saat ini dari jadwal jam buka lokasi utama
     * (tanpa cache). Mengembalikan 'pagi'/'siang'/'malam', atau null jika tutup.
     */
    private function detectCurrentShift(): ?string
    {
        $lokasi = $this->jadwalUtama();

        if (! $lokasi) {
            return null;
        }

        $hari = (int) now()->format('w');
        $sekarang = now()->hour * 60 + now()->minute;

        foreach ($lokasi->jamBuka as $jb) {
            if ((int) $jb->hari !== $hari || $jb->mode !== 'custom' || ! $jb->jam_buka || ! $jb->jam_tutup) {
                continue;
            }

            [$hb, $mb] = array_map('intval', explode(':', $jb->jam_buka));
            [$ht, $mt] = array_map('intval', explode(':', $jb->jam_tutup));

            $mulai = $hb * 60 + $mb;
            $akhir = $ht * 60 + $mt;

            if ($sekarang >= $mulai && $sekarang < $akhir) {
                return $jb->shif;
            }
        }

        return null;
    }

    /**
     * Mencatat total pengunjung saat shift dimulai (baseline) dan mengembalikannya.
     *
     * Baseline dicatat SEKALI per shift per hari (cache dicek tanggalnya), lalu
     * dibekukan pada angka saat shift berganti. Karena TV mem-poll tiap 1 detik,
     * pencatatan terjadi nyaris tepat saat shift baru dimulai.
     */
    private function baselineShift(string $shift, int $total): ?int
    {
        try {
            $key = "pengunjung.baseline.{$shift}";
            $cached = Cache::get($key);
            $today = now()->toDateString();

            if (is_array($cached) && ($cached['tanggal'] ?? null) === $today) {
                return (int) ($cached['total'] ?? $total);
            }

            Cache::put($key, ['tanggal' => $today, 'total' => $total], now()->addDay());

            return $total;
        } catch (\Throwable) {
            // Cache bermasalah — tidak bisa menghitung baseline, fallback ke total.
            return null;
        }
    }

    /**
     * Menambahkan info per shift ke data pengunjung:
     *
     * - total_shift_ini: total hari ini dikurangi baseline shift sebelumnya.
     *   Pagi = tidak dikurangi; siang = dikurangi total pagi; malam = dikurangi
     *   total pagi + siang (baseline malam dicatat saat malam dimulai).
     * - current_shift: shift yang sedang aktif saat ini (atau null saat tutup).
     */
    private function withShiftInfo(?array $pengunjung): ?array
    {
        if ($pengunjung === null) {
            return null;
        }

        $total = (int) ($pengunjung['total_pengunjung_hari_ini'] ?? 0);
        $shift = $this->currentShift();
        $totalShift = $total;

        if ($shift !== null && $shift !== 'pagi') {
            $baseline = $this->baselineShift($shift, $total);

            if ($baseline !== null) {
                $totalShift = max(0, $total - $baseline);
            }
        }

        $pengunjung['current_shift'] = $shift;
        $pengunjung['total_shift_ini'] = $totalShift;

        return $pengunjung;
    }

    public function publicIndex()
    {
        // Kegiatan mendatang didahulukan; jika belum ada, tampilkan kegiatan terbaru.
        $kegiatans = Kegiatan::with('lokasi')
            ->where('tanggal', '>=', now()->toDateString())
            ->orderBy('tanggal')
            ->take(3)
            ->get();

        if ($kegiatans->isEmpty()) {
            $kegiatans = Kegiatan::with('lokasi')
                ->orderBy('tanggal', 'desc')
                ->take(3)
                ->get();
        }

        return Inertia::render('pengunjung/public', [
            'pengunjung' => $this->withShiftInfo($this->fetchPengunjung()),
            'beritas' => Berita::orderBy('tanggal', 'desc')
                ->orderBy('created_at', 'desc')
                ->take(3)
                ->get(),
            'kegiatans' => $kegiatans,
            'pengumumans' => Pengumuman::orderBy('created_at', 'desc')
                ->take(3)
                ->get(),
            'hariLiburs' => HariLibur::where('tanggal', '>=', now()->toDateString())
                ->orderBy('tanggal')
                ->take(3)
                ->get(),
            'lokasiUtama' => $this->jadwalUtama(),
        ]);
    }

    /**
     * Endpoint JSON untuk live update dari sisi klien (dipoll tiap beberapa detik).
     */
    public function data()
    {
        return response()->json([
            'status' => 'success',
            'data' => $this->withShiftInfo($this->fetchPengunjung()),
        ]);
    }
}
