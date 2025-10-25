<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Http\Requests\StoreTransaksiRequest;
use App\Http\Requests\UpdateTransaksiRequest;
use App\Models\Barang;
use App\Models\KategoriBarang;
use App\Models\Sales;
use Inertia\Inertia;
use Inertia\Response;

class TransaksiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function pembelian(): Response
    {
        $data = [
            'categories' => KategoriBarang::select(['id', 'name'])->orderBy('name', 'asc')->get(),
            'initialSalesmen' => Sales::select('id', 'name')->orderBy('name', 'asc')->get(),
            'products' => Barang::select(['id', 'code', 'name', 'kategori_barang_id', 'quantity', 'unit'])->with('category:id,name')->get(),
            'pembelians' => Transaksi::select(['quantity', 'barang_id', 'unit_price', 'total_price', 'created_at'])
                ->with([
                    'barang:id,name,code,kategori_barang_id',
                    'barang.category:id,name'
                ])
                ->where('type', 'Pembelian')
                ->paginate(1000),
        ];

        return Inertia::render('purchases/page', $data);
    }

    public function penjualan(): Response
    {
        $data = [
            'categories' => KategoriBarang::select(['id', 'name'])->orderBy('name', 'asc')->get(),
            'products' => Barang::select(['id', 'code', 'name', 'kategori_barang_id', 'quantity', 'price', 'unit'])->with('category:id,name')->get(),
            'penjualans' => Transaksi::select(['quantity', 'barang_id', 'unit_price', 'total_price', 'created_at'])
                ->with([
                    'barang:id,name,code,kategori_barang_id',
                    'barang.category:id,name'
                ])
                ->where('type', 'Penjualan')
                ->paginate(1000),
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
    public function store(StoreTransaksiRequest $request)
    {
        $barang = Barang::where('code', $request->barang_id)->firstOrFail();

        if ($request->type == 'Pembelian') {

            $newQuantity = $barang->quantity + $request->quantity;
        } elseif ($request->type == 'Penjualan') {

            $newQuantity = $barang->quantity - $request->quantity;
        } else {
            return back()->withErrors(['type' => 'Tipe barang tidak valid (harus Pembelian atau Penjualan).']);
        }

        if ($newQuantity < 0) {
            return back()->withErrors(['quantity' => 'Stok tidak mencukupi untuk transaksi ini.']);
        }

        $barang->update([
            'quantity' => $newQuantity
        ]);

        $barang->id;

        Transaksi::create([
            'barang_id' => $barang->id,
            'sales_id' => $request->salesman,
            'quantity' => $request->quantity,
            'unit_price' => $request->unit_price,
            'total_price' => $request->quantity * $request->unit_price,
            'type' => $request->type
        ]);
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
    public function destroy(Transaksi $Transaksi)
    {
        $Transaksi->delete();
    }
}
