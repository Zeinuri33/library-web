<?php

namespace App\Http\Controllers;

use App\Models\JenisLayanan;
use App\Models\Layanan;
use App\Models\Tentang;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LayananController extends Controller
{
    public function index()
    {
        $layanans = Layanan::orderBy('created_at', 'desc')->get();

        return Inertia::render('layanan/page', [
            'layanans' => $layanans,
            'jenisLayanans' => JenisLayanan::orderBy('nama')->get(),
        ]);
    }

    public function publicIndex()
    {
        return Inertia::render('layanan/public', [
            'layanans' => Layanan::orderBy('nama_layanan')->get(),
            'jenisLayanans' => JenisLayanan::orderBy('nama')->get(),
            'tentangs' => Tentang::select('nama', 'slug', 'isi')->get(),
            'activeJenis' => null,
        ]);
    }

    public function publicByJenis(JenisLayanan $jenisLayanan)
    {
        return Inertia::render('layanan/public', [
            'layanans' => Layanan::where('jenis_layanan_id', $jenisLayanan->id)
                ->orderBy('nama_layanan')
                ->get(),
            'jenisLayanans' => JenisLayanan::orderBy('nama')->get(),
            'tentangs' => Tentang::select('nama', 'slug', 'isi')->get(),
            'activeJenis' => $jenisLayanan,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        $layanan = Layanan::create([
            'nama_layanan' => $validated['nama_layanan'],
            'slug' => $validated['slug'],
            'url' => $this->normalizeUrl($validated['url'] ?? null),
            'deskripsi' => $validated['deskripsi'] ?? null,
        ]);

        $this->simpanJenisLayanan($layanan, $validated);

        return redirect()->route('layanan.index')
            ->with('success', 'Layanan berhasil ditambahkan');
    }

    public function update(Request $request, Layanan $layanan)
    {
        $validated = $request->validate($this->rules($layanan));

        $layanan->update([
            'nama_layanan' => $validated['nama_layanan'],
            'slug' => $validated['slug'],
            'url' => $this->normalizeUrl($validated['url'] ?? null),
            'deskripsi' => $validated['deskripsi'] ?? null,
        ]);

        $this->simpanJenisLayanan($layanan, $validated);

        return redirect()->route('layanan.index')
            ->with('success', 'Layanan berhasil diperbarui');
    }

    public function destroy(Layanan $layanan)
    {
        $layanan->delete();

        return redirect()->route('layanan.index')
            ->with('success', 'Layanan berhasil dihapus');
    }

    private function rules(?Layanan $layanan = null): array
    {
        return [
            'nama_layanan' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:layanan,slug,'.$layanan?->id,
            'url' => 'nullable|string|max:500',
            'deskripsi' => 'nullable|string',
            'jenis_layanan_id' => 'required_without:jenis_baru|nullable|exists:jenis_layanan,id',
            'jenis_baru' => 'required_without:jenis_layanan_id|nullable|string|max:255',
            'jenis_baru_deskripsi' => 'nullable|string|max:5000',
        ];
    }

    private function simpanJenisLayanan(Layanan $layanan, array $validated): void
    {
        $jenisLayanan = null;

        if (! empty($validated['jenis_baru'])) {
            $nama = trim($validated['jenis_baru']);

            $jenisLayanan = JenisLayanan::firstOrCreate(
                ['nama' => $nama],
                [
                    'deskripsi' => trim($validated['jenis_baru_deskripsi'] ?? '') ?: null,
                    'slug' => $this->uniqueJenisSlug($nama),
                ],
            );
        } elseif (! empty($validated['jenis_layanan_id'])) {
            $jenisLayanan = JenisLayanan::find($validated['jenis_layanan_id']);
        }

        if ($jenisLayanan) {
            if (empty($jenisLayanan->slug)) {
                $jenisLayanan->slug = $this->uniqueJenisSlug($jenisLayanan->nama);
                $jenisLayanan->save();
            }

            $layanan->jenis_layanan_id = $jenisLayanan->id;
            $layanan->save();
        }
    }

    private function uniqueJenisSlug(string $nama): string
    {
        $base = Str::slug($nama) ?: 'jenis';
        $slug = $base;
        $i = 2;

        while (JenisLayanan::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    private function normalizeUrl(?string $url): ?string
    {
        if ($url === null || trim($url) === '') {
            return null;
        }

        $url = trim($url);

        if (! preg_match('~^https?://~i', $url)) {
            $url = 'https://'.$url;
        }

        return $url;
    }
}
