<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\RenamesContentImages;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BeritaController extends Controller
{
    use RenamesContentImages;
    private function finalizeThumbnail(?string $thumbnailUrl, string $slug): ?string
    {
        if (!$thumbnailUrl) {
            return null;
        }

        $relative = str_replace(asset('storage/'), '', $thumbnailUrl);
        $relative = ltrim($relative, '/');

        if (!str_starts_with($relative, 'berita/')) {
            return $thumbnailUrl;
        }

        $disk = Storage::disk('public');

        if (!$disk->exists($relative)) {
            return $thumbnailUrl;
        }

        $target = 'berita/' . $slug . '.' . pathinfo($relative, PATHINFO_EXTENSION);

        if ($relative !== $target) {
            $disk->move($relative, $target);
            $relative = $target;
        }

        return asset('storage/' . $relative);
    }

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
            'tanggal' => 'required|date',
        ]);

        $thumbnailUrl = $this->finalizeThumbnail($request->thumbnail, $request->slug);

        $isi = $this->renameContentImages($request->isi, $request->slug, 'berita');

        Berita::create([
            'judul' => $request->judul,
            'slug' => $request->slug,
            'thumbnail' => $thumbnailUrl,
            'isi' => $isi,
            'tanggal' => $request->tanggal,
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
            'tanggal' => 'required|date',
        ]);

        $oldThumbnail = $berita->thumbnail;
        $oldSlug = $berita->slug;
        $newSlug = $request->slug;

        $thumbnailUrl = $this->finalizeThumbnail($request->thumbnail, $newSlug);

        if ($oldThumbnail && $thumbnailUrl !== $oldThumbnail) {
            $oldRelative = str_replace(asset('storage/'), '', $oldThumbnail);
            $oldRelative = ltrim($oldRelative, '/');

            if (str_starts_with($oldRelative, 'berita/') && Storage::disk('public')->exists($oldRelative)) {
                Storage::disk('public')->delete($oldRelative);
            }
        }

        $isi = $this->renameContentImages($request->isi, $newSlug, 'berita');

        $berita->update([
            'judul' => $request->judul,
            'slug' => $newSlug,
            'thumbnail' => $thumbnailUrl,
            'isi' => $isi,
            'tanggal' => $request->tanggal,
        ]);

        $this->cleanupOldSlugFiles($oldSlug, $newSlug, 'berita');

        return redirect()->route('berita.index')
            ->with('success', 'Berita berhasil diperbarui');
    }

    public function destroy(Berita $berita)
    {
        if ($berita->thumbnail) {
            $relative = str_replace(asset('storage/'), '', $berita->thumbnail);
            $relative = ltrim($relative, '/');

            if (str_starts_with($relative, 'berita/') && Storage::disk('public')->exists($relative)) {
                Storage::disk('public')->delete($relative);
            }
        }

        $berita->delete();

        $this->deleteSluggedFiles($berita->slug, 'berita');

        return redirect()->route('berita.index')
            ->with('success', 'Berita berhasil dihapus');
    }
}
