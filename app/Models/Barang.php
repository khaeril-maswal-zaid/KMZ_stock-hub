<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;

    protected $fillable = [
        'id',
        'code',
        'name',
        'category_id',
        'salesman_id',
        'price',
        'quantity',
        'unit',
        'description',
    ];
}
