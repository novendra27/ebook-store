<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ProductDetail;
use App\Models\Seller;
use App\Models\Product;
use App\Models\Cart;
use App\Models\Invoice;
use App\Models\InvoiceProduct;
use App\Models\Balance;
use App\Models\PaymentType;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create users first
        $users = [
            [
                'name' => 'Adi Novendra',
                'email' => 'adi.novendra.p@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'buyer',
            ],
            [
                'name' => 'Seller',
                'email' => 'seller@gmail.com',
                'password' => bcrypt('seller'),
                'role' => 'seller',
            ]
        ];

        foreach ($users as $user) {
            User::create($user);
            if ($user['role'] === 'seller') {
                Seller::factory()->create([
                    'user_id' => User::where('email', $user['email'])->first()->id,
                ]);
            }
        }

        $payments = [
            ['name' => 'Paid Products'],
            ['name' => 'Free Products'],
            ['name' => 'Pay What You Want Products'],
        ];
        
        foreach ($payments as $payment) {
            PaymentType::create($payment);
        }

        // Data Dummy
        ProductDetail::factory()->count(10)->create();
        Product::factory()->count(10)->create();
        Cart::factory()->count(10)->create();
        Invoice::factory()->count(10)->create();
        InvoiceProduct::factory()->count(10)->create();
        Balance::factory()->count(10)->create();
    }
}
