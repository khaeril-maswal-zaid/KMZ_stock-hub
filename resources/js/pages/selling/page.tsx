'use client';

import { BulkTransactionDialog } from '@/components/stockhub/bulk-transaction-dialog';
import { TransactionDialog } from '@/components/stockhub/transaction-dialog';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { formatDateIna } from '@/lib/date';
import { transaction } from '@/lib/storage';
import type {
    Category,
    PaginatedResponse,
    Product,
    Sale,
    Salesman,
} from '@/lib/types';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Package, Plus, ShoppingCart, Trash2, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface initialData {
    products: Product[];
    penjualans: PaginatedResponse<Sale>;
    categories: Category[];
    initialSalesmen: Salesman[];
}

export default function SalesPage({
    products,
    penjualans,
    initialSalesmen,
    categories,
}: initialData) {
    const sales = penjualans.data;
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [bulkOpen, setBulkOpen] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        id: string;
    }>({ open: false, id: '' });

    const { toast } = useToast();

    const handleAddSale = (barang_id: string, quantity: number) => {
        const product = products.find((p: any) => p.id === barang_id);

        if (!product) return;

        if (quantity > product.quantity) {
            toast({
                title: 'Error',
                description: 'Stok tidak cukup',
                variant: 'destructive',
            });
            return;
        }

        try {
            const data = {
                barang_id,
                quantity,
                unit_price: product.price,
                type: 'Penjualan',
            };

            transaction(data);

            setIsDialogOpen(false);
            toast({
                title: 'Berhasil',
                description: `Penjualan ${quantity} ${product.unit} telah dicatat`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Terjadi kesalahan',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = (id: string) => {
        setDeleteConfirm({ open: true, id });
    };

    const getProductCategory = (productId: number) => {
        return (
            products.find((p: any) => p.id === productId)?.kategori_barang_id ||
            ''
        );
    };

    const filteredSales = sales.filter((sale) => {
        if (categoryFilter === 'all') return true;

        const productCategory = getProductCategory(sale.barang_id);
        return productCategory === categoryFilter;
    });

    const totalRevenue = sales.reduce((sum, s) => sum + s.total_price, 0);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
    ];

    const handleBulkSale = (items: any[]) => {
        try {
            items.forEach((item) => {
                const product = products.find((p) => p.id == item.productId);

                if (!product) return;

                if (item.quantity > product.quantity) {
                    throw new Error(`Stok ${product.name} tidak cukup`);
                }

                const data = {
                    barang_id: item.productId,
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                    type: 'Penjualan',
                };

                transaction(data);
            });

            toast({
                title: 'Berhasil',
                description: `${items.length} penjualan massal telah dicatat`,
            });

            setBulkOpen(false);
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Terjadi kesalahan',
                variant: 'destructive',
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Penjualan
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Catat penjualan dan kurangi stok
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setBulkOpen(true)}
                            variant="outline"
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Penjualan Massal
                        </Button>
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Catat Penjualan
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                                {sales.length}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Transaksi
                            </p>
                        </div>
                    </div>

                    {/* Total Pendapatan Card - Emerald Gradient */}
                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-sm hover:shadow-md dark:from-emerald-950/30 dark:to-emerald-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Pendapatan
                                </h3>
                                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                                    <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                Rp {(totalRevenue / 1000000).toFixed(1)}M
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Dari penjualan
                            </p>
                        </div>
                    </div>

                    {/* Rata-rata Transaksi Card - Lime Gradient */}
                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-lime-50 to-lime-100/50 shadow-sm hover:shadow-md dark:from-lime-950/30 dark:to-lime-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-lime-500 to-lime-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Rata-rata Transaksi
                                </h3>
                                <div className="rounded-lg bg-lime-100 p-2 dark:bg-lime-900/40">
                                    <ShoppingCart className="h-5 w-5 text-lime-600 dark:text-lime-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                Rp{' '}
                                {sales.length > 0
                                    ? (
                                          totalRevenue /
                                          sales.length /
                                          1000000
                                      ).toFixed(1)
                                    : 0}
                                M
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Per transaksi
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-sm dark:from-slate-950/30 dark:to-slate-900/20">
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-slate-400 to-slate-500"></div>
                    <div className="p-6">
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    Riwayat Penjualan
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Daftar semua transaksi penjualan
                                </p>
                            </div>
                            <Select
                                value={categoryFilter}
                                onValueChange={setCategoryFilter}
                            >
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Kategori
                                    </SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Kode Barang</TableHead>
                                        <TableHead>Nama Barang</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead className="text-right">
                                            Jumlah
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Harga Satuan
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Total
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSales.length === 0 ? (
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
                                        filteredSales.map((purchase) => (
                                            <TableRow key={purchase.id}>
                                                <TableCell className="text-sm">
                                                    {formatDateIna(
                                                        purchase.created_at,
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {purchase.barang?.code}
                                                </TableCell>
                                                <TableCell>
                                                    {purchase.barang?.name}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {
                                                        purchase.barang
                                                            ?.category?.name
                                                    }
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

                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        // onClick={() =>
                                                        //     handleDelete(
                                                        //         purchase.id,
                                                        //     )
                                                        // }
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <BulkTransactionDialog
                    open={bulkOpen}
                    onOpenChange={setBulkOpen}
                    products={products}
                    categories={categories}
                    initialSalesmen={initialSalesmen}
                    type="sale"
                    onSubmit={handleBulkSale}
                />

                <TransactionDialog
                    initialSalesmen={[]}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    products={products}
                    categories={categories}
                    type="sale"
                    onSubmit={(productId, quantity) =>
                        handleAddSale(productId, quantity)
                    }
                />
            </div>
        </AppLayout>
    );
}
