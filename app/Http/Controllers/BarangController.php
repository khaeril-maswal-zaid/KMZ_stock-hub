<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Http\Requests\StoreBarangRequest;
use App\Http\Requests\UpdateBarangRequest;
use App\Models\KategoriBarang;
use App\Models\Sales;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $data = [
            'categories' => KategoriBarang::select(['id', 'name'])->orderBy('name', 'asc')->get(),
            'products' => Barang::select(['code', 'name', 'unit', 'quantity', 'price', 'kategori_barang_id'])
                ->orderBy('name', 'asc')
                ->with('category:id,name')
                ->get(),
            'initialSalesmen' => Sales::select('id', 'name', 'code')->orderBy('name', 'asc')->get(),

        ];

        return Inertia::render('products/page', $data);
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
    public function store(StoreBarangRequest $request)
    {
        Barang::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(Barang $barang)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Barang $barang)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangRequest $request, Barang $barang)
    {
        $barang->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barang $barang)
    {
        $barang->delete();
    }

    public function riwayatPemesanan(Barang $barang, Request $request): Response
    {
        $sales = Sales::select('id')->where('code', $request->sales)->first();

        $data = [
            'riwayats'  => Transaksi::select(['id', 'quantity', 'sales_id', 'barang_id', 'unit_price', 'total_price', 'date_transaction'])
                ->where('type', 'Pembelian')
                ->where('barang_id', $barang->id)
                ->where('sales_id', $sales->id)
                ->with([
                    'barang:id,name,code,kategori_barang_id',
                    'barang.category:id,name',
                    'sales'
                ])
                ->latest()
                ->get()
        ];

        return Inertia::render('products/riwayat', $data);
    }
}
