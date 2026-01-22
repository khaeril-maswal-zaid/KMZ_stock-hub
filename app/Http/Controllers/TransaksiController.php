<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Http\Requests\StoreTransaksiRequest;
use App\Http\Requests\UpdateTransaksiRequest;
use App\Models\Barang;
use App\Models\KategoriBarang;
use App\Models\Sales;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransaksiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function pembelian($query = null): Response
    {
        // Total Barang (jumlah item unik)
        $totalPembelian = Transaksi::where('type', 'Pembelian')->count();

        // Total Pembelian Tahun Ini
        $totalNilaiPembelian = Transaksi::where('type', 'Pembelian')
            ->sum('total_price');

        // Total Stok (akumulasi semua quantity barang)
        $totalBarang = Barang::count();

        $pembelians = Transaksi::select(['id', 'quantity', 'sales_id', 'barang_id', 'unit_price', 'total_price', 'date_transaction'])
            ->with([
                'barang:id,name,code,kategori_barang_id',
                'barang.category:id,name',
                'sales'
            ])
            ->where('type', 'Pembelian')
            ->latest();

        if ($query) {
            $pembelians->whereHas('barang', function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('code', 'like', "%{$query}%");
            });
        }

        $data = [
            'categories' => KategoriBarang::select(['id', 'name'])->orderBy('name', 'asc')->get(),
            'initialSalesmen' => Sales::select('id', 'name')->orderBy('name', 'asc')->get(),
            'products' => Barang::select(['id', 'code', 'name', 'kategori_barang_id', 'quantity', 'unit'])->with('category:id,name')->get(),
            'pembelians' => $pembelians->take(100)->get(),
            'totalPembelian' => $totalPembelian,
            'totalNilaiPembelian' => $totalNilaiPembelian,
            'totalBarang' => $totalBarang,
        ];

        return Inertia::render('purchases/page', $data);
    }

    public function penjualan($query = null): Response
    {
        // Total Barang (jumlah item unik)
        $totalPenjualan = Transaksi::where('type', 'Penjualan')->count();

        $totalNilaiPenjualan = Transaksi::where('type', 'Penjualan')
            ->sum('total_price');

        // Total Pembelian Tahun Ini
        $totalNilaiPembelian = Transaksi::where('type', 'Pembelian')
            ->sum('total_price');

        $penjualans = Transaksi::select(['id', 'quantity', 'barang_id', 'unit_price', 'total_price', 'date_transaction'])
            ->with([
                'barang:id,name,code,kategori_barang_id',
                'barang.category:id,name'
            ])
            ->where('type', 'Penjualan')
            ->latest();

        if ($query) {
            $penjualans->whereHas('barang', function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('code', 'like', "%{$query}%");
            });
        }


        $data = [
            'categories' => KategoriBarang::select(['id', 'name'])->orderBy('name', 'asc')->get(),
            'products' => Barang::select(['id', 'code', 'name', 'kategori_barang_id', 'quantity', 'price', 'unit'])->with('category:id,name')->get(),
            'penjualans'  => $penjualans->take(100)->get(),
            'totalPenjualan' => $totalPenjualan,
            'totalNilaiPenjualan' => $totalNilaiPenjualan,
            'totalKeuntungan' => $totalNilaiPenjualan - $totalNilaiPembelian,
        ];

        return Inertia::render('selling/page', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        foreach ($request->items as $item) {
            $barang = Barang::findOrFail($item['barang_id']);

            $newQuantity = $barang->quantity + ($item['type'] === 'Pembelian'
                ? $item['quantity']
                : -$item['quantity']);

            if ($newQuantity < 0) {
                return back()->withErrors([
                    'quantity' => "Stok tidak cukup untuk {$barang->name}"
                ]);
            }

            $barang->update([
                'quantity' => $newQuantity
            ]);

            Transaksi::create([
                'barang_id' => $barang->id,
                'sales_id' => $item['salesman'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total_price' => $item['quantity'] * $item['unit_price'],
                'type' => $item['type'],
                'date_transaction' => $item['date_transaction'],
            ]);
        }

        return redirect()
            ->route('transaction.pembelian')
            ->with('success', "Berhasil memproses " . count($request->items) . " transaksi.");
    }


    /**
     * Display the specified resource.
     */
    public function show(Transaksi $Transaksi)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaksi $Transaksi)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransaksiRequest $request, Transaksi $Transaksi)
    {
        $Transaksi->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaksi $transaksi)
    {
        $transaksi->delete();
    }
}
