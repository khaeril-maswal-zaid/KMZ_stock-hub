'use client';

import { BulkTransactionDialog } from '@/components/stockhub/bulk-transaction-dialog';
import { DeleteConfirmDialog } from '@/components/stockhub/delete-confirm-dialog';
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
import { deletePurchase, transaction } from '@/lib/storage';
import type {
    Category,
    PaginatedResponse,
    Product,
    Purchase,
    Salesman,
} from '@/lib/types';
import { pembelian } from '@/routes/transaction';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Package,
    Plus,
    Trash2,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface initialData {
    products: Product[];
    pembelians: PaginatedResponse<Purchase>;
    initialSalesmen: Salesman[];
    categories: Category[];
    totalPembelian: String;
    totalNilaiPembelian: String;
    totalBarang: String;
}

export default function PurchasesPage({
    products,
    pembelians,
    initialSalesmen,
    categories,
    totalPembelian,
    totalNilaiPembelian,
    totalBarang,
}: initialData) {
    const purchases = pembelians.data;
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [open, setOpen] = useState(false);
    const [bulkOpen, setBulkOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        id: number;
    }>({ open: false, id: 0 });

    const { toast } = useToast();

    const handleSubmit = (
        barang_id: string,
        quantity: number,
        salesman: string,
        unit_price: number,
        date_transaction: Date,
    ) => {
        if (!barang_id || !quantity || !unit_price) {
            toast({
                title: 'Error',
                description: 'Semua field wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            const data = {
                barang_id,
                quantity,
                unit_price: unit_price,
                type: 'Pembelian',
                salesman,
                date_transaction,
            };

            transaction(data);

            toast({
                title: 'Berhasil',
                description: 'Pembelian telah dicatat',
            });

            setOpen(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Terjadi kesalahan',
                variant: 'destructive',
            });
        }
    };

    const handleBulkPurchase = (items: any[]) => {
        try {
            items.forEach((item) => {
                const data = {
                    barang_id: item.productId,
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                    salesman: item.salesId,
                    type: 'Pembelian',
                    date_transaction: item.purchaseDate,
                };

                transaction(data);
            });

            toast({
                title: 'Berhasil',
                description: `${items.length} pembelian massal telah dicatat`,
            });

            setBulkOpen(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Terjadi kesalahan',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = (id: number) => {
        setDeleteConfirm({ open: true, id });
    };

    const handleConfirmDelete = () => {
        deletePurchase(deleteConfirm.id);
        toast({
            title: 'Berhasil',
            description: 'Pembelian telah dihapus',
        });
        setDeleteConfirm({ open: false, id: 0 });
    };

    const getProductCategory = (barang_id: number) => {
        return (
            products.find((p: any) => p.id === barang_id)?.kategori_barang_id ||
            ''
        );
    };

    const filteredPurchases = purchases.filter((purchase) => {
        if (categoryFilter === 'all') return true;

        const productCategory = getProductCategory(purchase.barang_id);
        return productCategory === categoryFilter;
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pembelian',
            href: pembelian().url,
        },
    ];

    const ITEMS_PER_PAGE = 20;
    const totalPages = Math.ceil(filteredPurchases.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = filteredPurchases.slice(startIndex, endIndex);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembelian" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Pembelian Barang
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Catat pembelian barang untuk menambah stok
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setBulkOpen(true)}
                            variant="outline"
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Pembelian Massal
                        </Button>
                        <Button onClick={() => setOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Pembelian
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Total Pembelian Card - Purple Gradient */}
                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-sm hover:shadow-md dark:from-purple-950/30 dark:to-purple-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-purple-500 to-purple-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Pembelian
                                </h3>
                                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/40">
                                    <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {totalPembelian}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Transaksi pembelian
                            </p>
                        </div>
                    </div>

                    {/* Total Nilai Pembelian Card - Indigo Gradient */}
                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-indigo-50 to-indigo-100/50 shadow-sm hover:shadow-md dark:from-indigo-950/30 dark:to-indigo-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-indigo-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Nilai Pembelian
                                </h3>
                                <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/40">
                                    <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                Rp.{' '}
                                {(totalNilaiPembelian / 1_000_000).toFixed(1)}{' '}
                                jt
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Nilai total
                            </p>
                        </div>
                    </div>

                    {/* Barang Tersedia Card - Cyan Gradient */}
                    <div className="transition-smooth relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-cyan-50 to-cyan-100/50 shadow-sm hover:shadow-md dark:from-cyan-950/30 dark:to-cyan-900/20">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-cyan-500 to-cyan-600"></div>
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Barang Tersedia
                                </h3>
                                <div className="rounded-lg bg-cyan-100 p-2 dark:bg-cyan-900/40">
                                    <Package className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {totalBarang}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Produk
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
                                    Riwayat Pembelian
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Daftar semua pembelian barang yang telah
                                    dicatat
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
                                        <SelectItem
                                            key={cat.id}
                                            value={String(cat.id)}
                                        >
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
                                    {filteredPurchases.length === 0 ? (
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
                                                            onClick={() =>
                                                                handleDelete(
                                                                    purchase.id,
                                                                )
                                                            }
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {filteredPurchases.length > 0 && (
                            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {startIndex + 1}-
                                    {Math.min(
                                        endIndex,
                                        filteredPurchases.length,
                                    )}{' '}
                                    dari {filteredPurchases.length} barang
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

                <DeleteConfirmDialog
                    open={deleteConfirm.open}
                    onOpenChange={(open) =>
                        setDeleteConfirm({ ...deleteConfirm, open })
                    }
                    title="Hapus Pembelian"
                    description="Apakah Anda yakin ingin menghapus pembelian ini? Stok barang tidak terpengaruh."
                    onConfirm={handleConfirmDelete}
                />

                <BulkTransactionDialog
                    open={bulkOpen}
                    onOpenChange={setBulkOpen}
                    products={products}
                    initialSalesmen={initialSalesmen}
                    type="purchase"
                    categories={categories}
                    onSubmit={handleBulkPurchase}
                />

                <TransactionDialog
                    open={open}
                    onOpenChange={setOpen}
                    products={products}
                    categories={categories}
                    type="purchase"
                    initialSalesmen={initialSalesmen}
                    onSubmit={handleSubmit}
                />
            </div>
        </AppLayout>
    );
}
