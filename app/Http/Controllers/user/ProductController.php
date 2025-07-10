<?php

namespace App\Http\Controllers\User;

use App\Models\Product;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Support\Facades\Auth;

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

     public function showPurchased(Product $product)
    {
        $userId = Auth::id();

        // 1. Verifikasi apakah pengguna telah membeli produk ini
        $isPurchased = Invoice::where('user_id', $userId)
            ->where('status', 'paid')
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->exists();

        // 2. Jika belum membeli atau belum lunas, kembalikan ke halaman dashboard
        if (!$isPurchased) {
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki akses ke buku ini.');
        }

        // 3. Jika verifikasi berhasil, muat relasi yang diperlukan
        $product->load(['seller.user', 'productDetail', 'paymentType']);

        // 4. Render halaman detail khusus untuk pembeli
        return Inertia::render('purchased-product', [
            'product' => $product
        ]);
    }


}
