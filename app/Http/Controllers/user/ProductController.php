<?php

namespace App\Http\Controllers\user;

use App\Models\Product;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    // Method `show` untuk menampilkan satu produk detail
    public function show(Product $product)
    {
        // Eager load relasi yang dibutuhkan
        $product->load('seller.user', 'productDetail');

        return Inertia::render('productdetail', [
            'product' => $product
        ]);
    }
}
