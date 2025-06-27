<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductDetail>
 */
class ProductDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'author' => $this->faker->name(),
            'isbn' => $this->faker->isbn13(),
            'language' => $this->faker->randomElement(['English', 'Indonesian', 'Spanish', 'French']),
            'page' => $this->faker->numberBetween(50, 500),
            'publish_date' => $this->faker->dateTimeBetween('-10 years', 'now'),
        ];
    }
}
