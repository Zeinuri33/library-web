<?php

namespace App\Http\Controllers\Traits;

use Illuminate\Support\Facades\Storage;

trait RenamesContentImages
{
    private function renameContentImages(string $html, string $slug, string $folder): string
    {
        $disk = Storage::disk('public');
        $prefix = asset('storage/');

        preg_match_all('/src=["\']([^"\']+)["\']/', $html, $matches);

        foreach (array_unique($matches[1] ?? []) as $src) {
            if (!str_starts_with($src, $prefix)) {
                continue;
            }

            $relative = ltrim(str_replace($prefix, '', $src), '/');

            if (!str_starts_with($relative, $folder . '/') || !$disk->exists($relative)) {
                continue;
            }

            $filename = basename($relative);
            $extension = pathinfo($filename, PATHINFO_EXTENSION) ?: 'png';

            if (preg_match('/^' . preg_quote($slug, '/') . '(\.|\()/', $filename)) {
                continue;
            }

            $newName = $slug . '.' . $extension;
            $counter = 1;

            while ($disk->exists($folder . '/' . $newName)) {
                $newName = $slug . '(' . $counter . ').' . $extension;
                $counter++;
            }

            $newRelative = $folder . '/' . $newName;

            $disk->move($relative, $newRelative);

            $html = str_replace($src, $prefix . '/' . $newRelative, $html);
        }

        return $html;
    }

    private function cleanupOldSlugFiles(string $oldSlug, string $newSlug, string $folder): void
    {
        if ($oldSlug === $newSlug) {
            return;
        }

        $disk = Storage::disk('public');

        foreach ($disk->files($folder) as $file) {
            if (preg_match('/^' . preg_quote($oldSlug, '/') . '(\.|\()/', basename($file))) {
                $disk->delete($file);
            }
        }
    }

    private function deleteSluggedFiles(string $slug, string $folder): void
    {
        $disk = Storage::disk('public');

        foreach ($disk->files($folder) as $file) {
            if (preg_match('/^' . preg_quote($slug, '/') . '(\.|\()/', basename($file))) {
                $disk->delete($file);
            }
        }
    }
}
