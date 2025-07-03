<?php

use App\Http\Controllers\Admin\BalanceController;
use App\Http\Controllers\Admin\DashboardController as SellerDashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\InvoiceController;
use App\Http\Controllers\User\ProductController as UserProductController;
use App\Http\Middleware\EnsureSeller;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// User/Buyer Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('productdetail/{product}', [UserProductController::class, 'show'])->name('products.show');

    // Cart routes
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::get('/cart/list', [CartController::class, 'getCart'])->name('cart.list');
    Route::post('/cart/{id}/cancel', [CartController::class, 'cancel'])->name('cart.cancel');

    // Invoice routes
    Route::get('/invoice', [InvoiceController::class, 'index'])->name('invoice.index');
    Route::post('/invoice/create', [InvoiceController::class, 'store'])->name('invoice.store');
    Route::get('/invoice/{id}', [InvoiceController::class, 'show'])->name('invoice.show');
});

// Admin/Seller Routes
Route::middleware(['auth', EnsureSeller::class])->group(function () {
    Route::get('/seller', [SellerDashboardController::class, 'index'])->name('seller.dashboard');
    
    // Transactions
    Route::resource('seller/transactions', TransactionController::class)
        ->only(['index', 'show'])
        ->names('transactions');
    
    // Balances
    Route::resource('seller/balances', BalanceController::class)
        ->only(['index', 'create', 'store', 'show'])
        ->names('balances');

    // Products
    Route::resource('seller/products', ProductController::class)
        ->names('products');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
