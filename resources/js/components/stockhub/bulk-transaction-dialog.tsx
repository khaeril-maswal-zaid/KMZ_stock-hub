'use client';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
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
import type { Category, Product, Salesman } from '@/lib/types';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BulkItem {
    id: string;
    productId: number;
    salesId: string;
    quantity: number;
    unitPrice: number;
    purchaseDate: Date;
}

interface BulkTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    products: Product[];
    initialSalesmen: Salesman[];
    type: 'purchase' | 'sale';
    categories: Category[];
    onSubmit: (items: BulkItem[]) => void;
}

export function BulkTransactionDialog({
    open,
    onOpenChange,
    products,
    initialSalesmen,
    type,
    categories,
    onSubmit,
}: BulkTransactionDialogProps) {
    const [items, setItems] = useState<BulkItem[]>([]);
    const { toast } = useToast();
    const [searchValues, setSearchValues] = useState<Record<string, string>>(
        {},
    );
    const [openComboboxes, setOpenComboboxes] = useState<
        Record<string, boolean>
    >({});

    const [isToday, setIsToday] = useState(true);
    const [customDate, setCustomDate] = useState('');

    const handleAddItem = () => {
        const currentDate = new Date(isToday ? Date.now() : customDate);

        const newItem: BulkItem = {
            id: Date.now().toString(),
            productId: 0,
            quantity: 1,
            unitPrice: 0,
            salesId: '',
            purchaseDate: currentDate,
        };
        setItems((prev) => [...prev, newItem]);
    };

    useEffect(() => {
        const newDate = new Date(isToday ? Date.now() : customDate);
        setItems((prev) =>
            prev.map((item) => ({
                ...item,
                purchaseDate: newDate,
            })),
        );
    }, [isToday, customDate]);

    const handleRemoveItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
        const newSearchValues = { ...searchValues };
        delete newSearchValues[id];
        setSearchValues(newSearchValues);
    };

    const handleUpdateItem = <K extends keyof BulkItem>(
        id: string,
        field: K,
        value: BulkItem[K],
    ) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id !== id) return item;

                // Update harga otomatis untuk SALE
                if (field === 'productId' && type === 'sale') {
                    const product = products.find((p) => p.id === value);

                    return {
                        ...item,
                        [field]: value,
                        unitPrice: product ? product.price : 0,
                    };
                }

                // Default update
                return { ...item, [field]: value };
            }),
        );
    };

    const handleSubmit = () => {
        // Validate all items
        const invalidItems = items.filter(
            (item) =>
                !item.productId ||
                item.quantity <= 0 ||
                (type === 'purchase' && item.unitPrice <= 0),
        );

        if (items.length === 0) {
            toast({
                title: 'Error',
                description: 'Tambahkan minimal 1 item',
                variant: 'destructive',
            });
            return;
        }

        if (invalidItems.length > 0) {
            toast({
                title: 'Error',
                description:
                    'Semua item harus memiliki produk, jumlah, dan harga yang valid',
                variant: 'destructive',
            });
            return;
        }

        // Validate stock for sales
        if (type === 'sale') {
            for (const item of items) {
                const product = products.find((p) => p.id == item.productId);

                if (product && item.quantity > product.quantity) {
                    toast({
                        title: 'Error',
                        description: `Stok ${product.name} tidak cukup (tersedia: ${product.quantity})`,
                        variant: 'destructive',
                    });
                    return;
                }
            }
        }

        onSubmit(items);
        setItems([]);
        onOpenChange(false);
        toast({
            title: 'Berhasil',
            description: `${items.length} item telah ditambahkan`,
        });
    };

    const getFilteredProducts = (itemId: string) => {
        const search = searchValues[itemId] || '';

        return products.filter((product) => {
            const searchLower = search.toLowerCase();

            return (
                product.name.toLowerCase().includes(searchLower) ||
                product.code.toLowerCase().includes(searchLower) ||
                categories
                    .find((c) => c.id === product.kategori_barang_id)
                    ?.name.toLowerCase()
                    .includes(searchLower)
            );
        });
    };

    const getProductCategory = (productId: number) => {
        return products.find((p) => p.id === productId)?.category?.name || '';
    };

    const getProductStock = (productId: number) => {
        return products.find((p) => p.id === productId)?.quantity || 0;
    };

    const getProductPrice = (productId: number | number) => {
        return products.find((p) => p.id === productId)?.price || 0;
    };

    const totalAmount = items.reduce((sum, item) => {
        const price =
            type === 'sale' ? getProductPrice(item.productId) : item.unitPrice;

        return sum + item.quantity * price;
    }, 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] min-w-5xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {type === 'purchase'
                            ? 'Pembelian Massal'
                            : 'Penjualan Massal'}
                    </DialogTitle>
                    <DialogDescription>
                        {type === 'purchase'
                            ? 'Tambahkan multiple barang untuk pembelian massal'
                            : 'Tambahkan multiple barang untuk penjualan massal'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Items Table */}
                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {type === 'purchase' && (
                                        <TableHead>Sales</TableHead>
                                    )}
                                    <TableHead>Produk</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    {type === 'sale' && (
                                        <TableHead className="text-right">
                                            Stok
                                        </TableHead>
                                    )}
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
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={type === 'sale' ? 7 : 6}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            Belum ada item. Klik tombol "Tambah
                                            Item" untuk memulai.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item) => {
                                        const filteredProducts =
                                            getFilteredProducts(item.id);

                                        return (
                                            <TableRow key={item.id}>
                                                {type === 'purchase' && (
                                                    <TableCell>
                                                        <Select
                                                            value={item.salesId}
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                handleUpdateItem(
                                                                    item.id,
                                                                    'salesId',
                                                                    value,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger id="salesman">
                                                                <SelectValue placeholder="Pilih sales" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">
                                                                    Tidak ada
                                                                </SelectItem>
                                                                {initialSalesmen.map(
                                                                    (s) => (
                                                                        <SelectItem
                                                                            key={
                                                                                s.id
                                                                            }
                                                                            value={String(
                                                                                s.id,
                                                                            )}
                                                                        >
                                                                            {
                                                                                s.name
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                )}

                                                <TableCell>
                                                    <Combobox
                                                        items={filteredProducts.map(
                                                            (product) => ({
                                                                value: product.id,
                                                                label: `${product.code} _ ${product.name}`,
                                                                description: `${product.category?.name} • Stok: ${product.quantity} ${product.unit}`,
                                                            }),
                                                        )}
                                                        value={item.productId}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            handleUpdateItem(
                                                                item.id,
                                                                'productId',
                                                                value,
                                                            )
                                                        }
                                                        searchValue={
                                                            searchValues[
                                                                item.id
                                                            ] || ''
                                                        }
                                                        onSearchChange={(
                                                            value,
                                                        ) =>
                                                            setSearchValues({
                                                                ...searchValues,
                                                                [item.id]:
                                                                    value,
                                                            })
                                                        }
                                                        open={
                                                            openComboboxes[
                                                                item.id
                                                            ] || false
                                                        }
                                                        onOpenChange={(open) =>
                                                            setOpenComboboxes({
                                                                ...openComboboxes,
                                                                [item.id]: open,
                                                            })
                                                        }
                                                        placeholder="Pilih produk"
                                                        searchPlaceholder="Cari produk..."
                                                    />
                                                </TableCell>

                                                <TableCell className="text-sm text-muted-foreground">
                                                    {getProductCategory(
                                                        item.productId,
                                                    )}
                                                </TableCell>

                                                {type === 'sale' && (
                                                    <TableCell className="text-right">
                                                        <span
                                                            className={
                                                                getProductStock(
                                                                    item.productId,
                                                                ) === 0
                                                                    ? 'font-semibold text-red-500'
                                                                    : ''
                                                            }
                                                        >
                                                            {getProductStock(
                                                                item.productId,
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                )}

                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            handleUpdateItem(
                                                                item.id,
                                                                'quantity',
                                                                Number(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        className="w-20 text-right"
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    {type === 'sale' ? (
                                                        <span>
                                                            Rp.
                                                            {' ' +
                                                                getProductPrice(
                                                                    item.productId,
                                                                ).toLocaleString(
                                                                    'id-ID',
                                                                )}
                                                        </span>
                                                    ) : (
                                                        <Input
                                                            type=""
                                                            min="0"
                                                            step="1000"
                                                            value={
                                                                item.unitPrice
                                                            }
                                                            onChange={(e) =>
                                                                handleUpdateItem(
                                                                    item.id,
                                                                    'unitPrice',
                                                                    Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                            className="w-32 text-right"
                                                            placeholder="0"
                                                        />
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-right font-semibold">
                                                    Rp.{' '}
                                                    {type === 'sale'
                                                        ? (
                                                              item.quantity *
                                                              getProductPrice(
                                                                  item.productId,
                                                              )
                                                          ).toLocaleString(
                                                              'id-ID',
                                                          )
                                                        : (
                                                              item.quantity *
                                                              item.unitPrice
                                                          ).toLocaleString(
                                                              'id-ID',
                                                          )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRemoveItem(
                                                                item.id,
                                                            )
                                                        }
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Add Item Button */}
                    <Button
                        onClick={handleAddItem}
                        variant="outline"
                        className="w-full gap-2 bg-transparent"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Item
                    </Button>

                    {/* Date Picker Section */}
                    <div className="space-y-3 border-t pt-2">
                        <Label className="text-sm font-medium">
                            Tanggal Pembelian :
                        </Label>

                        {/* Date Options - Horizontal */}
                        <div className="mt-0.5 flex gap-2">
                            {/* Today Option */}
                            <button
                                onClick={() => {
                                    setIsToday(true);
                                    setCustomDate('');
                                }}
                                className={`flex w-1/2 cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                                    isToday
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                                        : 'border-border bg-muted/30 hover:bg-muted/50'
                                }`}
                            >
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                                    <Clock className="h-3.5 w-3.5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-sm font-medium">
                                        Hari ini
                                    </div>
                                    <div className="truncate text-xs text-muted-foreground">
                                        {new Date().toLocaleDateString(
                                            'id-ID',
                                            {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            },
                                        )}
                                    </div>
                                </div>
                                {isToday && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                )}
                            </button>

                            {/* Custom Date Option */}
                            <button
                                onClick={() => setIsToday(false)}
                                className={`flex w-1/2 cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                                    !isToday
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                                        : 'border-border bg-muted/30 hover:bg-muted/50'
                                }`}
                            >
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-white dark:bg-slate-600">
                                    <Calendar className="h-3.5 w-3.5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-sm font-medium">
                                        Tanggal Lain
                                    </div>
                                    <div className="truncate text-xs text-muted-foreground">
                                        {customDate
                                            ? new Date(
                                                  customDate,
                                              ).toLocaleDateString('id-ID', {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                              })
                                            : 'Pilih tanggal'}
                                    </div>
                                </div>
                                {!isToday && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                )}
                            </button>
                        </div>

                        {/* Date Input - shown when custom date selected */}
                        {!isToday && (
                            <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                                <Input
                                    type="date"
                                    value={customDate}
                                    onChange={(e) =>
                                        setCustomDate(e.target.value)
                                    }
                                    className="w-full"
                                />
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    {items.length > 0 && (
                        <div className="rounded-lg border border-border bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 dark:from-slate-950/30 dark:to-slate-900/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Item: {items.length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Total Jumlah:{' '}
                                        {items.reduce(
                                            (sum, item) => sum + item.quantity,
                                            0,
                                        )}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">
                                        Total Nilai
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        Rp{totalAmount.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={items.length === 0}
                        >
                            Simpan Transaksi Massal
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
