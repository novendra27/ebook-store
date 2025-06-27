<?php

namespace Database\Factories;

use App\Models\Seller;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Balance>
 */
class BalanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $changeAmount = $this->faker->numberBetween(0, 1000000);
        $balanceAfter = $this->faker->numberBetween(0, 5000000);
        
        return [
            'seller_id' => Seller::inRandomOrder()->first()?->id ?? Seller::factory(),
            'invoice_id' => $this->faker->optional(0.8)->randomElement(
                Invoice::pluck('id')->toArray() ?: [Invoice::factory()->create()->id]
            ),
            'note' => $this->faker->sentence(),
            'change_amount' => $changeAmount,
            'balance_after' => $balanceAfter,
        ];
    }
}
