<?php

namespace Database\Factories;

use App\Models\Barang;
use App\Models\Sales;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaksi>
 */
class TransaksiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Ambil barang acak (pastikan sudah ada di DB saat seeding)
        $barang = Barang::inRandomOrder()->first() ?? Barang::factory()->create();

        // Ambil sales acak (jika ada)
        $sales = Sales::inRandomOrder()->first();

        $quantity = $this->faker->numberBetween(1, 50);
        $unitPrice = $this->faker->randomFloat(2, 1000, 500000);
        $totalPrice = $quantity * $unitPrice;

        return [
            'barang_id' => $barang->id,
            'quantity' => $quantity,
            'type' => $this->faker->randomElement(['Pembelian', 'Penjualan']),
            'sales_id' => $sales?->id,
            'unit_price' => $unitPrice,
            'total_price' => $totalPrice,
            'date_transaction' => $this->faker
                ->dateTimeBetween(now()->startOfYear(), now()->endOfYear())
                ->format('Y-m-d'),
        ];
    }
}
