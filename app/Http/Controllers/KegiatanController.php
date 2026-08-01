<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\Lokasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KegiatanController extends Controller
{
    public function index()
    {
        $kegiatans = Kegiatan::orderBy('tanggal', 'desc')->get();
        $lokasis = Lokasi::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('kegiatan/page', [
            'kegiatans' => $kegiatans,
            'lokasis' => $lokasis,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        [$lokasiId, $tempat] = $this->resolveTempat($validated);

        Kegiatan::create([
            'nama' => $validated['nama'],
            'tanggal' => $validated['tanggal'],
            'lokasi_id' => $lokasiId,
            'waktu_mulai' => $validated['waktu_mulai'] ?? null,
            'waktu_selesai' => $validated['waktu_selesai'] ?? null,
            'tempat' => $tempat,
            'deskripsi' => $validated['deskripsi'] ?? null,
        ]);

        return redirect()->route('kegiatan.index')
            ->with('success', 'Kegiatan berhasil ditambahkan');
    }

    public function update(Request $request, Kegiatan $kegiatan)
    {
        $validated = $request->validate($this->rules());

        [$lokasiId, $tempat] = $this->resolveTempat($validated);

        $kegiatan->update([
            'nama' => $validated['nama'],
            'tanggal' => $validated['tanggal'],
            'lokasi_id' => $lokasiId,
            'waktu_mulai' => $validated['waktu_mulai'] ?? null,
            'waktu_selesai' => $validated['waktu_selesai'] ?? null,
            'tempat' => $tempat,
            'deskripsi' => $validated['deskripsi'] ?? null,
        ]);

        return redirect()->route('kegiatan.index')
            ->with('success', 'Kegiatan berhasil diperbarui');
    }

    public function destroy(Kegiatan $kegiatan)
    {
        $kegiatan->delete();

        return redirect()->route('kegiatan.index')
            ->with('success', 'Kegiatan berhasil dihapus');
    }

    private function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'nullable|date_format:H:i',
            'waktu_selesai' => 'nullable|date_format:H:i',
            'lokasi_id' => 'nullable|string',
            'tempat' => 'nullable|string|max:255',
            'deskripsi' => 'nullable|string',
        ];
    }

    private function resolveTempat(array $validated): array
    {
        $lokasiId = $validated['lokasi_id'] ?? null;
        $tempat = $validated['tempat'] ?? null;

        if (is_numeric($lokasiId)) {
            return [(int) $lokasiId, null];
        }

        return [null, $tempat ? trim($tempat) : null];
    }
}
