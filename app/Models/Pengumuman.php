<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Pengumuman extends Model
{
    protected $table = 'pengumuman';

    protected $fillable = ['judul', 'slug', 'isi'];

    protected $appends = ['deskripsi'];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function getDeskripsiAttribute(): string
    {
        return Str::limit(strip_tags((string) $this->isi), 80);
    }
}
