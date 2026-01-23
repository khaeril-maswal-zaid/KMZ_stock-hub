'use client';

import { BulkTransactionDialog } from '@/components/stockhub/bulk-transaction-dialog';
import { DeleteConfirmDialog } from '@/components/stockhub/delete-confirm-dialog';
import { TransactionDialog } from '@/components/stockhub/transaction-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import type { Category, Product, Sale } from '@/lib/types';
import { dashboard } from '@/routes';
import {
    destroy,
    massal,
    penjualan,
    searchPenjualan,
    store,
} from '@/routes/transaction';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Package,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface initialData {
    products: Product[];
    penjualans: Sale[];
    categories: Category[];
}

export default function SalesPage({
    products,
    penjualans,
    categories,
}: initialData) {
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [bulkOpen, setBulkOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handelSearch = (data: string) => {
        if (data == '') {
            router.get(penjualan.url());
        } else {
            router.get(
                searchPenjualan.url(data),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                },
            );
        }
    };

    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        id: Number;
    }>({ open: false, id: 0 });

    const { toast } = useToast();

    const handleAddSale = (
        barang_id: string,
        quantity: number,
        purchaseDate: Date,
    ) => {
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
                type: 'Penjualan',
                date_transaction: purchaseDate,
            };

            router.post(store().url, data, {
                onSuccess: () => {
                    toast({
                        title: 'Berhasil',
                        description: `Penjualan ${quantity} ${product.unit} telah dicatat`,
                    });
                },
                onError: (err) => {
                    toast({
                        title: 'Gagal',
                        description: Object.values(err)[0],
                        variant: 'destructive',
                    });
                },
            });

            setIsDialogOpen(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Terjadi kesalahan',
                variant: 'destructive',
            });
        }
    };

    const handleBulkSale = (items: any[]) => {
        items.forEach((item) => {
            const product = products.find((p) => p.id == item.productId);

            if (!product) return;

            if (item.quantity > product.quantity) {
                toast({
                    title: 'Gagal',
                    description: `Stok ${product.name} tidak cukup`,
                    variant: 'destructive',
                });
            }
        });

        router.post(
            massal().url,
            {
                items,
                type: 'Penjualan',
            },
            {
                onSuccess: (page) => {
                    toast({
                        title: 'Berhasil',
                        description: page.props.flash.success,
                    });
                },
                onError: (err) => {
                    toast({
                        title: 'Gagal',
                        description: Object.values(err)[0],
                        variant: 'destructive',
                    });
                },
            },
        );

        setBulkOpen(false);
    };

    const handleDelete = (id: Number) => {
        setDeleteConfirm({ open: true, id });
    };

    const handleConfirmDelete = () => {
        router.delete(destroy(deleteConfirm.id).url, {
            onSuccess: () => {
                toast({
                    title: 'Berhasil',
                    description: 'Penjualan telah dihapus',
                });
            },
            onError: (err) => {
                console.log(err);
            },
        });

        setDeleteConfirm({ open: false, id: 0 });
    };

    const filteredSales = penjualans.filter((purchase) => {
        if (categoryFilter === 'all') return true;

        return purchase.barang?.kategori_barang_id === Number(categoryFilter);
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
    ];

    const ITEMS_PER_PAGE = 50;
    const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = filteredSales.slice(startIndex, endIndex);

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

                {/* Search  */}
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari pembelian atau kode..."
                            onChange={(e) => {
                                handelSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-gray-50 pl-10"
                        />
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
                                        <TableHead className="text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedProducts.length === 0 ? (
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
                                        paginatedProducts.map((purchase) => (
                                            <TableRow key={purchase.id}>
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
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {filteredSales.length > 0 && (
                            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {startIndex + 1}-
                                    {Math.min(endIndex, filteredSales.length)}{' '}
                                    dari {filteredSales.length} barang
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
                    title="Hapus Penjualan"
                    description="Apakah Anda yakin ingin menghapus penjualan ini? Stok barang tidak terpengaruh."
                    onConfirm={handleConfirmDelete}
                />

                <BulkTransactionDialog
                    open={bulkOpen}
                    onOpenChange={setBulkOpen}
                    products={products}
                    categories={categories}
                    initialSalesmen={[]}
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
                    onSubmit={(
                        productId,
                        quantity,
                        _salesman,
                        _unitPrice,
                        purchaseDate,
                    ) => handleAddSale(productId, quantity, purchaseDate)}
                />
            </div>
        </AppLayout>
    );
}
