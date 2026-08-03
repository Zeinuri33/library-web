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
        'is_utama',
    ];

    protected $with = ['jamBuka'];

    protected $appends = ['ringkasan_jam_buka'];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'is_utama' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function jamBuka()
    {
        return $this->hasMany(JamBuka::class)->orderBy('hari')->orderBy('shif');
    }

    public function getRingkasanJamBukaAttribute(): array
    {
        if ($this->jamBuka->isEmpty()) {
            return ['Belum diatur'];
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

        $urutanHari = [6, 0, 1, 2, 3, 4, 5];

        foreach ($urutanHari as $i) {
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

            if ($pola === $prevPola && (($prev + 1) % 7) === $i) {
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

        $ringkasan = array_slice($ranges, 0, 3);

        if (count($ranges) > 3) {
            $ringkasan[] = '…';
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

            if ($jb->mode === 'closed') {
                continue;
            }

            $parts[] = $namaShif[$shif].' '.substr((string) $jb->jam_buka, 0, 5).'–'.substr((string) $jb->jam_tutup, 0, 5);
        }

        if (empty($parts)) {
            return null;
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
