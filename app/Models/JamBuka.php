<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JamBuka extends Model
{
    protected $table = 'jam_buka';

    protected $fillable = [
        'lokasi_id',
        'hari',
        'shif',
        'mode',
        'jam_buka',
        'jam_tutup',
    ];

    protected function casts(): array
    {
        return [
            'hari' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class);
    }
}
