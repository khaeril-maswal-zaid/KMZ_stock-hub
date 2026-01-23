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
import type { Category, Product, Salesman } from '@/lib/types';
import { index } from '@/routes/categorie';
import { destroy, riwayat } from '@/routes/product';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Edit2,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface initialData {
    initialCategories: Category[];
    products: Product[];
    categories: Category[];
    initialSalesmen: Salesman[];
}

export default function ProductsPage({
    products,
    categories,
    initialSalesmen,
}: initialData) {
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState<'all' | 'empty' | 'ready'>(
        'all',
    );
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        code: string;
    }>({ open: false, id: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();

    const handleDelete = (code: string) => {
        setDeleteConfirm({ open: true, code });
    };

    const handleConfirmDelete = () => {
        router.delete(destroy(deleteConfirm.code).url, {
            onSuccess: () => {
                toast({
                    title: 'Berhasil',
                    description: 'Barang telah dihapus',
                });
            },
        });

        setDeleteConfirm({ open: false, code: '' });
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
    };

    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            p.code.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            categoryFilter === 'all' ||
            p.kategori_barang_id === Number(categoryFilter);

        const matchesStock =
            stockFilter === 'all' ||
            (stockFilter === 'empty' && p.quantity === 0) ||
            (stockFilter === 'ready' && p.quantity > 0);

        return matchesSearch && matchesCategory && matchesStock;
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Barang',
            href: index().url,
        },
    ];

    const handleRiwayat = (codeSales: string, codeBarang: string) => {
        router.get(riwayat.url({ barang: codeBarang }), { sales: codeSales });
    };

    const ITEMS_PER_PAGE = 50;
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Barang'} />
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
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={categoryFilter}
                        onValueChange={(value) => {
                            setCategoryFilter(value);
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {categories.map((cat: any) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={stockFilter}
                        onValueChange={(value: any) => {
                            setStockFilter(value);
                            setCurrentPage(1);
                        }}
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
                                        <th className="px-4 py-3 text-right font-semibold">
                                            Stok
                                        </th>
                                        <th className="px-4 py-3 text-center font-semibold">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProducts.map((product) => (
                                        <tr
                                            key={product.code}
                                            className="transition-smooth border-b border-border hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {product.code}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {product.name}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {product.category?.name}
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
                                                    <Select
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            handleRiwayat(
                                                                value,
                                                                String(
                                                                    product.code,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full bg-gray-50 md:w-52">
                                                            <SelectValue placeholder="Lihat Riwayat Pemesanan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {initialSalesmen.map(
                                                                (cat) => (
                                                                    <SelectItem
                                                                        key={
                                                                            cat.code
                                                                        }
                                                                        value={String(
                                                                            cat.code,
                                                                        )}
                                                                    >
                                                                        {
                                                                            cat.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>

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
                                                                product.code,
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
                            {paginatedProducts.length === 0 && (
                                <div className="py-8 text-center text-muted-foreground">
                                    Tidak ada barang ditemukan
                                </div>
                            )}
                        </div>

                        {filteredProducts.length > 0 && (
                            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {startIndex + 1}-
                                    {Math.min(
                                        endIndex,
                                        filteredProducts.length,
                                    )}{' '}
                                    dari {filteredProducts.length} barang
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
                    initialCategories={categories}
                />
            </div>
        </AppLayout>
    );
}
