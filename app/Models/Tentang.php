<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tentang extends Model
{
    protected $table = 'tentang';

    protected $fillable = ['nama', 'slug', 'isi'];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
