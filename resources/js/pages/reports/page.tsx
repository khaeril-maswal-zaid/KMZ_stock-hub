'use client';

import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import {
    CartesianGrid,
    Legend,
    LineChart,
    Line as RLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function ReportsPage({ chartData, lowStockProducts }: any) {
    const data = chartData.labels.map((label: any, i: any) => ({
        month: label,
        sales: chartData.sales[i],
        purchases: chartData.purchases[i],
    }));

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
                                        5 unit
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {lowStockProducts.map((product: any) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between rounded-lg border border-red-100 bg-white/50 p-3 dark:border-red-900/30 dark:bg-black/20"
                                    >
                                        <span className="font-medium text-foreground">
                                            {product.code}
                                            {' - '}
                                            {product.name}
                                            {' - '}
                                            {product.category?.name}
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
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-purple-500 to-purple-600"></div>
                    <div className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-foreground">
                            Perbandingan Pembelian vs Penjualan
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 40, // tambahkan left margin agar angka Y tidak kepotong
                                    bottom: 0, // beri ruang untuk label miring
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    angle={-45} // miringkan label
                                    textAnchor="end" // biar sejajar rapi ke kanan
                                    interval={0} // tampilkan semua label
                                    height={75} // tambah ruang bawah
                                />

                                <YAxis
                                    tickFormatter={(value) =>
                                        `${value.toLocaleString('id-ID')}`
                                    }
                                />
                                <Tooltip
                                    formatter={(value) =>
                                        `Rp ${value.toLocaleString('id-ID')}`
                                    }
                                />
                                <Legend verticalAlign="bottom" height={36} />
                                <RLine
                                    type="monotone"
                                    dataKey="purchases"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    name="Pembelian"
                                    dot={{ r: 4 }}
                                />
                                <RLine
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    name="Penjualan"
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
