<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {

        // Ambil 8 produk terbaru dari database
        $products = Product::latest()->take(8)->get();

        // Kirim data ke komponen React 'dashboard'
        return Inertia::render('dashboard', [
            'products' => $products
        ]);

        // $products = Product::latest()->get();
        // return Inertia::render('dashboard', ['products' => $products]);
    }

}
