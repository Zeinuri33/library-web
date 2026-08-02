<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('UploadController::store called', [
            'has_file' => $request->hasFile('file'),
            'file_name' => $request->file('file')?->getClientOriginalName(),
            'file_size' => $request->file('file')?->getSize(),
            'all_files' => array_keys($request->allFiles()),
            'headers' => $request->headers->all(),
        ]);

        $request->validate([
            'file' => 'required|image|max:5120',
            'folder' => 'sometimes|string|in:berita,tentang,buletin,pengumuman',
            'name' => 'sometimes|nullable|string|max:255',
        ]);

        $folder = $request->input('folder', 'tentang');

        $path = $this->storeFile($request, $folder);

        \Log::info('File stored', ['path' => $path, 'full_path' => storage_path('app/public/' . $path)]);

        return response()->json([
            'url' => asset('storage/' . $path),
        ]);
    }

    private function storeFile(Request $request, string $folder): string
    {
        $file = $request->file('file');
        $name = $request->input('name');

        if ($name === null || trim($name) === '') {
            return $file->store($folder, 'public');
        }

        $base = preg_replace('/[^a-z0-9-]+/i', '-', $name);
        $base = trim($base, '-');

        if ($base === '') {
            return $file->store($folder, 'public');
        }

        $extension = $file->getClientOriginalExtension() ?: 'png';
        $disk = Storage::disk('public');

        $filename = $base . '.' . $extension;
        $counter = 1;

        while ($disk->exists($folder . '/' . $filename)) {
            $filename = $base . '(' . $counter . ').' . $extension;
            $counter++;
        }

        return $file->storeAs($folder, $filename, 'public');
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'url' => 'required|string',
        ]);

        $relative = str_replace(asset('storage/'), '', $request->url);

        if (Storage::disk('public')->exists($relative)) {
            Storage::disk('public')->delete($relative);
        }

        return response()->json(['ok' => true]);
    }
}
