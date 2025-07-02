<?php

use App\Http\Controllers\user\InvoiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/xendit/callback', [InvoiceController::class, 'callbackXendit'])
    ->name('xendit.callback');
