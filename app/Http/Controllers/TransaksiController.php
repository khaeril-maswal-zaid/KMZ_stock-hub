<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Http\Requests\UpdateTransaksiRequest;
use App\Models\Barang;
use App\Models\KategoriBarang;
use Illuminate\Support\Facades\DB;
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
            ->orderBy('date_transaction', 'desc');

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
            ->orderBy('date_transaction', 'desc');

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
    public function store(Request $request)
    {
        $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.barang_id' => ['required', 'integer', 'exists:barangs,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['nullable', 'integer', 'min:0'],
            'items.*.salesman' => ['nullable', 'integer'],
            'items.*.type' => ['required', 'in:Pembelian,Penjualan'],
            'items.*.date_transaction' => ['required', 'date'],
        ]);

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



    public function storeMassal(Request $request)
    {
        // 1. Validasi
        $validated = $request->validate([
            'type' => ['required', 'in:Pembelian,Penjualan'],

            'items' => ['required', 'array', 'min:1'],

            'items.*.productId'    => ['required', 'integer', 'exists:barangs,id'],
            'items.*.quantity'     => ['required', 'integer', 'min:1'],
            'items.*.unitPrice'    => ['nullable', 'integer', 'min:0'],
            'items.*.salesId'      => ['nullable', 'integer'],
            'items.*.purchaseDate' => ['required', 'date'],
        ]);

        $forCount = [];

        // 2. Gunakan DB transaction (biar aman kalau salah satu gagal)
        DB::beginTransaction();

        try {
            foreach ($validated['items'] as $item) {

                $barang = Barang::lockForUpdate()->findOrFail($item['productId']);

                // Hitung stok baru
                $newQuantity = $barang->quantity + (
                    $validated['type'] === 'Pembelian'
                    ? $item['quantity']
                    : -$item['quantity']
                );

                // Cek stok minus
                if ($newQuantity < 0) {
                    DB::rollBack();
                    return back()->withErrors([
                        'quantity' => "Stok {$barang->nama_barang} tidak mencukupi."
                    ]);
                }

                // Update stok
                $barang->update([
                    'quantity' => $newQuantity
                ]);

                // Simpan transaksi
                $transaksi = Transaksi::create([
                    'barang_id'        => $barang->id,
                    'sales_id'         => $validated['type'] === 'Pembelian' ? $item['salesId'] : null,
                    'quantity'         => $item['quantity'],
                    'unit_price'       => $validated['type'] === 'Pembelian' ? $item['unitPrice'] : null,
                    'total_price'      => $validated['type'] === 'Pembelian'
                        ? $item['quantity'] * $item['unitPrice']
                        : null,
                    'type'             => $validated['type'],
                    'date_transaction' => date('Y-m-d H:i:s', strtotime($item['purchaseDate'])),
                ]);

                $forCount[] = $transaksi->id;
            }

            DB::commit();

            return back()->with(
                'success',
                count($forCount) . ' transaksi ' . $validated['type'] . ' berhasil dicatat.'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors('Terjadi kesalahan: ' . $e->getMessage());
        }
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
