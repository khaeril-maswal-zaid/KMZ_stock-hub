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
            'pembelians' => $pembelians->take(500)->get(),
        ];

        return Inertia::render('purchases/page', $data);
    }

    public function penjualan($query = null): Response
    {
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
            'penjualans'  => $penjualans->take(500)->get(),
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
        $barang = Barang::findOrFail($request->barang_id);

        $newQuantity = $barang->quantity + ($request->type === 'Pembelian' ? $request->quantity : -$request->quantity);

        if ($newQuantity < 0) {
            return back()->withErrors(['quantity' => 'Stok tidak mencukupi untuk transaksi ini.']);
        }

        $barang->update([
            'quantity' => $newQuantity
        ]);

        Transaksi::create([
            'barang_id' => $barang->id,
            'sales_id' => $request->salesman,
            'quantity' => $request->quantity,
            'unit_price' => $request->unit_price,
            'total_price' => $request->quantity * $request->unit_price,
            'type' => $request->type,
            'date_transaction' => date('Y-m-d H:i:s', strtotime($request->date_transaction)),
        ]);
    }

    public function storeMassal(Request $request)
    {
        $forCount = [];
        foreach ($request->items as $key => $value) {
            $barang = Barang::findOrFail($value['productId']);

            $newQuantity = $barang->quantity + ($request->type === 'Pembelian' ? $value['quantity'] : -$value['quantity']);

            if ($newQuantity < 0) {
                return back()->withErrors(['quantity' => 'Stok tidak mencukupi untuk transaksi ini.']);
            }

            $barang->update([
                'quantity' => $newQuantity
            ]);

            $changed = Transaksi::create([
                'barang_id' => $barang->id,
                'sales_id' => $request->type == 'Pembelian' ? $value['salesId'] : null,
                'quantity' => $value['quantity'],
                'unit_price' => $request->type == 'Pembelian' ? $value['unitPrice'] : null,
                'total_price' => $request->type == 'Pembelian' ? $value['quantity'] * $value['unitPrice'] : null,
                'type' => $request->type,
                'date_transaction' => date('Y-m-d H:i:s', strtotime($value['purchaseDate'])),
            ]);

            $forCount[] = $changed->id;
        }

        return back()->with('success',  count($forCount) . ' ' . $request->type . ' massal dicatat.');
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
