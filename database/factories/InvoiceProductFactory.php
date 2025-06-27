<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InvoiceProduct>
 */
class InvoiceProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_id' => Invoice::inRandomOrder()->first()?->id ?? Invoice::factory(),
            'product_id' => Product::inRandomOrder()->first()?->id ?? Product::factory(),
            'amount' => $this->faker->numberBetween(50000, 500000),
            'quantity' => $this->faker->numberBetween(1, 3),
        ];
    }
}
