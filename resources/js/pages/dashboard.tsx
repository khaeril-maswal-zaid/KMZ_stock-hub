'use client';

import AppLayout from '@/layouts/app-layout';
import { getProducts, getSales, getStatistics } from '@/lib/storage';
import type { Product, Sale } from '@/lib/types';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Boxes,
    Package,
    ShoppingCart,
    TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalStock: 0,
        totalRevenue: 0,
        totalSales: 0,
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);

    useEffect(() => {
        setStats(getStatistics());
        setProducts(getProducts());
        setSales(getSales());
    }, []);

    const lowStockProducts = products.filter((p) => p.quantity < 10);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Selamat datang di StockHub
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Barang Card - Blue Gradient */}
                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm hover:shadow-md dark:from-blue-950/30 dark:to-blue-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Barang
                                </h3>
                                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40">
                                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {stats.totalProducts}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Jenis produk
                            </p>
                        </div>
                    </div>

                    {/* Total Stok Card - Teal Gradient */}
                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-teal-50 to-teal-100/50 shadow-sm hover:shadow-md dark:from-teal-950/30 dark:to-teal-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-teal-500 to-teal-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Stok
                                </h3>
                                <div className="rounded-lg bg-teal-100 p-2 dark:bg-teal-900/40">
                                    <Boxes className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {stats.totalStock}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Unit tersedia
                            </p>
                        </div>
                    </div>

                    {/* Total Penjualan Card - Green Gradient */}
                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-green-50 to-green-100/50 shadow-sm hover:shadow-md dark:from-green-950/30 dark:to-green-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-green-500 to-green-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Penjualan
                                </h3>
                                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/40">
                                    <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {stats.totalSales}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Transaksi
                            </p>
                        </div>
                    </div>

                    {/* Total Pendapatan Card - Amber Gradient */}
                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-sm hover:shadow-md dark:from-amber-950/30 dark:to-amber-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-500 to-amber-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Pendapatan
                                </h3>
                                <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/40">
                                    <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                Rp {(stats.totalRevenue / 1000000).toFixed(1)}M
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Dari penjualan
                            </p>
                        </div>
                    </div>
                </div>

                {lowStockProducts.length > 0 && (
                    <div className="relative overflow-hidden rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 shadow-sm dark:border-red-900/50 dark:from-red-950/30 dark:to-red-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-red-500 to-red-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/40">
                                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-red-900 dark:text-red-200">
                                        Peringatan Stok Rendah
                                    </h3>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        Barang berikut memiliki stok kurang dari
                                        10 unit
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {lowStockProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between rounded-lg border border-red-100 bg-white/50 p-3 dark:border-red-900/30 dark:bg-black/20"
                                    >
                                        <span className="font-medium text-foreground">
                                            {product.name}
                                        </span>
                                        <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                            {product.quantity} {product.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-sm dark:from-slate-950/30 dark:to-slate-900/20">
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-slate-400 to-slate-500"></div>
                    <div className="p-6">
                        <h3 className="mb-2 text-lg font-semibold text-foreground">
                            Penjualan Terbaru
                        </h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            5 transaksi penjualan terakhir
                        </p>
                        <div className="space-y-3">
                            {sales
                                .slice(-5)
                                .reverse()
                                .map((sale) => {
                                    const product = products.find(
                                        (p) => p.id === sale.productId,
                                    );
                                    return (
                                        <div
                                            key={sale.id}
                                            className="transition-smooth flex items-center justify-between rounded-lg border border-border bg-white/50 p-3 hover:border-primary/50 dark:bg-black/20"
                                        >
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {product?.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {sale.quantity}{' '}
                                                    {product?.unit}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-foreground">
                                                    Rp{' '}
                                                    {sale.totalPrice.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        sale.saleDate,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
