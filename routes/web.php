<?php

use App\Http\Controllers\BeritaController;
use App\Http\Controllers\BuletinController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HariLiburController;
use App\Http\Controllers\JenisLayananController;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\LayananController;
use App\Http\Controllers\LokasiController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TentangController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'welcome'])->name('home');
Route::get('/tentang/{tentang:slug}', [TentangController::class, 'show'])->name('tentang.show');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('admin')->middleware('log.activity')->group(function () {

        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        /**
         * Users
         */
        Route::get('/users', [UserController::class, 'index'])
            ->middleware('permission:lihat-user')
            ->name('users.index');
        Route::post('/users', [UserController::class, 'store'])
            ->middleware('permission:tambah-user');
        Route::put('/users/{user}', [UserController::class, 'update'])
            ->middleware('permission:edit-user')
            ->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])
            ->middleware('permission:hapus-user')
            ->name('users.destroy');

        /**
         * Roles
         */
        Route::get('/roles', [RoleController::class, 'index'])
            ->middleware('permission:lihat-role');
        Route::post('/roles', [RoleController::class, 'store'])
            ->middleware('permission:tambah-role');
        Route::put('/roles/{role}', [RoleController::class, 'update'])
            ->middleware('permission:edit-role')
            ->name('roles.update');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])
            ->middleware('permission:hapus-role')
            ->name('roles.destroy');

        /**
         * Permissions
         */
        Route::get('/permissions', [PermissionController::class, 'index'])
            ->middleware('permission:lihat-akses');
        Route::post('/permissions', [PermissionController::class, 'store'])
            ->middleware('permission:tambah-akses');
        Route::put('/permissions/{permission}', [PermissionController::class, 'update'])
            ->middleware('permission:edit-akses')
            ->name('permissions.update');
        Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])
            ->middleware('permission:hapus-akses')
            ->name('permissions.destroy');

        /**
         * Tentang
         */
        Route::get('/tentang', [TentangController::class, 'index'])
            ->middleware('permission:lihat-tentang')
            ->name('tentang.index');
        Route::get('/tentang/create', [TentangController::class, 'create'])
            ->middleware('permission:tambah-tentang')
            ->name('tentang.create');
        Route::post('/tentang', [TentangController::class, 'store'])
            ->middleware('permission:tambah-tentang');
        Route::get('/tentang/{tentang}/edit', [TentangController::class, 'edit'])
            ->middleware('permission:edit-tentang')
            ->name('tentang.edit');
        Route::put('/tentang/{tentang}', [TentangController::class, 'update'])
            ->middleware('permission:edit-tentang')
            ->name('tentang.update');
        Route::delete('/tentang/{tentang}', [TentangController::class, 'destroy'])
            ->middleware('permission:hapus-tentang')
            ->name('tentang.destroy');

        /**
         * Lokasi
         */
        Route::get('/lokasi', [LokasiController::class, 'index'])
            ->middleware('permission:lihat-lokasi')
            ->name('lokasi.index');
        Route::get('/lokasi/create', [LokasiController::class, 'create'])
            ->middleware('permission:tambah-lokasi')
            ->name('lokasi.create');
        Route::post('/lokasi', [LokasiController::class, 'store'])
            ->middleware('permission:tambah-lokasi');
        Route::get('/lokasi/{lokasi}/edit', [LokasiController::class, 'edit'])
            ->middleware('permission:edit-lokasi')
            ->name('lokasi.edit');
        Route::put('/lokasi/{lokasi}', [LokasiController::class, 'update'])
            ->middleware('permission:edit-lokasi')
            ->name('lokasi.update');
        Route::delete('/lokasi/{lokasi}', [LokasiController::class, 'destroy'])
            ->middleware('permission:hapus-lokasi')
            ->name('lokasi.destroy');

        /**
         * Hari Libur
         */
        Route::get('/hari-libur', [HariLiburController::class, 'index'])
            ->middleware('permission:lihat-hari-libur')
            ->name('hari-libur.index');
        Route::post('/hari-libur', [HariLiburController::class, 'store'])
            ->middleware('permission:tambah-hari-libur');
        Route::put('/hari-libur/{hari_libur}', [HariLiburController::class, 'update'])
            ->middleware('permission:edit-hari-libur')
            ->name('hari-libur.update');
        Route::delete('/hari-libur/{hari_libur}', [HariLiburController::class, 'destroy'])
            ->middleware('permission:hapus-hari-libur')
            ->name('hari-libur.destroy');

        /**
         * Berita
         */
        Route::get('/berita', [BeritaController::class, 'index'])
            ->middleware('permission:lihat-berita')
            ->name('berita.index');
        Route::get('/berita/create', [BeritaController::class, 'create'])
            ->middleware('permission:tambah-berita')
            ->name('berita.create');
        Route::post('/berita', [BeritaController::class, 'store'])
            ->middleware('permission:tambah-berita');
        Route::get('/berita/{berita}/edit', [BeritaController::class, 'edit'])
            ->middleware('permission:edit-berita')
            ->name('berita.edit');
        Route::put('/berita/{berita}', [BeritaController::class, 'update'])
            ->middleware('permission:edit-berita')
            ->name('berita.update');
        Route::delete('/berita/{berita}', [BeritaController::class, 'destroy'])
            ->middleware('permission:hapus-berita')
            ->name('berita.destroy');

        /**
         * Pengumuman
         */
        Route::get('/pengumuman', [PengumumanController::class, 'index'])
            ->middleware('permission:lihat-pengumuman')
            ->name('pengumuman.index');
        Route::get('/pengumuman/create', [PengumumanController::class, 'create'])
            ->middleware('permission:tambah-pengumuman')
            ->name('pengumuman.create');
        Route::post('/pengumuman', [PengumumanController::class, 'store'])
            ->middleware('permission:tambah-pengumuman');
        Route::get('/pengumuman/{pengumuman}/edit', [PengumumanController::class, 'edit'])
            ->middleware('permission:edit-pengumuman')
            ->name('pengumuman.edit');
        Route::put('/pengumuman/{pengumuman}', [PengumumanController::class, 'update'])
            ->middleware('permission:edit-pengumuman')
            ->name('pengumuman.update');
        Route::delete('/pengumuman/{pengumuman}', [PengumumanController::class, 'destroy'])
            ->middleware('permission:hapus-pengumuman')
            ->name('pengumuman.destroy');

        /**
         * Layanan
         */
        Route::get('/layanan', [LayananController::class, 'index'])
            ->middleware('permission:lihat-layanan')
            ->name('layanan.index');
        Route::post('/layanan', [LayananController::class, 'store'])
            ->middleware('permission:tambah-layanan');
        Route::put('/layanan/{layanan}', [LayananController::class, 'update'])
            ->middleware('permission:edit-layanan')
            ->name('layanan.update');
        Route::delete('/layanan/{layanan}', [LayananController::class, 'destroy'])
            ->middleware('permission:hapus-layanan')
            ->name('layanan.destroy');
        Route::delete('/jenis-layanan/{jenisLayanan}', [JenisLayananController::class, 'destroy'])
            ->middleware('permission:hapus-layanan')
            ->name('jenis-layanan.destroy');

        /**
         * Kegiatan
         */
        Route::get('/kegiatan', [KegiatanController::class, 'index'])
            ->middleware('permission:lihat-kegiatan')
            ->name('kegiatan.index');
        Route::post('/kegiatan', [KegiatanController::class, 'store'])
            ->middleware('permission:tambah-kegiatan');
        Route::put('/kegiatan/{kegiatan}', [KegiatanController::class, 'update'])
            ->middleware('permission:edit-kegiatan')
            ->name('kegiatan.update');
        Route::delete('/kegiatan/{kegiatan}', [KegiatanController::class, 'destroy'])
            ->middleware('permission:hapus-kegiatan')
            ->name('kegiatan.destroy');

        /**
         * Buletin
         */
        Route::get('/buletin', [BuletinController::class, 'index'])
            ->middleware('permission:lihat-buletin')
            ->name('buletin.index');
        Route::post('/buletin', [BuletinController::class, 'store'])
            ->middleware('permission:tambah-buletin');
        Route::put('/buletin/{buletin}', [BuletinController::class, 'update'])
            ->middleware('permission:edit-buletin')
            ->name('buletin.update');
        Route::delete('/buletin/{buletin}', [BuletinController::class, 'destroy'])
            ->middleware('permission:hapus-buletin')
            ->name('buletin.destroy');
    });
});

Route::middleware(['auth'])->group(function () {
    Route::post('/admin/upload-image', [UploadController::class, 'store']);
    Route::match(['delete', 'post'], '/admin/upload-image/delete', [UploadController::class, 'destroy']);
});

require __DIR__.'/settings.php';
