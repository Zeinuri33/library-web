<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Buletin extends Model
{
    protected $table = 'buletin';

    protected $fillable = [
        'edisi',
        'tanggal_terbit',
        'file_pdf',
    ];

    protected $appends = ['pdf_url'];

    protected function casts(): array
    {
        return [
            'tanggal_terbit' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function getPdfUrlAttribute()
    {
        return $this->attributes['file_pdf']
            ? asset('storage/'.$this->attributes['file_pdf'])
            : null;
    }
}
