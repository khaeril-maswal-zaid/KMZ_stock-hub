'use client';

import { SalesDialog } from '@/components/stockhub//sales-dialog';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
    addSale,
    addStockHistory,
    getCategories,
    getProducts,
    getSales,
    updateProduct,
} from '@/lib/storage';
import type { Category, Product, Sale } from '@/lib/types';
import { Plus, ShoppingCart, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SalesPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setProducts(getProducts());
        setSales(getSales());
        setCategories(getCategories());
    };

    const handleAddSale = (productId: string, quantity: number) => {
        const product = products.find((p) => p.id === productId);
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
            const totalPrice = product.price * quantity;
            addSale({
                productId,
                quantity,
                unitPrice: product.price,
                totalPrice,
                saleDate: new Date(),
            });

            // Update product quantity
            updateProduct(productId, {
                quantity: product.quantity - quantity,
            });

            // Add to stock history
            addStockHistory({
                productId,
                type: 'OUT',
                quantity,
                notes: `Penjualan ${quantity} ${product.unit}`,
            });

            loadData();
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

    const getProductName = (productId: string) => {
        return products.find((p) => p.id === productId)?.name || '-';
    };

    const getProductUnit = (productId: string) => {
        return products.find((p) => p.id === productId)?.unit || 'PCS';
    };

    const getCategoryName = (categoryId: string) => {
        return categories.find((c) => c.id === categoryId)?.name || '-';
    };

    const getProductCategory = (productId: string) => {
        return products.find((p) => p.id === productId)?.categoryId || '';
    };

    const filteredSales = sales.filter((sale) => {
        if (categoryFilter === 'all') return true;
        const productCategory = getProductCategory(sale.productId);
        return productCategory === categoryFilter;
    });

    const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Penjualan
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Catat penjualan dan kurangi stok
                    </p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Catat Penjualan
                </Button>
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
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Barang
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Kategori
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold">
                                        Jumlah
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold">
                                        Harga Satuan
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSales
                                    .slice()
                                    .reverse()
                                    .map((sale) => (
                                        <tr
                                            key={sale.id}
                                            className="transition-smooth border-b border-border hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {new Date(
                                                    sale.saleDate,
                                                ).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {getProductName(sale.productId)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {getCategoryName(
                                                    getProductCategory(
                                                        sale.productId,
                                                    ),
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {sale.quantity}{' '}
                                                {getProductUnit(sale.productId)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                Rp{' '}
                                                {sale.unitPrice.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold">
                                                Rp{' '}
                                                {sale.totalPrice.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {filteredSales.length === 0 && (
                            <div className="py-8 text-center text-muted-foreground">
                                Belum ada penjualan dicatat
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <SalesDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                products={products}
                onAddSale={handleAddSale}
            />
        </div>
    );
}
