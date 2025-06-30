<?php

use App\Http\Controllers\BalanceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureSeller;
use Inertia\Inertia;

Route::get('/', function () {

    return Inertia::render('welcome');
})->name('home');

// Buyer's Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Seller's Routes
Route::middleware(['auth', EnsureSeller::class])->group(function () {
    Route::get('/seller', function () {
        return Inertia::render('seller/dashboard');
    })->name('seller.dashboard');
    // Transactions
    Route::resource(('seller/transactions'), TransactionController::class) 
        ->only(['index', 'show'])
        ->names('transactions');
    // Balances
    Route::resource(('seller/balances'), BalanceController::class) 
        ->only(['index', 'create', 'store', 'show'])
        ->names('balances');
    
        // Products
    Route::resource('seller/products', ProductController::class) 
        ->names('products');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
