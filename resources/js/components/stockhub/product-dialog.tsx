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
import { useToast } from '@/hooks/use-toast';
import type { Category, Product } from '@/lib/types';
import { store, update } from '@/routes/product';
import { router } from '@inertiajs/react';
import type React from 'react';
import { useEffect, useState } from 'react';

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
    onClose: () => void;
    initialCategories: Category[];
}

export function ProductDialog({
    open,
    onOpenChange,
    product,
    onClose,
    initialCategories,
}: ProductDialogProps) {
    const [formData, setFormData] = useState<Product>({
        name: '',
        kategori_barang_id: 0,
        unit: 'PCS',
        quantity: 0,
    });

    const { toast } = useToast();

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                kategori_barang_id: product.kategori_barang_id,
                unit: product.unit,
                quantity: 0,
            });
        } else {
            setFormData({
                name: '',
                kategori_barang_id: 0,
                unit: 'KOLI',
                quantity: 0,
            });
        }
    }, [product, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.kategori_barang_id) {
            toast({
                title: 'Error',
                description: 'Semua field wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            if (product) {
                router.put(
                    update(product.code).url,
                    {
                        code: formData.code,
                        name: formData.name,
                        kategori_barang_id: formData.kategori_barang_id,
                        unit: formData.unit,
                    },
                    {
                        onSuccess: () => {
                            toast({
                                title: 'Berhasil',
                                description: 'Barang telah diperbarui',
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
            } else {
                const product = {
                    ...formData,
                    kategori_barang_id: Number(formData.kategori_barang_id),
                };

                router.post(store().url, product, {
                    onSuccess: () => {
                        toast({
                            title: 'Berhasil',
                            description: 'Barang baru telah ditambahkan',
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
                        <Label htmlFor="name">Nama Barang</Label>
                        <Input
                            className="mt-1"
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

                    <div className="grid grid-cols-2 gap-4">
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
                                <SelectTrigger id="category" className="mt-1">
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
                            <Label htmlFor="unit">Satuan</Label>
                            <Select
                                value={formData.unit}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        unit: value as 'PCS' | 'KOLI',
                                    })
                                }
                            >
                                <SelectTrigger id="unit" className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={'PCS'}>PCS</SelectItem>
                                    <SelectItem value={'KOLI'}>KOLI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
