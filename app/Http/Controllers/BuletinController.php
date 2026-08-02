<?php

namespace App\Http\Controllers;

use App\Models\Buletin;
use App\Models\JenisLayanan;
use App\Models\Tentang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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

    public function publicIndex()
    {
        return Inertia::render('buletin/public', [
            'buletins' => Buletin::orderBy('tanggal_terbit', 'desc')->get(),
            'tentangs' => Tentang::select('nama', 'slug', 'isi')->get(),
            'jenisLayanans' => JenisLayanan::orderBy('nama')->get(),
        ]);
    }

    public function publicShow(Buletin $buletin)
    {
        return Inertia::render('buletin/show', [
            'buletin' => $buletin,
            'buletinLainnya' => Buletin::where('id', '!=', $buletin->id)
                ->orderBy('tanggal_terbit', 'desc')
                ->take(3)
                ->get(),
            'tentangs' => Tentang::select('nama', 'slug', 'isi')->get(),
            'jenisLayanans' => JenisLayanan::orderBy('nama')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'edisi' => 'required|string|max:255',
            'tanggal_terbit' => 'required|date',
            'file_pdf' => 'required|file|mimes:pdf|max:10240',
        ]);

            $path = $request->file('file_pdf')->storeAs('buletin', $this->buildFileName($request), 'public');

        Buletin::create([
            'edisi' => $validated['edisi'],
            'slug' => $this->uniqueSlug($validated['edisi']),
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

        $path = $request->file('file_pdf')->storeAs('buletin', $this->buildFileName($request), 'public');
        } else {
            $path = $buletin->file_pdf;
        }

        if (empty($buletin->slug)) {
            $buletin->slug = $this->uniqueSlug($validated['edisi']);
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

    private function uniqueSlug(string $edisi): string
    {
        $base = Str::slug($edisi) ?: 'buletin';
        $slug = $base;
        $i = 2;

        while (Buletin::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    private function buildFileName(Request $request): string
    {
        $edisi = preg_replace('/\D/', '', (string) $request->input('edisi')) ?: '0';
        $tanggal = \Carbon\Carbon::parse($request->input('tanggal_terbit'))->format('Y-m-d');
        $extension = $request->file('file_pdf')->getClientOriginalExtension() ?: 'pdf';

        return "edisi-{$edisi}-{$tanggal}.{$extension}";
    }
}
