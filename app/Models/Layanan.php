<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Layanan extends Model
{
    protected $table = 'layanan';

    protected $fillable = [
        'nama_layanan',
        'slug',
        'url',
        'deskripsi',
        'jenis_layanan_id',
    ];

    protected $with = ['jenisLayanan'];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function jenisLayanan()
    {
        return $this->belongsTo(JenisLayanan::class);
    }
}
