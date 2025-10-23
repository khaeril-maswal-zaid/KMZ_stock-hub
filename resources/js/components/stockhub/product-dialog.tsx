'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addProduct, updateProduct } from '@/lib/storage';
import type { Category, Product, Salesman } from '@/lib/types';
import type React from 'react';
import { useEffect, useState } from 'react';

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
    onClose: () => void;
    initialSalesmen: Salesman[];
    initialCategories: Category[];
}

export function ProductDialog({
    open,
    onOpenChange,
    product,
    onClose,
    initialSalesmen,
    initialCategories,
}: ProductDialogProps) {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        kategori_barang_id: 0,
        sales_id: 0,
        price: '',
        unit: 'PCS' as const,
        description: '',
    });

    const { toast } = useToast();

    useEffect(() => {
        if (product) {
            setFormData({
                code: product.code,
                name: product.name,
                kategori_barang_id: product.kategori_barang_id,
                sales_id: product.sales_id ?? 0,
                price: product.price.toString(),
                unit: product.unit,
                description: product.description || '',
            });
        } else {
            setFormData({
                code: '',
                name: '',
                kategori_barang_id: 0,
                sales_id: 0,
                price: '',
                unit: 'PCS',
                description: '',
            });
        }
    }, [product, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.code ||
            !formData.name ||
            !formData.kategori_barang_id ||
            !formData.price
        ) {
            toast({
                title: 'Error',
                description: 'Semua field wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            if (product) {
                updateProduct(product.id, {
                    code: formData.code,
                    name: formData.name,
                    kategori_barang_id: formData.kategori_barang_id,
                    sales_id: formData.sales_id || undefined,
                    price: Number.parseFloat(formData.price),
                    unit: formData.unit,
                    description: formData.description,
                });
                toast({
                    title: 'Berhasil',
                    description: 'Barang telah diperbarui',
                });
            } else {
                addProduct({
                    ...formData,
                    kategori_barang_id: Number(formData.kategori_barang_id),
                    sales_id: formData.sales_id
                        ? Number(formData.sales_id)
                        : undefined,
                    price: Number(formData.price),
                });
                toast({
                    title: 'Berhasil',
                    description: 'Barang telah ditambahkan',
                });
            }
            onOpenChange(false);
            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Terjadi kesalahan',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {product ? 'Edit Barang' : 'Tambah Barang Baru'}
                    </DialogTitle>
                    <DialogDescription>
                        {product
                            ? 'Perbarui informasi barang'
                            : 'Masukkan detail barang baru'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">Kode Barang</Label>
                        <Input
                            id="code"
                            placeholder="Contoh: ELEC001"
                            value={formData.code}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    code: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Barang</Label>
                        <Input
                            id="name"
                            placeholder="Contoh: Laptop Dell XPS"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Kategori</Label>
                        <Select
                            value={
                                formData.kategori_barang_id
                                    ? String(formData.kategori_barang_id)
                                    : ''
                            }
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    kategori_barang_id: Number(value),
                                })
                            }
                        >
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialCategories.map((cat) => (
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

                    <div className="space-y-2">
                        <Label htmlFor="salesman">Sales (Opsional)</Label>
                        <Select
                            value={
                                formData.sales_id
                                    ? String(formData.sales_id)
                                    : ''
                            }
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    sales_id:
                                        value === 'none' ? 0 : Number(value),
                                })
                            }
                        >
                            <SelectTrigger id="salesman">
                                <SelectValue placeholder="Pilih sales" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Tidak ada</SelectItem>
                                {initialSalesmen.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Harga (Rp)</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="0"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unit">Satuan</Label>
                            <Select
                                value={formData.unit}
                                onValueChange={(value: any) =>
                                    setFormData({ ...formData, unit: value })
                                }
                            >
                                <SelectTrigger id="unit">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PCS">PCS</SelectItem>
                                    <SelectItem value="KOLI">KOLI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Deskripsi (Opsional)
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Deskripsi barang..."
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button type="submit" className="flex-1">
                            {product ? 'Perbarui' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
