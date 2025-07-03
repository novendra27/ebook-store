<?php

namespace App\Http\Controllers\User;

use App\Models\Product;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    // Method `show` untuk menampilkan satu produk detail
    public function show(Product $product)
    {
        // Eager load relasi yang dibutuhkan dengan payment type untuk informasi lengkap
        $product->load([
            'seller.user', 
            'productDetail', 
            'paymentType'
        ]);

        return Inertia::render('productdetail', [
            'product' => $product
        ]);
    }
}
