'use client';

import { DeleteConfirmDialog } from '@/components/stockhub/delete-confirm-dialog';
import { ProductDialog } from '@/components/stockhub/product-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { deleteProduct } from '@/lib/storage';
import type { Product } from '@/lib/types';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProductsPage({
    initialCategories,
    initialSalesmen,
}: any) {
    const [products, setProducts] = useState<Product[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState<'all' | 'empty' | 'ready'>(
        'all',
    );
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        id: string;
    }>({ open: false, id: '' });
    const { toast } = useToast();

    useEffect(() => {
        // loadData();
    }, []);

    const handleDelete = (id: string) => {
        setDeleteConfirm({ open: true, id });
    };

    const handleConfirmDelete = () => {
        deleteProduct(deleteConfirm.id);
        // loadData();
        toast({
            title: 'Berhasil',
            description: 'Barang telah dihapus',
        });
        setDeleteConfirm({ open: false, id: '' });
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setEditingProduct(null);
        // loadData();
    };

    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.code.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStockFilter =
            stockFilter === 'all' ||
            (stockFilter === 'empty' && p.quantity === 0) ||
            (stockFilter === 'ready' && p.quantity > 0);

        const matchesCategory =
            categoryFilter === 'all' || p.kategori_barang_id === categoryFilter;

        return matchesSearch && matchesStockFilter && matchesCategory;
    });

    const getCategoryName = (categoryId: string) => {
        return (
            initialCategories.find((c: any) => c.id === categoryId)?.name || '-'
        );
    };

    const getSalesmanName = (salesmanId?: string) => {
        if (!salesmanId) return '-';
        return (
            initialSalesmen.find((s: any) => s.id === salesmanId)?.name || '-'
        );
    };

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
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Manajemen Barang
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Kelola daftar barang dan stok
                        </p>
                    </div>
                    <Button onClick={handleAddNew} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Barang
                    </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari barang atau kode..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                    >
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {initialCategories.map((cat: any) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={stockFilter}
                        onValueChange={(value: any) => setStockFilter(value)}
                    >
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Stok</SelectItem>
                            <SelectItem value="ready">Stok Ready</SelectItem>
                            <SelectItem value="empty">Stok Kosong</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Barang</CardTitle>
                        <CardDescription>
                            {filteredProducts.length} barang
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Kode
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Nama
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Kategori
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Sales
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold">
                                            Harga
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold">
                                            Stok
                                        </th>
                                        <th className="px-4 py-3 text-center font-semibold">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="transition-smooth border-b border-border hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {product.code}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {product.name}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {getCategoryName(
                                                    product.kategori_barang_id,
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {getSalesmanName(
                                                    product.sales_id,
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                Rp{' '}
                                                {product.price.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </td>
                                            <td
                                                className={`px-4 py-3 text-right font-bold ${
                                                    product.quantity === 0
                                                        ? 'text-destructive'
                                                        : product.quantity < 10
                                                          ? 'text-warning'
                                                          : ''
                                                }`}
                                            >
                                                {product.quantity}{' '}
                                                {product.unit}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(product)
                                                        }
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id,
                                                            )
                                                        }
                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredProducts.length === 0 && (
                                <div className="py-8 text-center text-muted-foreground">
                                    Tidak ada barang ditemukan
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <DeleteConfirmDialog
                    open={deleteConfirm.open}
                    onOpenChange={(open) =>
                        setDeleteConfirm({ ...deleteConfirm, open })
                    }
                    title="Hapus Barang"
                    description="Apakah Anda yakin ingin menghapus barang ini? Tindakan ini tidak dapat dibatalkan."
                    onConfirm={handleConfirmDelete}
                />

                <ProductDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    product={editingProduct}
                    onClose={handleDialogClose}
                    initialCategories={initialCategories}
                    initialSalesmen={initialSalesmen}
                />
            </div>
        </AppLayout>
    );
}
