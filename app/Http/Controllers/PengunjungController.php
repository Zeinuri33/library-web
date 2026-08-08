<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\HariLibur;
use App\Models\Kegiatan;
use App\Models\Lokasi;
use App\Models\Pengumuman;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class PengunjungController extends Controller
{
    // URL Cadangan jika .env atau services.php gagal dimuat
    private const DEFAULT_API_URL = 'https://opac.ibrahimy.ac.id/api/PengunjungApiController.php?token=pengunjungAPI97';

    /**
     * Mengambil data pengunjung dari API SLiMS/OPAC.
     * Menggunakan Cache 1 detik agar beban server lebih ringan saat di-poll oleh banyak TV/Client.
     */
    private function fetchPengunjung(): ?array
    {
        try {
            return Cache::remember('pengunjung.live', 1, function () {
                return $this->fetchFromApi();
            });
        } catch (Throwable $e) {
            // Jika Redis/File Cache bermasalah, paksa ambil langsung dari API
            return $this->fetchFromApi();
        }
    }

    /**
     * Membaca URL API dari konfigurasi services (yang mengambil dari .env).
     */
    private function apiUrl(): string
    {
        return (string) config('services.pengunjung.api_url', self::DEFAULT_API_URL);
    }

    /**
     * Memalsukan Headers agar tidak diblokir oleh WAF (seperti SafeLine/Cloudflare).
     */
    private function browserHeaders(): array
    {
        return [
            // TAMBAHKAN BARIS INI UNTUK MENGAKALI VIRTUAL HOST SERVER
            'Host' => 'opac.ibrahimy.ac.id',

            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'Accept' => 'application/json, text/plain, */*',
            'Accept-Language' => 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer' => url('/'),
        ];
    }

    /**
     * Mencatat error ke log maksimal 1 kali per menit agar file log tidak cepat penuh (banjir).
     */
    private function logApiFailure(string $message, array $context = []): void
    {
        try {
            if (Cache::add('pengunjung.api_failure_logged', true, 60)) {
                Log::warning($message, $context);
            }
        } catch (Throwable) {
            Log::warning($message, $context);
        }
    }

    /**
     * Proses utama penarikan data dari API menggunakan cURL Laravel (Http).
     */
    private function fetchFromApi(): ?array
    {
        try {
            $response = Http::timeout(6)
                ->connectTimeout(3)
                ->withHeaders($this->browserHeaders())
                ->withOptions([
                    // Membaca PENGUNJUNG_VERIFY_SSL dari .env (Otomatis False sesuai setingan Anda)
                    'verify' => (bool) config('services.pengunjung.verify_ssl', true),
                    'http_errors' => false,
                ])
                ->get($this->apiUrl());

            if (!$response->successful()) {
                $this->logApiFailure('API pengunjung merespons dengan status gagal.', [
                    'url' => $this->apiUrl(),
                    'status' => $response->status(),
                ]);
                return null;
            }

            $result = $response->json();

            if (!is_array($result) || ($result['status'] ?? null) !== 'success') {
                $this->logApiFailure('API pengunjung mengembalikan format JSON yang tidak dikenali.', [
                    'url' => $this->apiUrl(),
                    'body' => substr((string) $response->body(), 0, 500),
                ]);
                return null;
            }

            return $result['data'] ?? null;

        } catch (Throwable $e) {
            $this->logApiFailure('Gagal terhubung ke API pengunjung.', [
                'url' => $this->apiUrl(),
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Mengambil data jadwal dari lokasi utama perpustakaan.
     */
    private function jadwalUtama(): ?Lokasi
    {
        return Lokasi::where('is_utama', true)->first() ?? Lokasi::first();
    }

    /**
     * Menentukan shift (pagi/siang/malam) yang sedang aktif berdasarkan jadwal jam buka.
     */
    private function currentShift(): ?string
    {
        try {
            return Cache::remember('pengunjung.current_shift', 2, function () {
                return $this->detectCurrentShift() ?? 'closed';
            }) === 'closed' ? null : Cache::get('pengunjung.current_shift');
        } catch (Throwable) {
            return null;
        }
    }

    private function detectCurrentShift(): ?string
    {
        $lokasi = $this->jadwalUtama();
        if (!$lokasi) return null;

        $hari = (int) now()->format('w');
        $sekarang = now()->hour * 60 + now()->minute;

        foreach ($lokasi->jamBuka as $jb) {
            if ((int) $jb->hari !== $hari || $jb->mode !== 'custom' || !$jb->jam_buka || !$jb->jam_tutup) {
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
     * Mencatat total pengunjung sebagai baseline setiap kali pergantian shift.
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
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * Menghitung dan menambahkan informasi pengunjung per-shift ke dalam array hasil.
     */
    private function withShiftInfo(?array $pengunjung): ?array
    {
        if ($pengunjung === null) return null;

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

    /**
     * Tampilan utama yang dirender menggunakan Inertia JS (Vue/React).
     */
    public function publicIndex()
    {
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
            'pengunjung'  => $this->withShiftInfo($this->fetchPengunjung()),
            'beritas'     => Berita::latest('tanggal')->latest()->take(3)->get(),
            'kegiatans'   => $kegiatans,
            'pengumumans' => Pengumuman::latest()->take(3)->get(),
            'hariLiburs'  => HariLibur::where('tanggal', '>=', now()->toDateString())
                                ->orderBy('tanggal')
                                ->take(3)
                                ->get(),
            'lokasiUtama' => $this->jadwalUtama(),
            'kiosk'       => (bool) config('services.pengunjung.kiosk', true),
        ]);
    }

    /**
     * Endpoint API internal (diakses via AJAX/Axios oleh frontend) untuk memperbarui data live.
     */
    public function data()
    {
        return response()->json([
            'status' => 'success',
            'data' => $this->withShiftInfo($this->fetchPengunjung()),
        ]);
    }
}
