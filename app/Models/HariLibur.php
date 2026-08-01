<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HariLibur extends Model
{
    protected $table = 'hari_libur';

    protected $fillable = [
        'nama',
        'tanggal',
        'lokasi_ids',
        'mode',
        'shif',
        'keterangan',
    ];

    protected $appends = ['label_shif', 'label_mode', 'nama_lokasis'];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
            'lokasi_ids' => 'array',
            'shif' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function getNamaLokasisAttribute(): array
    {
        $ids = $this->lokasi_ids ?? [];

        if (empty($ids)) {
            return ['Semua Lokasi'];
        }

        return Lokasi::whereIn('id', $ids)
            ->orderBy('nama')
            ->pluck('nama')
            ->values()
            ->all();
    }

    public function getLabelModeAttribute(): string
    {
        return $this->mode === 'shift' ? 'Per Shift' : 'Full Day';
    }

    public function getLabelShifAttribute(): string
    {
        $map = ['pagi' => 'Pagi', 'siang' => 'Siang', 'malam' => 'Malam'];
        $urutan = ['pagi', 'siang', 'malam'];

        if ($this->mode === 'full') {
            return 'Semua shift';
        }

        $labels = collect($this->shif ?? [])
            ->sortBy(fn ($s) => array_search($s, $urutan))
            ->map(fn ($s) => $map[$s] ?? $s)
            ->values();

        return $labels->isEmpty() ? '—' : $labels->implode(', ');
    }
}
