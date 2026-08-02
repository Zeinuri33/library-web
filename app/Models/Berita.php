<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Berita extends Model
{
    protected $table = 'berita';

    protected $fillable = ['judul', 'slug', 'thumbnail', 'isi', 'tanggal'];

    protected $appends = ['deskripsi'];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date:Y-m-d',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function getDeskripsiAttribute(): string
    {
        return Str::limit(strip_tags((string) $this->isi), 80);
    }
}
