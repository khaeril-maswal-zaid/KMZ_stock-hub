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
    // return Inertia::render('welcome', [
    //     'canRegister' => Features::enabled(Features::registration()),
    // ]);

    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [MorePagesController::class, 'dashboard'])->name('dashboard');

    Route::get('dashboard/reports', [MorePagesController::class, 'laporan'])->name('report');

    Route::get('dashboard/products', [BarangController::class, 'index'])->name('product.index');
    Route::post('dashboardproducts/store', [BarangController::class, 'storeKMZ'])->name('product.store');
    Route::put('dashboard/products/update/{barang:code}', [BarangController::class, 'updateKMZ'])->name('product.update');
    Route::delete('dashboard/products/destroy/{barang:code}', [BarangController::class, 'destroyKMZ'])->name('product.destroy');

    Route::get('dashboard/purchases', [TransaksiController::class, 'pembelian'])->name('transaction.pembelian');
    Route::get('dashboard/sellings', [TransaksiController::class, 'penjualan'])->name('transaction.penjualan');
    Route::post('dashboard/transactions/store', [TransaksiController::class, 'storeKMZ'])->name('transaction.store');
    Route::delete('dashboard/transactions/destroy{transaksi}', [TransaksiController::class, 'destroyKMZ'])->name('transaction.destroy');


    Route::get('dashboard/salesmens', [SalesController::class, 'index'])->name('salesmen.index');
    Route::post('dashboardsalesmens/store', [SalesController::class, 'storeKMZ'])->name('salesmen.store');
    Route::put('dashboard/salesmens/update/{sales:id}', [SalesController::class, 'updateKMZ'])->name('salesmen.update');
    Route::delete('dashboard/salesmens/delete/{sales:id}', [SalesController::class, 'destroyKMZ'])->name('salesmen.destroy');

    Route::get('dashboard/categories', [KategoriBarangController::class, 'index'])->name('categorie.index');
    Route::post('dashboard/categories/store', [KategoriBarangController::class, 'storeKMZ'])->name('categorie.store');
    Route::put('dashboard/categories/update/{kategoriBarang:id}', [KategoriBarangController::class, 'updateKMZ'])->name('categorie.update');
    Route::delete('dashboard/categories/{kategoriBarang:id}', [KategoriBarangController::class, 'destroyKMZ'])->name('categorie.destroy');
});

require __DIR__ . '/settings.php';
