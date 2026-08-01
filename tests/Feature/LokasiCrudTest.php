<?php

namespace Tests\Feature;

use App\Models\Lokasi;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LokasiCrudTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $this->seed(RolePermissionSeeder::class);

        return User::factory()->create(['avatar' => ''])->assignRole('admin');
    }

    private function jamBukaData(): array
    {
        return collect(range(0, 6))->flatMap(fn ($hari) => collect([
            ['shif' => 'pagi', 'jam_buka' => '07:00', 'jam_tutup' => '11:00'],
            ['shif' => 'siang', 'jam_buka' => '13:00', 'jam_tutup' => '17:00'],
            ['shif' => 'malam', 'mode' => 'closed'],
        ])->map(fn ($s) => [
            'hari' => $hari,
            'shif' => $s['shif'],
            'mode' => $s['mode'] ?? 'custom',
            'jam_buka' => $s['jam_buka'] ?? null,
            'jam_tutup' => $s['jam_tutup'] ?? null,
        ]))->values()->toArray();
    }

    public function test_index_requires_permission(): void
    {
        $user = User::factory()->create(['avatar' => '']);
        $this->actingAs($user)->get(route('lokasi.index'))->assertForbidden();
    }

    public function test_admin_can_see_lokasi_index(): void
    {
        $this->actingAs($this->admin())->get(route('lokasi.index'))->assertOk();
    }

    public function test_admin_can_create_lokasi_with_tiga_shif(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->post(route('lokasi.index'), [
            'nama' => 'Perpustakaan Utama',
            'slug' => 'perpustakaan-utama',
            'alamat' => 'Jl. Raya No. 1',
            'jam_buka' => $this->jamBukaData(),
        ])->assertRedirect(route('lokasi.index'));

        $lokasi = Lokasi::where('slug', 'perpustakaan-utama')->first();

        $this->assertNotNull($lokasi);
        $this->assertDatabaseCount('jam_buka', 21);
        $this->assertSame(
            ['Sab–Jum: Pagi 07:00–11:00, Siang 13:00–17:00'],
            $lokasi->ringkasan_jam_buka
        );
    }

    public function test_admin_can_update_lokasi_and_jam_buka(): void
    {
        $admin = $this->admin();
        $lokasi = Lokasi::create(['nama' => 'Awal', 'slug' => 'awal', 'alamat' => 'Jl. A']);

        $data = $this->jamBukaData();

        foreach ($data as $i => $item) {
            if ($item['hari'] === 0 && $item['shif'] === 'pagi') {
                $data[$i] = [
                    'hari' => 0,
                    'shif' => 'pagi',
                    'mode' => 'closed',
                    'jam_buka' => null,
                    'jam_tutup' => null,
                ];
            }
        }

        $this->actingAs($admin)->put(route('lokasi.update', $lokasi), [
            'nama' => 'Diubah',
            'slug' => 'awal',
            'alamat' => 'Jl. B',
            'jam_buka' => $data,
        ])->assertRedirect(route('lokasi.index'));

        $fresh = $lokasi->fresh();

        $this->assertSame('Diubah', $fresh->nama);

        $pagiMinggu = $fresh->jamBuka->first(fn ($jb) => $jb->hari === 0 && $jb->shif === 'pagi');

        $this->assertSame('closed', $pagiMinggu->mode);
        $this->assertNull($pagiMinggu->jam_buka);
    }

    public function test_admin_can_destroy_lokasi(): void
    {
        $admin = $this->admin();
        $lokasi = Lokasi::create(['nama' => 'Hapus', 'slug' => 'hapus', 'alamat' => 'Jl. H']);
        $lokasi->jamBuka()->create([
            'hari' => 1,
            'shif' => 'pagi',
            'mode' => 'custom',
            'jam_buka' => '08:00',
            'jam_tutup' => '16:00',
        ]);

        $this->actingAs($admin)->delete(route('lokasi.destroy', $lokasi))
            ->assertRedirect(route('lokasi.index'));

        $this->assertDatabaseMissing('lokasis', ['id' => $lokasi->id]);
        $this->assertDatabaseMissing('jam_buka', ['lokasi_id' => $lokasi->id]);
    }

    public function test_create_page_returns_default_jam_buka(): void
    {
        $this->actingAs($this->admin())->get(route('lokasi.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('lokasi/create')
                ->has('defaultJamBuka', 21)
            );
    }

    public function test_edit_page_prefills_jam_buka(): void
    {
        $admin = $this->admin();
        $lokasi = Lokasi::create(['nama' => 'Prefill', 'slug' => 'prefill', 'alamat' => 'Jl. P']);
        $lokasi->jamBuka()->create(['hari' => 0, 'shif' => 'pagi', 'mode' => 'closed', 'jam_buka' => null, 'jam_tutup' => null]);
        $lokasi->jamBuka()->create(['hari' => 0, 'shif' => 'siang', 'mode' => 'custom', 'jam_buka' => '16:00:00', 'jam_tutup' => '22:30:00']);

        $this->actingAs($admin)->get(route('lokasi.edit', $lokasi))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('lokasi/edit')
                ->has('jamBuka', 21)
                ->where('jamBuka.0.shif', 'pagi')
                ->where('jamBuka.0.mode', 'closed')
                ->where('jamBuka.1.shif', 'siang')
                ->where('jamBuka.1.jam_buka', '16:00')
                ->where('jamBuka.1.jam_tutup', '22:30')
                ->where('jamBuka.2.shif', 'malam')
            );
    }
}
