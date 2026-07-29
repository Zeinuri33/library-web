<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:5120',
        ]);

        $path = $request->file('file')->store('tentang', 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
        ]);
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
