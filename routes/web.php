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
    // Route::get('dashboard', [MorePagesController::class, 'dashboard'])->name('dashboard');

    Route::get('dashboard/reports', [MorePagesController::class, 'laporan'])->name('report');

    Route::get('dashboard', [BarangController::class, 'index'])->name('dashboard');
    Route::post('dashboardproducts/store', [BarangController::class, 'store'])->name('product.store');
    Route::put('dashboard/products/update/{barang:code}', [BarangController::class, 'update'])->name('product.update');
    Route::delete('dashboard/products/destroy/{barang:code}', [BarangController::class, 'destroy'])->name('product.destroy');
    Route::get('dashboard/products/riwayat-pemesanan/sales-barang/{barang:code}', [BarangController::class, 'riwayatPemesanan'])->name('product.riwayat');

    Route::get('dashboard/purchases', [TransaksiController::class, 'pembelian'])->name('transaction.pembelian');
    Route::get('dashboard/purchases/search/{query}', [TransaksiController::class, 'pembelian'])->name('transaction.searchPembelian');
    Route::get('dashboard/sellings', [TransaksiController::class, 'penjualan'])->name('transaction.penjualan');
    Route::get('dashboard/sellings/search/{query}', [TransaksiController::class, 'penjualan'])->name('transaction.searchPenjualan');
    Route::post('dashboard/transactions/store', [TransaksiController::class, 'store'])->name('transaction.store');
    Route::post('dashboard/transactions/store-massal', [TransaksiController::class, 'storeMassal'])->name('transaction.massal');
    Route::delete('dashboard/transactions/destroy{transaksi}', [TransaksiController::class, 'destroy'])->name('transaction.destroy');


    Route::get('dashboard/salesmens', [SalesController::class, 'index'])->name('salesmen.index');
    Route::post('dashboardsalesmens/store', [SalesController::class, 'store'])->name('salesmen.store');
    Route::put('dashboard/salesmens/update/{sales:id}', [SalesController::class, 'update'])->name('salesmen.update');
    Route::delete('dashboard/salesmens/delete/{sales:id}', [SalesController::class, 'destroy'])->name('salesmen.destroy');

    Route::get('dashboard/categories', [KategoriBarangController::class, 'index'])->name('categorie.index');
    Route::post('dashboard/categories/store', [KategoriBarangController::class, 'store'])->name('categorie.store');
    Route::put('dashboard/categories/update/{kategoriBarang:id}', [KategoriBarangController::class, 'update'])->name('categorie.update');
    Route::delete('dashboard/categories/{kategoriBarang:id}', [KategoriBarangController::class, 'destroy'])->name('categorie.destroy');
});

require __DIR__ . '/settings.php';
