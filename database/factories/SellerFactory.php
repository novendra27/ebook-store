<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Seller>
 */
class SellerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::where('role', 'seller')->inRandomOrder()->first()?->id ?? 
                        User::factory()->create(['role' => 'seller'])->id,
            'business_name' => $this->faker->company(),
            'phone_number' => $this->faker->phoneNumber(),
        ];
    }
}
