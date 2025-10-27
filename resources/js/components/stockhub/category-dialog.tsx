'use client';

import type React from 'react';

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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addCategory, updateCategory } from '@/lib/storage';
import type { Category } from '@/lib/types';
import { useEffect, useState } from 'react';

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category | null;
    onClose: () => void;
}

export function CategoryDialog({
    open,
    onOpenChange,
    category,
    onClose,
}: CategoryDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const { toast } = useToast();

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description || '',
            });
        } else {
            setFormData({
                name: '',
                description: '',
            });
        }
    }, [category, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            toast({
                title: 'Error',
                description: 'Nama kategori wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            const data = {
                name: formData.name,
                description: formData.description,
            };

            if (category) {
                updateCategory(Number(category.id), data);
                toast({
                    title: 'Berhasil',
                    description: 'Kategori telah diperbarui',
                });
            } else {
                addCategory(data);

                toast({
                    title: 'Berhasil',
                    description: 'Kategori telah ditambahkan',
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
                        {category ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                    </DialogTitle>
                    <DialogDescription>
                        {category
                            ? 'Perbarui informasi kategori'
                            : 'Masukkan detail kategori baru'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Kategori</Label>
                        <Input
                            id="name"
                            placeholder="Contoh: Elektronik"
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
                        <Label htmlFor="description">
                            Deskripsi (Opsional)
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Deskripsi kategori..."
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
                            {category ? 'Perbarui' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
