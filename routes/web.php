<?php

use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

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
});

require __DIR__.'/settings.php';
