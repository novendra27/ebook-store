<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserProductController extends Controller
{
    public function show(Product $product)
    {
        $product->load('seller.user', 'productDetail');

        return Inertia::render('productdetail', [
            'product' => $product
        ]);
    }
}
