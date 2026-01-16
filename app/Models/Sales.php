<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Sales extends Model
{
    /** @use HasFactory<\Database\Factories\SalesFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'code'
    ];


    protected static function booted()
    {
        static::creating(function ($barang) {
            do {
                $random = strtoupper(Str::random(5)); // 5 huruf/angka acak
                $code = 'SL-' . $random;
            } while (self::where('code', $code)->exists());

            $barang->code = $code;
        });
    }
}
