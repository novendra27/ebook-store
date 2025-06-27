<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cart>
 */
class CartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'product_id' => Product::inRandomOrder()->first()?->id ?? Product::factory(),
            'quantity' => $this->faker->numberBetween(1, 5),
            'status' => $this->faker->randomElement(['active', 'ordered', 'cancelled']),
        ];
    }
}
