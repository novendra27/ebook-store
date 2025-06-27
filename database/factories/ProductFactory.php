<?php

namespace Database\Factories;

use App\Models\Seller;
use App\Models\PaymentType;
use App\Models\ProductDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = $this->faker->numberBetween(50000, 500000); // 50k - 500k rupiah
        return [
            'seller_id' => Seller::inRandomOrder()->first()?->id ?? Seller::factory(),
            'payment_type_id' => PaymentType::inRandomOrder()->first()?->id ?? PaymentType::factory(),
            'product_detail_id' => ProductDetail::inRandomOrder()->first()?->id,
            'name' => $this->faker->sentence(3),
            'price' => $price,
            'fake_price' => $price + $this->faker->numberBetween(10000, 100000),
            'description' => $this->faker->paragraph(),
            'cover' => 'cover/placeholder.jpg',
            'start_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'end_date' => $this->faker->dateTimeBetween('now', '+6 months'),
            'note' => $this->faker->optional()->sentence(),
            'stock' => $this->faker->numberBetween(0, 100),
            'file_content' => 'file_content/placeholder.pdf',
            'is_download' => $this->faker->boolean(),
            'is_affiliate' => $this->faker->boolean(30), // 30% chance
        ];
    }
}
