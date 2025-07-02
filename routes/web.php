<?php

use App\Http\Controllers\BalanceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\user\InvoiceController;
use App\Http\Controllers\user\DashboardController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\user\UserProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureSeller;
use App\Models\ProductDetail;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Buyer's Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('productdetail/{product}', [UserProductController::class, 'show'])->name('products.show');

    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::get('/cart/list', [CartController::class, 'getCart'])->name('cart.list');
    Route::post('/cart/{id}/cancel', [CartController::class, 'cancel'])->name('cart.cancel');

    Route::get('/invoice', [InvoiceController::class, 'index'])->name('invoice.index');
    Route::post('/invoice/create', [InvoiceController::class, 'store'])->name('invoice.store');
    Route::get('/invoice/{id}', [InvoiceController::class, 'show'])->name('invoice.show');


});

// Seller's Routes
Route::middleware(['auth', EnsureSeller::class])->group(function () {
    Route::get('/seller', function () {
        return Inertia::render('seller/dashboard');
    })->name('seller.dashboard');
    // Transactions
    Route::resource(('seller/transactions'), TransactionController::class)
        ->only(['index', 'show'])
        ->names('seller.transactions');
    // Balances
    Route::resource(('seller/balances'), BalanceController::class)
        ->only(['index', 'create', 'store', 'show'])
        ->names('seller.balances');

        // Products
    Route::resource('seller/products', ProductController::class)
        ->names('seller.products');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
