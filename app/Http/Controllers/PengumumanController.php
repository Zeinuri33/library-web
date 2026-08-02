<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\RenamesContentImages;
use App\Models\JenisLayanan;
use App\Models\Pengumuman;
use App\Models\Tentang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengumumanController extends Controller
{
    use RenamesContentImages;

    public function index()
    {
        $pengumumans = Pengumuman::orderBy('created_at', 'desc')->get();

        return Inertia::render('pengumuman/page', [
            'pengumumans' => $pengumumans,
        ]);
    }

    public function publicIndex()
    {
        return Inertia::render('pengumuman/public', [
            'pengumumans' => Pengumuman::orderBy('created_at', 'desc')->get(),
            'tentangs' => Tentang::select('nama', 'slug', 'isi')->get(),
            'jenisLayanans' => JenisLayanan::orderBy('nama')->get(),
        ]);
    }

    public function publicShow(Pengumuman $pengumuman)
    {
        return Inertia::render('pengumuman/show', [
            'pengumuman' => $pengumuman,
            'pengumumanLainnya' => Pengumuman::where('id', '!=', $pengumuman->id)
                ->orderBy('created_at', 'desc')
                ->take(3)
                ->get(),
            'tentangs' => Tentang::select('nama', 'slug', 'isi')->get(),
            'jenisLayanans' => JenisLayanan::orderBy('nama')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('pengumuman/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pengumuman,slug',
            'isi' => 'required|string',
        ]);

        $isi = $this->renameContentImages($request->isi, $request->slug, 'pengumuman');

        Pengumuman::create([
            'judul' => $request->judul,
            'slug' => $request->slug,
            'isi' => $isi,
        ]);

        return redirect()->route('pengumuman.index')
            ->with('success', 'Pengumuman berhasil ditambahkan');
    }

    public function edit(Pengumuman $pengumuman)
    {
        return Inertia::render('pengumuman/edit', [
            'pengumuman' => $pengumuman,
        ]);
    }

    public function update(Request $request, Pengumuman $pengumuman)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pengumuman,slug,'.$pengumuman->id,
            'isi' => 'required|string',
        ]);

        $oldSlug = $pengumuman->slug;
        $newSlug = $request->slug;

        $isi = $this->renameContentImages($request->isi, $newSlug, 'pengumuman');

        $pengumuman->update([
            'judul' => $request->judul,
            'slug' => $newSlug,
            'isi' => $isi,
        ]);

        $this->cleanupOldSlugFiles($oldSlug, $newSlug, 'pengumuman');

        return redirect()->route('pengumuman.index')
            ->with('success', 'Pengumuman berhasil diperbarui');
    }

    public function destroy(Pengumuman $pengumuman)
    {
        $pengumuman->delete();

        $this->deleteSluggedFiles($pengumuman->slug, 'pengumuman');

        return redirect()->route('pengumuman.index')
            ->with('success', 'Pengumuman berhasil dihapus');
    }
}
