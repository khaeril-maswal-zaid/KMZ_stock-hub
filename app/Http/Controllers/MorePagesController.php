<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\KategoriBarang;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class MorePagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function dashboard(): Response
    {
        $year = Carbon::now()->year;

        // Total Pembelian Tahun Ini
        $totalPembelian = Transaksi::where('type', 'Pembelian')
            ->whereYear('date_transaction', $year)
            ->sum('total_price');

        // Total Penjualan Tahun Ini
        $totalPenjualan = Transaksi::where('type', 'Penjualan')
            ->whereYear('date_transaction', $year)
            ->sum('total_price');

        // Total Stok (akumulasi semua quantity barang)
        $totalStok = Barang::sum('quantity');

        // Total Barang (jumlah item unik)
        $totalBarang = Barang::count();


        // Distribusi Kategori (categoryDistribution)
        $categoryDistribution = KategoriBarang::withCount('barangs')
            ->orderBy('name')
            ->get()
            ->map(fn($item) => [
                'category' => $item->name,
                'count' => $item->barangs_count,
            ]);

        // 10 Transaksi Terbaru (campur pembelian & penjualan)
        $recentTransactions = Transaksi::with(['barang:id,name,code', 'sales:id,name'])
            ->orderByDesc('date_transaction')
            ->orderByDesc('id') // jaga-jaga kalau tanggal sama
            ->take(10)
            ->select([
                'id',
                'barang_id',
                'sales_id',
                'type',
                'quantity',
                'unit_price',
                'total_price',
                'date_transaction',
            ])
            ->get();

        $data = [
            'thisYearPurchases' => $totalPembelian,
            'thisYearSales' => $totalPenjualan,
            'totalStock' => $totalStok,
            'totalProducts' => $totalBarang,
            'categoryDistribution' => $categoryDistribution,
            'recentTransactions' => $recentTransactions,

        ];

        return Inertia::render('dashboard', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function laporan(): Response
    {
        $driver = DB::getDriverName();

        $dateExpression = match ($driver) {
            'sqlite' => "strftime('%Y-%m', date_transaction)",
            'pgsql' => "to_char(date_transaction, 'YYYY-MM')",
            default => "DATE_FORMAT(date_transaction, '%Y-%m')", // MySQL / MariaDB
        };

        $transactions = Transaksi::selectRaw("
            {$dateExpression} as month,
            type,
            SUM(total_price) as total
        ")
            ->where('date_transaction', '>=', now()->subYear())
            ->groupByRaw("{$dateExpression}, type")
            ->orderBy('month')
            ->get();


        $monthKeys = collect(range(0, 11))
            ->map(fn($i) => now()->subMonths(11 - $i)->format('Y-m'));

        $monthLabels = collect(range(0, 11))
            ->map(fn($i) => now()->subMonths(11 - $i)->format('M Y'));

        $salesData = [];
        $purchaseData = [];

        foreach ($monthKeys as $month) {
            $salesData[] = (float) $transactions
                ->where('month', $month)
                ->where('type', 'Penjualan')
                ->sum('total');

            $purchaseData[] = (float) $transactions
                ->where('month', $month)
                ->where('type', 'Pembelian')
                ->sum('total');
        }

        //--------------------------------------------------

        $lowStockProducts =  Barang::select(['code', 'name', 'quantity', 'kategori_barang_id', 'unit', 'id'])
            ->where('quantity', '<', 5)
            ->with('category')
            ->get();


        $data = [
            'chartData' => [
                'labels' => $monthLabels,
                'sales' => $salesData,
                'purchases' => $purchaseData,
            ],
            'lowStockProducts' => $lowStockProducts
        ];

        return Inertia::render('reports/page', $data);
    }
}
