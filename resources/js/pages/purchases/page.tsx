'use client';

import type React from 'react';

import { DeleteConfirmDialog } from '@/components/stockhub/delete-confirm-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
    addPurchase,
    deletePurchase,
    getCategories,
    getProducts,
    getPurchases,
} from '@/lib/storage';
import type { Category, Product, Purchase } from '@/lib/types';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Package, Plus, Trash2, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PurchasesPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        unitPrice: '',
    });
    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        id: string;
    }>({ open: false, id: '' });
    const { toast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setProducts(getProducts());
        setPurchases(getPurchases());
        setCategories(getCategories());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.productId || !formData.quantity || !formData.unitPrice) {
            toast({
                title: 'Error',
                description: 'Semua field wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            const quantity = Number.parseInt(formData.quantity);
            const unitPrice = Number.parseFloat(formData.unitPrice);
            const totalPrice = quantity * unitPrice;

            addPurchase({
                productId: formData.productId,
                quantity,
                unitPrice,
                totalPrice,
                purchaseDate: new Date(),
            });

            toast({
                title: 'Berhasil',
                description: 'Pembelian telah dicatat',
            });

            setFormData({ productId: '', quantity: '', unitPrice: '' });
            setOpen(false);
            loadData();
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

    const handleConfirmDelete = () => {
        deletePurchase(deleteConfirm.id);
        toast({
            title: 'Berhasil',
            description: 'Pembelian telah dihapus',
        });
        loadData();
        setDeleteConfirm({ open: false, id: '' });
    };

    const getProductName = (productId: string) => {
        return products.find((p) => p.id === productId)?.name || '-';
    };

    const getProductCode = (productId: string) => {
        return products.find((p) => p.id === productId)?.code || '-';
    };

    const getCategoryName = (categoryId: string) => {
        return categories.find((c) => c.id === categoryId)?.name || '-';
    };

    const getProductCategory = (productId: string) => {
        return products.find((p) => p.id === productId)?.categoryId || '';
    };

    const totalPurchaseValue = purchases.reduce(
        (sum, p) => sum + p.totalPrice,
        0,
    );

    const filteredPurchases = purchases.filter((purchase) => {
        if (categoryFilter === 'all') return true;
        const productCategory = getProductCategory(purchase.productId);
        return productCategory === categoryFilter;
    });

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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Pembelian Barang
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Catat pembelian barang untuk menambah stok
                        </p>
                    </div>
                    <Button onClick={() => setOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Pembelian
                    </Button>
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
                                {purchases.length}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                transaksi pembelian
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
                                Rp{(totalPurchaseValue / 1000000).toFixed(1)}M
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                nilai total
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
                                {products.length}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                produk
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
                                        <TableHead>Tanggal</TableHead>
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
                                        filteredPurchases.map((purchase) => (
                                            <TableRow key={purchase.id}>
                                                <TableCell className="font-mono text-sm">
                                                    {getProductCode(
                                                        purchase.productId,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {getProductName(
                                                        purchase.productId,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {getCategoryName(
                                                        getProductCategory(
                                                            purchase.productId,
                                                        ),
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {purchase.quantity}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    Rp
                                                    {purchase.unitPrice.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    Rp
                                                    {purchase.totalPrice.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {new Date(
                                                        purchase.purchaseDate,
                                                    ).toLocaleDateString(
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
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <DeleteConfirmDialog
                    open={deleteConfirm.open}
                    onOpenChange={(open) =>
                        setDeleteConfirm({ ...deleteConfirm, open })
                    }
                    title="Hapus Pembelian"
                    description="Apakah Anda yakin ingin menghapus pembelian ini? Stok barang akan dikembalikan."
                    onConfirm={handleConfirmDelete}
                />

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Tambah Pembelian</DialogTitle>
                            <DialogDescription>
                                Catat pembelian barang baru untuk menambah stok
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="product">Pilih Barang</Label>
                                <Select
                                    value={formData.productId}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            productId: value,
                                        })
                                    }
                                >
                                    <SelectTrigger id="product">
                                        <SelectValue placeholder="Pilih barang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem
                                                key={product.id}
                                                value={product.id}
                                            >
                                                {product.code} - {product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantity">Jumlah</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    placeholder="0"
                                    value={formData.quantity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            quantity: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unitPrice">
                                    Harga Satuan (Rp)
                                </Label>
                                <Input
                                    id="unitPrice"
                                    type="number"
                                    placeholder="0"
                                    value={formData.unitPrice}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            unitPrice: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="flex-1"
                                >
                                    Batal
                                </Button>
                                <Button type="submit" className="flex-1">
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
