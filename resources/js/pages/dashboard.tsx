'use client';

import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Boxes,
    Package,
    ShoppingCart,
    TrendingUp,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function Dashboard({
    totalProducts,
    totalStock,
    thisYearSales,
    thisYearPurchases,
    categoryDistribution,
    recentTransactions,
}: any) {
    const COLORS = [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#ec4899',
        '#14b8a6',
        '#f97316',
        '#06b6d4',
        '#84cc16',
    ];

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
                                {totalProducts}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Jenis produk
                            </p>
                        </div>
                    </div>

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
                                {totalStock.toLocaleString('id-ID')}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Unit tersedia
                            </p>
                        </div>
                    </div>

                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-green-50 to-green-100/50 shadow-sm hover:shadow-md dark:from-green-950/30 dark:to-green-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-green-500 to-green-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Penjualan Tahun Ini
                                </h3>
                                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/40">
                                    <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                Rp {(thisYearSales / 1_000_000).toFixed(1)} jt
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Dari penjualan
                            </p>
                        </div>
                    </div>

                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-sm hover:shadow-md dark:from-amber-950/30 dark:to-amber-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-500 to-amber-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Pembelian Tahun Ini
                                </h3>
                                <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/40">
                                    <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                Rp {(thisYearPurchases / 1_000_000).toFixed(1)}{' '}
                                jt
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Dari pembelian
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Category Distribution */}
                    <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-sm dark:from-slate-950/30 dark:to-slate-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600"></div>
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-foreground">
                                Distribusi Transaksi per Kategori
                            </h3>
                            <ResponsiveContainer width="100%" height={450}>
                                <BarChart
                                    data={categoryDistribution.sort(
                                        (a, b) => b.count - a.count,
                                    )} // urut dari besar ke kecil
                                    layout="vertical"
                                    margin={{
                                        top: 10,
                                        right: 15,
                                        left: 15,
                                        bottom: 10,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="var(--border)"
                                    />
                                    <XAxis
                                        type="number"
                                        stroke="var(--muted-foreground)"
                                        tickFormatter={(value) =>
                                            value.toLocaleString('id-ID')
                                        }
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="category"
                                        stroke="var(--muted-foreground)"
                                        width={100}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                'var(--background)',
                                            border: '1px solid var(--border)',
                                        }}
                                        formatter={(value: number) => [
                                            `${value.toLocaleString('id-ID')}`,
                                            'Jumlah Barang',
                                        ]}
                                    />
                                    <Bar
                                        dataKey="count"
                                        radius={[4, 4, 4, 4]}
                                        barSize={18}
                                    >
                                        {categoryDistribution.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            ),
                                        )}
                                        <LabelList
                                            dataKey="count"
                                            position="right"
                                            fill="var(--foreground)"
                                            fontSize={12}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-sm dark:from-slate-950/30 dark:to-slate-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-cyan-500 to-cyan-600"></div>
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-foreground">
                                Transaksi Terbaru (10)
                            </h3>
                            <div className="max-h-100 space-y-3 overflow-y-auto">
                                {recentTransactions.map((tx) => (
                                    <div
                                        key={`${tx.type}-${tx.id}`}
                                        className="transition-smooth flex items-center justify-between rounded-lg border border-border bg-white/50 p-3 hover:border-primary/50 dark:bg-black/20"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`rounded-lg p-2 ${tx.type === 'Penjualan' ? 'bg-green-100 dark:bg-green-900/40' : 'bg-amber-100 dark:bg-amber-900/40'}`}
                                            >
                                                {tx.type === 'Penjualan' ? (
                                                    <ArrowDownLeft
                                                        className={`h-4 w-4 ${tx.type === 'Penjualan' ? 'text-green-600 dark:text-green-400' : ''}`}
                                                    />
                                                ) : (
                                                    <ArrowUpRight
                                                        className={`h-4 w-4 text-amber-600 dark:text-amber-400`}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {tx.barang?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {tx.type === 'Penjualan'
                                                        ? 'Penjualan'
                                                        : 'Pembelian'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-foreground">
                                                Rp{' '}
                                                {tx.total_price.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    tx.date_transaction,
                                                ).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
