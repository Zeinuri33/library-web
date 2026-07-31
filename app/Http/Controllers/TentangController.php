<?php

namespace App\Http\Controllers;

use App\Models\Tentang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TentangController extends Controller
{
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

        Tentang::create([
            'nama' => $request->nama,
            'slug' => $request->slug,
            'isi' => $request->isi,
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

        $tentang->update([
            'nama' => $request->nama,
            'slug' => $request->slug,
            'isi' => $request->isi,
        ]);

        return redirect()->route('tentang.index')
            ->with('success', 'Tentang berhasil diperbarui');
    }

    public function show(Tentang $tentang)
    {
        $tentangs = Tentang::select('nama', 'slug')->get();

        return Inertia::render('tentang/show', [
            'tentang' => $tentang,
            'tentangs' => $tentangs,
        ]);
    }

    public function destroy(Tentang $tentang)
    {
        $tentang->delete();

        return redirect()->route('tentang.index')
            ->with('success', 'Tentang berhasil dihapus');
    }
}
