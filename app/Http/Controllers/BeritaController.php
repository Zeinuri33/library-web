<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index()
    {
        $beritas = Berita::orderBy('created_at', 'desc')->get();

        return Inertia::render('berita/page', [
            'beritas' => $beritas,
        ]);
    }

    public function create()
    {
        return Inertia::render('berita/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:berita,slug',
            'thumbnail' => 'nullable|string|max:500',
            'isi' => 'required|string',
        ]);

        Berita::create([
            'judul' => $request->judul,
            'slug' => $request->slug,
            'thumbnail' => $request->thumbnail,
            'isi' => $request->isi,
        ]);

        return redirect()->route('berita.index')
            ->with('success', 'Berita berhasil ditambahkan');
    }

    public function edit(Berita $berita)
    {
        return Inertia::render('berita/edit', [
            'berita' => $berita,
        ]);
    }

    public function update(Request $request, Berita $berita)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:berita,slug,'.$berita->id,
            'thumbnail' => 'nullable|string|max:500',
            'isi' => 'required|string',
        ]);

        $berita->update([
            'judul' => $request->judul,
            'slug' => $request->slug,
            'thumbnail' => $request->thumbnail,
            'isi' => $request->isi,
        ]);

        return redirect()->route('berita.index')
            ->with('success', 'Berita berhasil diperbarui');
    }

    public function destroy(Berita $berita)
    {
        $berita->delete();

        return redirect()->route('berita.index')
            ->with('success', 'Berita berhasil dihapus');
    }
}
