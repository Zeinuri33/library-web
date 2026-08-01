<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kegiatan extends Model
{
    protected $table = 'kegiatan';

    protected $fillable = [
        'nama',
        'tanggal',
        'lokasi_id',
        'waktu_mulai',
        'waktu_selesai',
        'tempat',
        'deskripsi',
    ];

    protected $appends = ['waktu', 'nama_lokasi'];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
            'lokasi_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class);
    }

    public function getNamaLokasiAttribute(): ?string
    {
        return $this->lokasi?->nama ?? $this->tempat;
    }

    public function getWaktuAttribute(): ?string
    {
        if (! $this->waktu_mulai && ! $this->waktu_selesai) {
            return null;
        }

        $mulai = $this->waktu_mulai ? substr((string) $this->waktu_mulai, 0, 5) : null;
        $selesai = $this->waktu_selesai ? substr((string) $this->waktu_selesai, 0, 5) : null;

        if ($mulai && $selesai) {
            return $mulai.'–'.$selesai;
        }

        return $mulai ?? $selesai;
    }
}
