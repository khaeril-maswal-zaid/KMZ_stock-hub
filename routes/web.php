<?php

use App\Http\Controllers\BarangController;
use App\Http\Controllers\KategoriBarangController;
use App\Http\Controllers\MorePagesController;
use App\Http\Controllers\PembelianController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\TransaksiController;
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

    Route::get('transactions', [TransaksiController::class, 'pembelian'])->name('transaction.pembelian');
    Route::get('sellings', [TransaksiController::class, 'penjualan'])->name('transaction.penjualan');
    Route::post('transactions/store', [TransaksiController::class, 'store'])->name('transaction.store');

    // Route::get('sellings', [PenjualanController::class, 'index'])->name('selling.index');

    Route::get('salesmens', [SalesController::class, 'index'])->name('salesmen.index');
    Route::post('salesmens/store', [SalesController::class, 'store'])->name('salesmen.store');
    Route::put('salesmens/update/{sales:id}', [SalesController::class, 'update'])->name('salesmen.update');
    Route::delete('salesmens/delete/{sales:id}', [SalesController::class, 'destroy'])->name('salesmen.destroy');

    Route::get('categories', [KategoriBarangController::class, 'index'])->name('categorie.index');
    Route::post('categories/store', [KategoriBarangController::class, 'store'])->name('categorie.store');
    Route::put('categories/update/{kategoriBarang:id}', [KategoriBarangController::class, 'update'])->name('categorie.update');
    Route::delete('categories/{kategoriBarang:id}', [KategoriBarangController::class, 'destroy'])->name('categorie.destroy');
});

require __DIR__ . '/settings.php';
