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
import { Plus, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface BulkItem {
    id: string;
    productId: number;
    salesId?: string; // optional on items (purchase only)
    quantity: number;
    unitPrice: number;
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

    const handleAddItem = useCallback(() => {
        const newItem: BulkItem = {
            id: Date.now().toString(),
            productId: 0,
            salesId: 'none',
            quantity: 1,
            unitPrice: 0,
        };
        setItems((prev) => [...prev, newItem]);
    }, []);

    const handleRemoveItem = useCallback((id: number) => {
        setItems((prev) => prev.filter((i) => Number(i.id) !== id));

        setSearchValues((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
        setOpenComboboxes((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    }, []);

    const handleUpdateItem = useCallback(
        <K extends keyof BulkItem>(
            id: string,
            field: K,
            value: BulkItem[K],
        ) => {
            setItems((prevItems) =>
                prevItems.map((item) => {
                    if (item.id !== id) return item;

                    // When product changes on sale, set unitPrice from product.price
                    if (field === 'productId' && type === 'sale') {
                        const product = products.find(
                            (p) => Number(p.id) === value,
                        );
                        return {
                            ...item,
                            [field]: value,
                            unitPrice: product ? product.price : 0,
                        } as BulkItem;
                    }

                    return { ...item, [field]: value } as BulkItem;
                }),
            );
        },
        [products, type],
    );

    const safeNumberFromInput = useCallback((v: string | number) => {
        const n = typeof v === 'number' ? v : Number(v);
        return Number.isFinite(n) ? n : 0;
    }, []);

    const getProductByCode = useCallback(
        (id?: Number) => {
            if (!id && id !== '') return undefined;
            return products.find((p) => Number(p.id) === Number(id));
        },
        [products],
    );

    const getProductCategory = useCallback(
        (productId?: Number) => {
            const product = getProductByCode(productId);
            if (!product) return '';
            // prefer product.category if available, otherwise lookup by kategori_barang_id
            return (
                product.category?.name ??
                categories.find(
                    (c) => Number(c.id) === Number(product.kategori_barang_id),
                )?.name ??
                ''
            );
        },
        [categories, getProductByCode],
    );

    const getProductStock = useCallback(
        (productId?: Number) => {
            return getProductByCode(productId)?.quantity ?? 0;
        },
        [getProductByCode],
    );

    const getProductPrice = useCallback(
        (productId?: Number) => {
            return getProductByCode(productId)?.price ?? 0;
        },
        [getProductByCode],
    );

    const totalAmount = useMemo(() => {
        return items.reduce((sum, item) => {
            const price =
                type === 'sale'
                    ? getProductPrice(item.productId)
                    : item.unitPrice;
            return sum + item.quantity * price;
        }, 0);
    }, [items, getProductPrice, type]);

    const handleSubmit = useCallback(() => {
        // Basic validations
        if (items.length === 0) {
            toast({
                title: 'Error',
                description: 'Tambahkan minimal 1 item',
                variant: 'destructive',
            });
            return;
        }

        const invalidItems = items.filter(
            (item) =>
                !item.productId ||
                item.quantity <= 0 ||
                (type === 'purchase' && item.unitPrice <= 0),
        );
        if (invalidItems.length > 0) {
            toast({
                title: 'Error',
                description:
                    'Semua item harus memiliki produk, jumlah, dan harga yang valid',
                variant: 'destructive',
            });
            return;
        }

        if (type === 'sale') {
            for (const item of items) {
                const product = getProductByCode(item.productId);
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

        // Submit: keep items local for toast message before clearing state
        onSubmit(items);
        toast({
            title: 'Berhasil',
            description: `${items.length} item telah ditambahkan`,
        });
        setItems([]);
        onOpenChange(false);
    }, [items, onSubmit, onOpenChange, toast, type, getProductByCode]);

    const getFilteredProducts = useCallback(
        (itemId: string) => {
            const search = (searchValues[itemId] || '').trim().toLowerCase();

            if (!search) return products;

            return products.filter((product) => {
                const category = categories.find(
                    (c) => Number(c.id) === Number(product.kategori_barang_id),
                );
                const name = product.name ?? '';
                const code = String(product.code ?? '');
                const categoryName =
                    category?.name ?? product.category?.name ?? '';

                return (
                    name.toLowerCase().includes(search) ||
                    code.toLowerCase().includes(search) ||
                    categoryName.toLowerCase().includes(search)
                );
            });
        },
        [categories, products, searchValues],
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] min-w-4xl overflow-y-auto">
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
                                        const filtered = getFilteredProducts(
                                            item.id,
                                        );

                                        return (
                                            <TableRow
                                                key={item.id}
                                                className="hover:bg-muted/50"
                                            >
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
                                                                    value ??
                                                                        'none',
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                id={`salesman-${item.id}`}
                                                            >
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
                                                        items={filtered.map(
                                                            (product) => ({
                                                                value: product.id,
                                                                label: `${product.code} _ ${product.name}`,
                                                                description: `${
                                                                    product
                                                                        .category
                                                                        ?.name ??
                                                                    categories.find(
                                                                        (c) =>
                                                                            String(
                                                                                c.id,
                                                                            ) ===
                                                                            String(
                                                                                product.kategori_barang_id,
                                                                            ),
                                                                    )?.name ??
                                                                    ''
                                                                } • Stok: ${product.quantity} ${product.unit}`,
                                                            }),
                                                        )}
                                                        value={Number(
                                                            item.productId ?? 0,
                                                        )}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            handleUpdateItem(
                                                                item.id,
                                                                'productId',
                                                                Number(value),
                                                            )
                                                        }
                                                        searchValue={
                                                            searchValues[
                                                                item.id
                                                            ] ?? ''
                                                        }
                                                        onSearchChange={(
                                                            value,
                                                        ) =>
                                                            setSearchValues(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [item.id]:
                                                                        value,
                                                                }),
                                                            )
                                                        }
                                                        open={
                                                            !!openComboboxes[
                                                                item.id
                                                            ]
                                                        }
                                                        onOpenChange={(
                                                            isOpen,
                                                        ) =>
                                                            setOpenComboboxes(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [item.id]:
                                                                        isOpen,
                                                                }),
                                                            )
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
                                                                    : 'tabular-nums'
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
                                                        min={1}
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const val =
                                                                safeNumberFromInput(
                                                                    e.target
                                                                        .value,
                                                                );
                                                            handleUpdateItem(
                                                                item.id,
                                                                'quantity',
                                                                val,
                                                            );
                                                        }}
                                                        className="w-20 text-right tabular-nums"
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    {type === 'sale' ? (
                                                        <span className="tabular-nums">
                                                            Rp.{' '}
                                                            {getProductPrice(
                                                                item.productId,
                                                            ).toLocaleString(
                                                                'id-ID',
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            step={1000}
                                                            value={
                                                                item.unitPrice
                                                            }
                                                            onChange={(e) =>
                                                                handleUpdateItem(
                                                                    item.id,
                                                                    'unitPrice',
                                                                    safeNumberFromInput(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                            className="w-32 text-right tabular-nums"
                                                            placeholder="0"
                                                        />
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-right font-semibold tabular-nums">
                                                    Rp.{' '}
                                                    {(
                                                        (type === 'sale'
                                                            ? getProductPrice(
                                                                  item.productId,
                                                              )
                                                            : item.unitPrice) *
                                                        item.quantity
                                                    ).toLocaleString('id-ID')}
                                                </TableCell>

                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRemoveItem(
                                                                Number(item.id),
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

                    <Button
                        onClick={handleAddItem}
                        variant="outline"
                        className="w-full gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Item
                    </Button>

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
                                            (sum, it) => sum + it.quantity,
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
