<?php

namespace App\Http\Controllers;

use App\Models\JamBuka;
use App\Models\JenisLayanan;
use App\Models\Lokasi;
use App\Models\Tentang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LokasiController extends Controller
{
    public function index()
    {
        $lokasis = Lokasi::orderBy('created_at', 'desc')->get();

        return Inertia::render('lokasi/page', [
            'lokasis' => $lokasis,
        ]);
    }

    public function create()
    {
        $default = [
            'pagi' => ['07:00', '11:00'],
            'siang' => ['13:00', '17:00'],
            'malam' => ['20:30', '22:00'],
        ];

        return Inertia::render('lokasi/create', [
            'defaultJamBuka' => collect(range(0, 6))->flatMap(fn ($hari) => collect(['pagi', 'siang', 'malam'])->map(fn ($shif) => [
                'hari' => $hari,
                'shif' => $shif,
                'mode' => 'custom',
                'jam_buka' => $default[$shif][0],
                'jam_tutup' => $default[$shif][1],
            ]))->values(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $isUtama = (bool) ($validated['is_utama'] ?? false);

        $lokasi = Lokasi::create([
            'nama' => $validated['nama'],
            'slug' => $validated['slug'],
            'alamat' => $validated['alamat'],
            'telepon' => $validated['telepon'] ?? null,
            'email' => $validated['email'] ?? null,
            'deskripsi' => $validated['deskripsi'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'is_utama' => $isUtama,
        ]);

        $this->simpanJamBuka($lokasi, $validated['jam_buka']);
        $this->terapkanIsUtama($lokasi, $isUtama);

        return redirect()->route('lokasi.index')
            ->with('success', 'Lokasi berhasil ditambahkan');
    }

    public function publicShow(Lokasi $lokasi)
    {
        return Inertia::render('lokasi/show', [
            'lokasi' => $lokasi,
            'lokasiLainnya' => Lokasi::where('id', '!=', $lokasi->id)
                ->orderByDesc('is_utama')
                ->orderByDesc('created_at')
                ->get(['id', 'nama', 'slug', 'alamat', 'is_utama']),
            'tentangs' => Tentang::select('nama', 'slug', 'isi')->get(),
            'jenisLayanans' => JenisLayanan::orderBy('nama')->get(),
        ]);
    }

    public function edit(Lokasi $lokasi)
    {
        $lookup = [];

        foreach ($lokasi->jamBuka as $jb) {
            $lookup[$jb->hari.'-'.$jb->shif] = $jb;
        }

        $jamBuka = collect(range(0, 6))->flatMap(function ($hari) use ($lookup) {
            return collect(['pagi', 'siang', 'malam'])->map(function ($shif) use ($hari, $lookup) {
                $jb = $lookup[$hari.'-'.$shif] ?? null;

                return [
                    'hari' => $hari,
                    'shif' => $shif,
                    'mode' => $jb?->mode ?? 'custom',
                    'jam_buka' => $jb?->jam_buka ? substr((string) $jb->jam_buka, 0, 5) : null,
                    'jam_tutup' => $jb?->jam_tutup ? substr((string) $jb->jam_tutup, 0, 5) : null,
                ];
            });
        })->values();

        return Inertia::render('lokasi/edit', [
            'lokasi' => $lokasi,
            'jamBuka' => $jamBuka,
        ]);
    }

    public function update(Request $request, Lokasi $lokasi)
    {
        $validated = $request->validate($this->rules($lokasi));
        $isUtama = (bool) ($validated['is_utama'] ?? false);

        $lokasi->update([
            'nama' => $validated['nama'],
            'slug' => $validated['slug'],
            'alamat' => $validated['alamat'],
            'telepon' => $validated['telepon'] ?? null,
            'email' => $validated['email'] ?? null,
            'deskripsi' => $validated['deskripsi'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'is_utama' => $isUtama,
        ]);

        $this->simpanJamBuka($lokasi, $validated['jam_buka']);
        $this->terapkanIsUtama($lokasi, $isUtama);

        return redirect()->route('lokasi.index')
            ->with('success', 'Lokasi berhasil diperbarui');
    }

    public function destroy(Lokasi $lokasi)
    {
        $lokasi->delete();

        return redirect()->route('lokasi.index')
            ->with('success', 'Lokasi berhasil dihapus');
    }

    private function rules(?Lokasi $lokasi = null): array
    {
        return [
            'nama' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:lokasis,slug,'.$lokasi?->id,
            'alamat' => 'required|string|max:255',
            'telepon' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'deskripsi' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_utama' => 'sometimes|boolean',
            'jam_buka' => 'required|array|size:21',
            'jam_buka.*.hari' => 'required|integer|between:0,6',
            'jam_buka.*.shif' => 'required|in:pagi,siang,malam',
            'jam_buka.*.mode' => 'required|in:custom,closed',
            'jam_buka.*.jam_buka' => 'nullable|required_if:jam_buka.*.mode,custom|date_format:H:i',
            'jam_buka.*.jam_tutup' => 'nullable|required_if:jam_buka.*.mode,custom|date_format:H:i',
        ];
    }

    private function terapkanIsUtama(Lokasi $lokasi, bool $isUtama): void
    {
        if (! $isUtama) {
            return;
        }

        Lokasi::where('id', '!=', $lokasi->id)->update(['is_utama' => false]);
    }

    private function simpanJamBuka(Lokasi $lokasi, array $items): void
    {
        foreach ($items as $item) {
            $mode = $item['mode'];
            $kustom = $mode === 'custom';

            JamBuka::updateOrCreate(
                ['lokasi_id' => $lokasi->id, 'hari' => $item['hari'], 'shif' => $item['shif']],
                [
                    'mode' => $mode,
                    'jam_buka' => $kustom ? $item['jam_buka'] : null,
                    'jam_tutup' => $kustom ? $item['jam_tutup'] : null,
                ]
            );
        }
    }
}
