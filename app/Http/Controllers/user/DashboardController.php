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
        // Ambil 12 produk terbaru dengan relasi yang diperlukan
        $products = Product::with(['seller.user', 'productDetail', 'paymentType'])
            ->latest()
            ->take(12)
            ->get();

        // Kirim data ke komponen React 'dashboard'
        return Inertia::render('dashboard', [
            'products' => $products
        ]);
    }

}
