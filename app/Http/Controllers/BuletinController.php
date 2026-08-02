<?php

namespace App\Http\Controllers;

use App\Models\Buletin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BuletinController extends Controller
{
    public function index()
    {
        $buletins = Buletin::orderBy('tanggal_terbit', 'desc')->get();

        return Inertia::render('buletin/page', [
            'buletins' => $buletins,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'edisi' => 'required|string|max:255',
            'tanggal_terbit' => 'required|date',
            'file_pdf' => 'required|file|mimes:pdf|max:10240',
        ]);

        $path = $request->file('file_pdf')->store('buletin', 'public');

        Buletin::create([
            'edisi' => $validated['edisi'],
            'tanggal_terbit' => $validated['tanggal_terbit'],
            'file_pdf' => $path,
        ]);

        return redirect()->route('buletin.index')
            ->with('success', 'Buletin berhasil ditambahkan');
    }

    public function update(Request $request, Buletin $buletin)
    {
        $validated = $request->validate([
            'edisi' => 'required|string|max:255',
            'tanggal_terbit' => 'required|date',
            'file_pdf' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        if ($request->hasFile('file_pdf')) {
            if ($buletin->file_pdf && Storage::disk('public')->exists($buletin->file_pdf)) {
                Storage::disk('public')->delete($buletin->file_pdf);
            }

            $path = $request->file('file_pdf')->store('buletin', 'public');
        } else {
            $path = $buletin->file_pdf;
        }

        $buletin->update([
            'edisi' => $validated['edisi'],
            'tanggal_terbit' => $validated['tanggal_terbit'],
            'file_pdf' => $path,
        ]);

        return redirect()->route('buletin.index')
            ->with('success', 'Buletin berhasil diperbarui');
    }

    public function destroy(Buletin $buletin)
    {
        if ($buletin->file_pdf && Storage::disk('public')->exists($buletin->file_pdf)) {
            Storage::disk('public')->delete($buletin->file_pdf);
        }

        $buletin->delete();

        return redirect()->route('buletin.index')
            ->with('success', 'Buletin berhasil dihapus');
    }
}
