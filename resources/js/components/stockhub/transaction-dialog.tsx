'use client';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
('use client');

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
import type { Category, Product, Salesman } from '@/lib/types';
import type React from 'react';
import { useEffect, useState } from 'react';

import { useMemo } from 'react';

interface TransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    products: Product[];
    categories: Category[];
    type: 'purchase' | 'sale';
    initialSalesmen: Salesman[];
    onSubmit: (
        product_id: string,
        quantity: number,
        salesman: string,
        unit_price: number,
    ) => void;
}

export function TransactionDialog({
    open,
    onOpenChange,
    products,
    categories,
    type,
    initialSalesmen,
    onSubmit,
}: TransactionDialogProps) {
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [salesman, setSalesman] = useState('');
    const [openCombobox, setOpenCombobox] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if (!open) {
            setSelectedProductId('');
            setQuantity('');
            setUnitPrice('');
            setSalesman('');
            setSearchValue('');
        }
    }, [open]);

    const selectedProduct = products.find((p) => p.code === selectedProductId);

    const filteredProducts = useMemo(() => {
        if (!searchValue) return products;

        const searchLower = searchValue.toLowerCase();

        return products.filter((product) => {
            const category = categories.find((c) => c.id === product.code);
            return (
                product.code.toLowerCase().includes(searchLower) ||
                product.name.toLowerCase().includes(searchLower) ||
                category?.name.toLowerCase().includes(searchLower)
            );
        });
    }, [searchValue, products, categories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProductId && quantity) {
            const price =
                type === 'purchase' ? Number.parseFloat(unitPrice) : undefined;

            onSubmit(
                selectedProductId,
                Number(quantity),
                salesman,
                Number(unitPrice),
            );
            setSelectedProductId('');
            setQuantity('');
            setUnitPrice('');
            setSearchValue('');
        }
    };

    const totalPrice = selectedProduct
        ? type === 'purchase' && unitPrice
            ? Number.parseFloat(unitPrice) * (Number.parseInt(quantity) || 0)
            : selectedProduct.price * (Number.parseInt(quantity) || 0)
        : 0;

    const stockAfter =
        selectedProduct && quantity
            ? type === 'purchase'
                ? selectedProduct.quantity + Number.parseInt(quantity)
                : selectedProduct.quantity - Number.parseInt(quantity)
            : selectedProduct?.quantity || 0;

    const title = type === 'purchase' ? 'Catat Pembelian' : 'Catat Penjualan';
    const description =
        type === 'purchase'
            ? 'Pilih barang dan masukkan jumlah yang dibeli'
            : 'Pilih barang dan masukkan jumlah yang dijual';
    const submitLabel =
        type === 'purchase' ? 'Catat Pembelian' : 'Catat Penjualan';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {type === 'purchase' && (
                        <div className="space-y-2">
                            <Label htmlFor="salesman">Sales</Label>
                            <Select
                                value={salesman}
                                onValueChange={(value) => setSalesman(value)}
                            >
                                <SelectTrigger id="salesman">
                                    <SelectValue placeholder="Pilih sales" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        Tidak ada
                                    </SelectItem>
                                    {initialSalesmen.map((s) => (
                                        <SelectItem
                                            key={s.id}
                                            value={String(s.id)}
                                        >
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="product">Pilih Barang</Label>
                        <Combobox
                            items={filteredProducts.map((product) => {
                                return {
                                    value: product.code,
                                    label: `${product.name} _ ${product.code}`,
                                    description: `${product.category?.name} • Stok: ${product.quantity} ${product.unit}`,
                                };
                            })}
                            value={selectedProductId}
                            onValueChange={setSelectedProductId}
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                            open={openCombobox}
                            onOpenChange={setOpenCombobox}
                            placeholder="Cari barang..."
                            searchPlaceholder="Cari kode, nama, atau kategori..."
                        />
                    </div>

                    {selectedProduct && (
                        <>
                            <div className="space-y-3 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 dark:border-blue-800 dark:from-blue-950/30 dark:to-blue-900/20">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Kode:
                                    </span>
                                    <span className="font-mono font-bold text-foreground">
                                        {selectedProduct.code}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Kategori:
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {selectedProduct?.category?.name || '-'}
                                    </span>
                                </div>
                                {type === 'sale' && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Harga Satuan:
                                        </span>
                                        <span className="font-bold text-foreground">
                                            Rp{' '}
                                            {selectedProduct.price.toLocaleString(
                                                'id-ID',
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t border-blue-200 pt-2 dark:border-blue-800">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Stok Awal:
                                        </span>
                                        <span className="font-bold text-foreground">
                                            {selectedProduct.quantity}{' '}
                                            {selectedProduct.unit}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantity">
                                    Jumlah{' '}
                                    {type === 'purchase'
                                        ? 'Pembelian'
                                        : 'Penjualan'}
                                </Label>
                                <Input
                                    id="quantity"
                                    type=""
                                    placeholder="0"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                    max={
                                        type === 'sale'
                                            ? selectedProduct.quantity
                                            : undefined
                                    }
                                />
                            </div>

                            {type === 'purchase' && (
                                <div className="space-y-2">
                                    <Label htmlFor="unitPrice">
                                        Harga Satuan Pembelian (Rp)
                                    </Label>
                                    <Input
                                        id="unitPrice"
                                        type="number"
                                        placeholder="0"
                                        value={unitPrice}
                                        onChange={(e) =>
                                            setUnitPrice(e.target.value)
                                        }
                                    />
                                </div>
                            )}

                            {quantity && (
                                <div className="space-y-2 rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 dark:border-emerald-800 dark:from-emerald-950/30 dark:to-emerald-900/20">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Stok Awal:
                                        </span>
                                        <span className="font-bold text-foreground">
                                            {selectedProduct.quantity}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {type === 'purchase'
                                                ? 'Penambahan:'
                                                : 'Pengurangan:'}
                                        </span>
                                        <span
                                            className={`font-bold ${type === 'purchase' ? 'text-green-600' : 'text-red-600'}`}
                                        >
                                            {type === 'purchase' ? '+' : '-'}{' '}
                                            {quantity}
                                        </span>
                                    </div>
                                    <div className="border-t border-emerald-200 pt-2 dark:border-emerald-800">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-muted-foreground">
                                                Stok Akhir:
                                            </span>
                                            <span
                                                className={`text-lg font-bold ${stockAfter < 0 ? 'text-red-600' : 'text-emerald-600'}`}
                                            >
                                                {stockAfter}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {quantity && (
                                <div className="rounded-lg bg-primary/10 p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            Total{' '}
                                            {type === 'purchase'
                                                ? 'Pembelian'
                                                : 'Penjualan'}
                                            :
                                        </span>
                                        <span className="text-lg font-bold text-primary">
                                            Rp{' '}
                                            {totalPrice.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                !selectedProductId ||
                                !quantity ||
                                (type === 'purchase' && !unitPrice)
                            }
                            className="flex-1"
                        >
                            {submitLabel}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
