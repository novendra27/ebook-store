<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
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
        }
    }
}
