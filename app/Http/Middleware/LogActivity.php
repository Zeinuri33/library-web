<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogActivity
{
    /**
     * Log mutating requests (POST/PUT/PATCH/DELETE) on the admin panel.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $user = $request->user();

        if ($user
            && in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])
            && ! session()->has('errors')) {
            ActivityLog::create([
                'user_id' => $user->id,
                'method' => $request->method(),
                'path' => $request->path(),
                'deskripsi' => $this->deskripsi($request->method(), $request->path()),
            ]);
        }

        return $response;
    }

    private function deskripsi(string $method, string $path): string
    {
        $aksi = match ($method) {
            'POST' => 'Menambahkan',
            'PUT', 'PATCH' => 'Mengubah',
            'DELETE' => 'Menghapus',
            default => 'Memproses',
        };

        $modul = ucwords(str_replace(['admin/', '-'], ['', ' '], $path));

        return $aksi.' data pada '.$modul;
    }
}
