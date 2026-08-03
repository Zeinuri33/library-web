<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Berita;
use App\Models\HariLibur;
use App\Models\JenisLayanan;
use App\Models\Kegiatan;
use App\Models\Layanan;
use App\Models\Lokasi;
use App\Models\Pengumuman;
use App\Models\Tentang;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalUsers' => User::count(),
            'totalBerita' => Berita::count(),
            'totalKegiatan' => Kegiatan::count(),
            'totalPengumuman' => Pengumuman::count(),
            'totalHariLibur' => HariLibur::count(),
            'totalLokasi' => Lokasi::count(),
            'totalLayanan' => Layanan::count(),
            'totalTentang' => Tentang::count(),
        ];

        return Inertia::render('dashboard', array_merge($stats, [
            'activityLogs' => ActivityLog::latest()->take(10)->get(),
        ]));
    }

    public function welcome()
    {
        $tentangs = Tentang::select('nama', 'slug', 'isi')->get();

        return Inertia::render('welcome', [
            'tentangs' => $tentangs,
            'jenisLayanans' => JenisLayanan::withCount('layanans')->orderBy('nama')->get(),
            'lokasis' => Lokasi::select('id', 'nama', 'slug', 'alamat', 'is_utama')
                ->orderByDesc('is_utama')
                ->orderByDesc('created_at')
                ->get(),
            'pengumumans' => Pengumuman::orderBy('created_at', 'desc')->take(3)->get(),
            'kegiatans' => Kegiatan::orderBy('tanggal', 'desc')->take(3)->get(),
            'beritas' => Berita::orderBy('tanggal', 'desc')->orderBy('created_at', 'desc')->take(3)->get(),
        ]);
    }
}
