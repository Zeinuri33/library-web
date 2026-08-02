<?php

namespace App\Http\Controllers;

use App\Models\HariLibur;
use App\Models\JenisLayanan;
use App\Models\Lokasi;
use App\Models\Tentang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HariLiburController extends Controller
{
    public function index()
    {
        $hariLiburs = HariLibur::orderBy('tanggal', 'desc')->get();
        $lokasis = Lokasi::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('hari-libur/page', [
            'hariLiburs' => $hariLiburs,
            'lokasis' => $lokasis,
        ]);
    }

    public function publicIndex()
    {
        return Inertia::render('hari-libur/public', [
            'hariLiburs' => HariLibur::orderBy('tanggal', 'desc')->get(),
            'tentangs' => Tentang::select('nama', 'slug', 'isi')->get(),
            'jenisLayanans' => JenisLayanan::orderBy('nama')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        HariLibur::create([
            'nama' => $validated['nama'],
            'tanggal' => $validated['tanggal'],
            'lokasi_ids' => empty($validated['lokasi_ids']) ? null : $validated['lokasi_ids'],
            'mode' => $validated['mode'],
            'shif' => $validated['mode'] === 'shift' ? $validated['shif'] : null,
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        return redirect()->route('hari-libur.index')
            ->with('success', 'Hari libur berhasil ditambahkan');
    }

    public function update(Request $request, HariLibur $hariLibur)
    {
        $validated = $request->validate($this->rules());

        $hariLibur->update([
            'nama' => $validated['nama'],
            'tanggal' => $validated['tanggal'],
            'lokasi_ids' => empty($validated['lokasi_ids']) ? null : $validated['lokasi_ids'],
            'mode' => $validated['mode'],
            'shif' => $validated['mode'] === 'shift' ? $validated['shif'] : null,
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        return redirect()->route('hari-libur.index')
            ->with('success', 'Hari libur berhasil diperbarui');
    }

    public function destroy(HariLibur $hariLibur)
    {
        $hariLibur->delete();

        return redirect()->route('hari-libur.index')
            ->with('success', 'Hari libur berhasil dihapus');
    }

    private function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'lokasi_ids' => 'nullable|array',
            'lokasi_ids.*' => 'integer|exists:lokasis,id',
            'mode' => 'required|in:full,shift',
            'shif' => 'nullable|required_if:mode,shift|array|min:1',
            'shif.*' => 'required|in:pagi,siang,malam',
            'keterangan' => 'nullable|string|max:255',
        ];
    }
}
