<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
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
            'amount' => $this->faker->numberBetween(50000, 1000000),
            'status' => $this->faker->randomElement(['pending', 'paid', 'failed']),
            'invoice_code' => 'INV-' . $this->faker->unique()->numerify('######'),
            'invoice_url' => $this->faker->url(),
            'payment_method' => $this->faker->randomElement(['credit_card', 'bank_transfer', 'e_wallet']),
            'payment_channel' => $this->faker->randomElement(['visa', 'mastercard', 'bca', 'mandiri', 'gopay', 'ovo']),
            'paid_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
