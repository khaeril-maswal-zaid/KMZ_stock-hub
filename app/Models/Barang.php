<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'kategori_barang_id',
        'sales_id',
        'price',
        'quantity',
        'unit',
        'description',
    ];

    public function category()
    {
        return $this->belongsTo(KategoriBarang::class, 'kategori_barang_id');
    }
}
