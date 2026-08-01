<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ======================
        // PERMISSIONS
        // ======================

        $permissions = [
            'lihat-user',
            'tambah-user',
            'edit-user',
            'hapus-user',

            'lihat-role',
            'tambah-role',
            'edit-role',
            'hapus-role',

            'lihat-akses',
            'tambah-akses',
            'edit-akses',
            'hapus-akses',

            'lihat-tentang',
            'tambah-tentang',
            'edit-tentang',
            'hapus-tentang',

            'lihat-lokasi',
            'tambah-lokasi',
            'edit-lokasi',
            'hapus-lokasi',

            'lihat-hari-libur',
            'tambah-hari-libur',
            'edit-hari-libur',
            'hapus-hari-libur',

            'lihat-pengumuman',
            'tambah-pengumuman',
            'edit-pengumuman',
            'hapus-pengumuman',

            'lihat-kegiatan',
            'tambah-kegiatan',
            'edit-kegiatan',
            'hapus-kegiatan',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ======================
        // ROLES
        // ======================

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $user = Role::firstOrCreate(['name' => 'user']);

        // ======================
        // ASSIGN PERMISSIONS
        // ======================

        $admin->syncPermissions($permissions);

        $user->syncPermissions([
            'lihat-user',
        ]);
    }
}
