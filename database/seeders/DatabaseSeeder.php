<?php

namespace Database\Seeders;

use App\Models\Barang;
use App\Models\KategoriBarang;
use App\Models\Sales;
use App\Models\Transaksi;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // KategoriBarang::factory(10)->create();
        // Sales::factory(50)->create();
        // Barang::factory(100)->create();
        // Transaksi::factory(500)->create();

        User::firstOrCreate(
            ['email' => 'administrator@cherish.co.id'],
            [
                'name' => 'Administrator',
                'password' => '4dm1n77$',
                'email_verified_at' => now(),
            ]
        );
    }
}
