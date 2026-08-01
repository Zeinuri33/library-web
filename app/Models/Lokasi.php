<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lokasi extends Model
{
    protected $table = 'lokasis';

    protected $fillable = [
        'nama',
        'slug',
        'alamat',
        'telepon',
        'email',
        'deskripsi',
        'latitude',
        'longitude',
    ];

    protected $with = ['jamBuka'];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function jamBuka()
    {
        return $this->hasMany(JamBuka::class)->orderBy('hari')->orderBy('shif');
    }

    public function getRingkasanJamBukaAttribute(): string
    {
        if ($this->jamBuka->isEmpty()) {
            return 'Belum diatur';
        }

        $namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        $lookup = [];

        foreach ($this->jamBuka as $jb) {
            $lookup[$jb->hari.'-'.$jb->shif] = $jb;
        }

        $ranges = [];
        $start = null;
        $prev = null;
        $prevPola = null;

        for ($i = 0; $i <= 6; $i++) {
            $pola = $this->polaHari($lookup, $i);

            if ($pola === null) {
                if ($start !== null) {
                    $ranges[] = $this->formatRange($start, $prev, $prevPola, $namaHari);
                    $start = null;
                }

                continue;
            }

            if ($start === null) {
                $start = $i;
                $prev = $i;
                $prevPola = $pola;

                continue;
            }

            if ($pola === $prevPola && $i === $prev + 1) {
                $prev = $i;

                continue;
            }

            $ranges[] = $this->formatRange($start, $prev, $prevPola, $namaHari);
            $start = $i;
            $prev = $i;
            $prevPola = $pola;
        }

        if ($start !== null) {
            $ranges[] = $this->formatRange($start, $prev, $prevPola, $namaHari);
        }

        $ringkasan = implode(', ', array_slice($ranges, 0, 3));

        if (count($ranges) > 3) {
            $ringkasan .= ' …';
        }

        return $ringkasan;
    }

    private function polaHari(array $lookup, int $hari): ?string
    {
        $namaShif = ['pagi' => 'Pagi', 'siang' => 'Siang', 'malam' => 'Malam'];
        $parts = [];

        foreach (array_keys($namaShif) as $shif) {
            $jb = $lookup[$hari.'-'.$shif] ?? null;

            if (! $jb) {
                return null;
            }

            $label = match ($jb->mode) {
                'closed' => 'Tutup',
                default => substr((string) $jb->jam_buka, 0, 5).'–'.substr((string) $jb->jam_tutup, 0, 5),
            };

            $parts[] = $namaShif[$shif].' '.$label;
        }

        return implode(', ', $parts);
    }

    private function formatRange(int $start, int $end, string $pola, array $namaHari): string
    {
        if ($start === $end) {
            return $namaHari[$start].': '.$pola;
        }

        return substr($namaHari[$start], 0, 3).'–'.substr($namaHari[$end], 0, 3).': '.$pola;
    }
}
