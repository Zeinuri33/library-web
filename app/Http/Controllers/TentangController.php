<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\RenamesContentImages;
use App\Models\JenisLayanan;
use App\Models\Tentang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TentangController extends Controller
{
    use RenamesContentImages;
    public function index()
    {
        $tentangs = Tentang::orderBy('created_at', 'desc')->get();

        return Inertia::render('tentang/page', [
            'tentangs' => $tentangs,
        ]);
    }

    public function create()
    {
        return Inertia::render('tentang/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'slug' => 'required|string|unique:tentang,slug',
            'isi' => 'required|string',
        ]);

        $isi = $this->renameContentImages($request->isi, $request->slug, 'tentang');

        Tentang::create([
            'nama' => $request->nama,
            'slug' => $request->slug,
            'isi' => $isi,
        ]);

        return redirect()->route('tentang.index')
            ->with('success', 'Tentang berhasil ditambahkan');
    }

    public function edit(Tentang $tentang)
    {
        return Inertia::render('tentang/edit', [
            'tentang' => $tentang,
        ]);
    }

    public function update(Request $request, Tentang $tentang)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'slug' => 'required|string|unique:tentang,slug,' . $tentang->id,
            'isi' => 'required|string',
        ]);

        $oldSlug = $tentang->slug;
        $newSlug = $request->slug;

        $isi = $this->renameContentImages($request->isi, $newSlug, 'tentang');

        $tentang->update([
            'nama' => $request->nama,
            'slug' => $newSlug,
            'isi' => $isi,
        ]);

        $this->cleanupOldSlugFiles($oldSlug, $newSlug, 'tentang');

        return redirect()->route('tentang.index')
            ->with('success', 'Tentang berhasil diperbarui');
    }

    public function show(Tentang $tentang)
    {
        $tentangs = Tentang::select('nama', 'slug', 'isi')->get();

        return Inertia::render('tentang/show', [
            'tentang' => $tentang,
            'tentangs' => $tentangs,
            'jenisLayanans' => JenisLayanan::orderBy('nama')->get(),
        ]);
    }

    public function destroy(Tentang $tentang)
    {
        $slug = $tentang->slug;

        $tentang->delete();

        $this->deleteSluggedFiles($slug, 'tentang');

        return redirect()->route('tentang.index')
            ->with('success', 'Tentang berhasil dihapus');
    }
}
