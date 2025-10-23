<?php

namespace Database\Factories;

use App\Models\KategoriBarang;
use App\Models\Sales;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Barang>
 */
class BarangFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper($this->faker->bothify('PRD-###??')),
            'name' => fake()->name(),
            'kategori_barang_id' => KategoriBarang::inRandomOrder()->first()?->id ?? 1,
            'sales_id' => KategoriBarang::inRandomOrder()->first()?->id ?? 1,
            'price' => fake()->randomFloat(2, 10000, 1000000),
            'quantity' => fake()->numberBetween(1, 500),
            'unit' => fake()->randomElement(['pcs', 'box', 'kg', 'liter']),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
