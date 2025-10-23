<?php

use App\Http\Controllers\BarangController;
use App\Http\Controllers\KategoriBarangController;
use App\Http\Controllers\MorePagesController;
use App\Http\Controllers\PembelianController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\SalesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [MorePagesController::class, 'dashboard'])->name('dashboard');

    Route::get('reports', [MorePagesController::class, 'laporan'])->name('report');

    Route::get('products', [BarangController::class, 'index'])->name('product.index');
    Route::post('products/store', [BarangController::class, 'store'])->name('product.store');

    Route::get('purchases', [PembelianController::class, 'index'])->name('purchase.index');

    Route::get('sellings', [PenjualanController::class, 'index'])->name('selling.index');

    Route::get('salesmens', [SalesController::class, 'index'])->name('salesmen.index');

    Route::get('categories', [KategoriBarangController::class, 'index'])->name('categorie.index');
});

require __DIR__ . '/settings.php';
