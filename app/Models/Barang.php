<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Barang extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'kategori_barang_id',
        'price',
        'quantity',
        'unit',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(KategoriBarang::class, 'kategori_barang_id');
    }

    protected static function booted()
    {
        static::creating(function ($barang) {
            do {
                $randomCode = 'PG-' . strtoupper(Str::random(2)) . '-' . rand(10, 99);
            } while (self::where('code', $randomCode)->exists());

            $barang->code = $randomCode;
        });
    }
}
