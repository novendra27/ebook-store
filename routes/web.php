<?php

use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureSeller;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', EnsureSeller::class])->group(function () {
    Route::get('/seller', function () {
        return Inertia::render('seller/dashboard');
    })->name('seller.dashboard');

    Route::resource(('seller/transactions'), TransactionController::class) 
        ->only(['index', 'show'])
        ->names('transactions');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
