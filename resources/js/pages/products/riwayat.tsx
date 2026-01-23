'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDateIna } from '@/lib/date';
import type { Product, Purchase } from '@/lib/types';
import { dashboard } from '@/routes';
import { pembelian, searchPembelian } from '@/routes/transaction';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Package,
    Search,
} from 'lucide-react';
import { useState } from 'react';

interface initialData {
    riwayats: Purchase[];
    barang: Product;
}

export default function HistoriesPage({ riwayats, barang }: initialData) {
    const [currentPage, setCurrentPage] = useState(1);

    const handelSearch = (data: string) => {
        if (data == '') {
            router.get(pembelian.url());
        } else {
            router.get(
                searchPembelian.url(data),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                },
            );
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pembelian',
            href: pembelian().url,
        },
    ];

    const ITEMS_PER_PAGE = 50;
    const totalPages = Math.ceil(riwayats.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = riwayats.slice(startIndex, endIndex);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembelian" />

            {/* Back Button Outside Main Area */}
            <div className="mt-4 pl-4">
                <Link href={String(dashboard.url())}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                </Link>
            </div>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">
                            Riwayat Pembelian Barang
                        </h1>
                        {/* <p className="mt-1 text-muted-foreground">
                            Lihat detail semua pembelian barang dari sales
                            tertentu untuk mengelola stok dengan lebih efisien
                        </p> */}
                    </div>
                </div>

                {/* Product Information Section */}
                {barang && (
                    <div className="rounded-lg border border-border bg-blue-50 p-4 dark:bg-blue-950/20">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                    Informasi Barang
                                </h3>
                                <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Nama Barang
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {barang?.name || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Satuan
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {barang?.unit || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Kategori
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {barang?.category?.name || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search  */}
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari pembelian atau kode..."
                            // value={searchPembelianTerm}
                            onChange={(e) => {
                                handelSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-lg border border-border bg-linear-to-br from-slate-50 to-slate-100/50 shadow-sm dark:from-slate-950/30 dark:to-slate-900/20">
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-linear-to-b from-slate-400 to-slate-500"></div>
                    <div className="p-6">
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    Riwayat Pembelian
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Daftar semua pembelian barang yang telah
                                    dicatat
                                </p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Sales</TableHead>
                                        <TableHead className="text-right">
                                            Jumlah
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Harga Satuan
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Total
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {riwayats.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                                Belum ada data pembelian
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedProducts.map(
                                            (purchase, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-sm">
                                                        {formatDateIna(
                                                            purchase.date_transaction,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {purchase.sales?.name}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {purchase.quantity}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        Rp.
                                                        {' ' +
                                                            purchase.unit_price?.toLocaleString(
                                                                'id-ID',
                                                            )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        Rp.
                                                        {' ' +
                                                            purchase.total_price?.toLocaleString(
                                                                'id-ID',
                                                            )}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {riwayats.length > 0 && (
                            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {startIndex + 1}-{' '}
                                    {Math.min(endIndex, riwayats.length)} dari{' '}
                                    {riwayats.length} barang
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(1, currentPage - 1),
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="gap-2"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Sebelumnya
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1,
                                        ).map((page) => (
                                            <Button
                                                key={page}
                                                variant={
                                                    currentPage === page
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }
                                                className="h-8 w-8 p-0"
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    totalPages,
                                                    currentPage + 1,
                                                ),
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="gap-2"
                                    >
                                        Selanjutnya
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
