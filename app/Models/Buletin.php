<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Buletin extends Model
{
    protected $table = 'buletin';

    protected $fillable = [
        'edisi',
        'slug',
        'tanggal_terbit',
        'file_pdf',
    ];

    protected $appends = ['pdf_url', 'label_edisi'];

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

    public function getLabelEdisiAttribute(): string
    {
        $edisi = (string) $this->edisi;

        if (trim($edisi) === '') {
            return '';
        }

        return preg_match('/^edisi\s/i', $edisi) ? $edisi : 'Edisi '.$edisi;
    }
}
