'use client';

import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';

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
                                    Barang berikut memiliki stok kurang dari 5
                                    unit
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {lowStockProducts.length > 0 ? (
                                lowStockProducts.map((product: any) => (
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
                                ))
                            ) : (
                                <div className="flex items-center justify-between rounded-lg border border-red-100 bg-white/50 p-3 dark:border-red-900/30 dark:bg-black/20">
                                    <span className="font-medium text-foreground">
                                        Tidak ada brang dengan jumlah stock di
                                        bawah 5
                                    </span>
                                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                        ?
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
