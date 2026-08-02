<?php

namespace App\Http\Controllers;

use App\Models\JenisLayanan;

class JenisLayananController extends Controller
{
    public function destroy(JenisLayanan $jenisLayanan)
    {
        $jenisLayanan->delete();

        return redirect()->route('layanan.index')
            ->with('success', 'Jenis layanan berhasil dihapus');
    }
}
