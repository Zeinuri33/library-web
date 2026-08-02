<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LayananJenis extends Model
{
    protected $table = 'layanan_jenis';

    protected $fillable = [
        'layanan_id',
        'nama',
        'urutan',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
