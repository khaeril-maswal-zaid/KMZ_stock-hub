'use client';

import AppLayout from '@/layouts/app-layout';
import { getProducts, getSales, getStockHistory } from '@/lib/storage';
import type { Product, Sale, StockHistory } from '@/lib/types';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Award, Package, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ReportsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [history, setHistory] = useState<StockHistory[]>([]);

    useEffect(() => {
        setProducts(getProducts());
        setSales(getSales());
        setHistory(getStockHistory());
    }, []);

    const getProductName = (productId: string) => {
        return products.find((p) => p.id === productId)?.name || '-';
    };

    const getProductUnit = (productId: string) => {
        return products.find((p) => p.id === productId)?.unit || 'PCS';
    };

    // Calculate statistics
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
    const totalItemsSold = sales.reduce((sum, s) => sum + s.quantity, 0);
    const topProduct = sales
        .reduce((acc, sale) => {
            const existing = acc.find((s) => s.productId === sale.productId);
            if (existing) {
                existing.quantity += sale.quantity;
                existing.revenue += sale.totalPrice;
            } else {
                acc.push({
                    productId: sale.productId,
                    quantity: sale.quantity,
                    revenue: sale.totalPrice,
                });
            }
            return acc;
        }, [] as any[])
        .sort((a, b) => b.revenue - a.revenue)[0];

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
                        Laporan & Analitik
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Ringkasan penjualan dan stok
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Total Pendapatan Card - Rose Gradient */}
                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-rose-50 to-rose-100/50 shadow-sm hover:shadow-md dark:from-rose-950/30 dark:to-rose-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-rose-500 to-rose-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Pendapatan
                                </h3>
                                <div className="rounded-lg bg-rose-100 p-2 dark:bg-rose-900/40">
                                    <TrendingUp className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                Rp {(totalRevenue / 1000000).toFixed(1)}M
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Dari semua penjualan
                            </p>
                        </div>
                    </div>

                    {/* Total Terjual Card - Orange Gradient */}
                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-orange-50 to-orange-100/50 shadow-sm hover:shadow-md dark:from-orange-950/30 dark:to-orange-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-orange-500 to-orange-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Terjual
                                </h3>
                                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/40">
                                    <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {totalItemsSold}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Unit produk
                            </p>
                        </div>
                    </div>

                    {/* Produk Terlaris Card - Violet Gradient */}
                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-violet-50 to-violet-100/50 shadow-sm hover:shadow-md dark:from-violet-950/30 dark:to-violet-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-violet-500 to-violet-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Produk Terlaris
                                </h3>
                                <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/40">
                                    <Award className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {topProduct
                                    ? getProductName(
                                          topProduct.productId,
                                      ).substring(0, 15)
                                    : '-'}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {topProduct
                                    ? `${topProduct.quantity} unit terjual`
                                    : 'Belum ada data'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-sm dark:from-slate-950/30 dark:to-slate-900/20">
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-slate-400 to-slate-500"></div>
                    <div className="p-6">
                        <h3 className="mb-2 text-lg font-semibold text-foreground">
                            Riwayat Stok
                        </h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Perubahan stok barang
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Tanggal
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Barang
                                        </th>
                                        <th className="px-4 py-3 text-center font-semibold">
                                            Tipe
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold">
                                            Jumlah
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Keterangan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history
                                        .slice()
                                        .reverse()
                                        .map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition-smooth border-b border-border hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {new Date(
                                                        item.createdAt,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    {getProductName(
                                                        item.productId,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs font-bold ${
                                                            item.type === 'IN'
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                                        }`}
                                                    >
                                                        {item.type === 'IN'
                                                            ? 'Masuk'
                                                            : 'Keluar'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold">
                                                    {item.quantity}{' '}
                                                    {getProductUnit(
                                                        item.productId,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {item.notes || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {history.length === 0 && (
                                <div className="py-8 text-center text-muted-foreground">
                                    Belum ada riwayat stok
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {sales.length > 0 && (
                    <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-sm dark:from-slate-950/30 dark:to-slate-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-slate-400 to-slate-500"></div>
                        <div className="p-6">
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                Produk Terlaris
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Produk dengan penjualan tertinggi
                            </p>
                            <div className="space-y-3">
                                {sales
                                    .reduce((acc, sale) => {
                                        const existing = acc.find(
                                            (s) =>
                                                s.productId === sale.productId,
                                        );
                                        if (existing) {
                                            existing.quantity += sale.quantity;
                                            existing.revenue += sale.totalPrice;
                                        } else {
                                            acc.push({
                                                productId: sale.productId,
                                                quantity: sale.quantity,
                                                revenue: sale.totalPrice,
                                            });
                                        }
                                        return acc;
                                    }, [] as any[])
                                    .sort((a, b) => b.revenue - a.revenue)
                                    .slice(0, 5)
                                    .map((item, index) => (
                                        <div
                                            key={item.productId}
                                            className="transition-smooth flex items-center justify-between rounded-lg border border-border bg-white/50 p-4 hover:border-primary/50 dark:bg-black/20"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 font-bold text-primary-foreground">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        {getProductName(
                                                            item.productId,
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.quantity} unit
                                                        terjual
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-foreground">
                                                    Rp{' '}
                                                    {(
                                                        item.revenue / 1000000
                                                    ).toFixed(1)}
                                                    M
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
