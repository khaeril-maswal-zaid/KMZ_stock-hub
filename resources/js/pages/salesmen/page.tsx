'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
    addSalesman,
    deleteSalesman,
    getSalesmen,
    updateSalesman,
} from '@/lib/storage';
import type { Salesman } from '@/lib/types';
import { Edit2, Mail, Phone, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SalesmenPage() {
    const [salesmen, setSalesmen] = useState<Salesman[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSalesman, setEditingSalesman] = useState<Salesman | null>(
        null,
    );
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const { toast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setSalesmen(getSalesmen());
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus sales ini?')) {
            deleteSalesman(id);
            loadData();
            toast({
                title: 'Berhasil',
                description: 'Sales telah dihapus',
            });
        }
    };

    const handleEdit = (salesman: Salesman) => {
        setEditingSalesman(salesman);
        setFormData({
            name: salesman.name,
            email: salesman.email || '',
            phone: salesman.phone || '',
        });
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingSalesman(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            toast({
                title: 'Error',
                description: 'Nama sales wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            if (editingSalesman) {
                updateSalesman(editingSalesman.id, {
                    name: formData.name,
                    email: formData.email || undefined,
                    phone: formData.phone || undefined,
                });
                toast({
                    title: 'Berhasil',
                    description: 'Sales telah diperbarui',
                });
            } else {
                addSalesman({
                    name: formData.name,
                    email: formData.email || undefined,
                    phone: formData.phone || undefined,
                });
                toast({
                    title: 'Berhasil',
                    description: 'Sales telah ditambahkan',
                });
            }
            setIsDialogOpen(false);
            loadData();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Terjadi kesalahan',
                variant: 'destructive',
            });
        }
    };

    const filteredSalesmen = salesmen.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.phone?.includes(searchTerm),
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Manajemen Sales
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Kelola data sales/salesman
                    </p>
                </div>
                <Button onClick={handleAddNew} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Sales
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Cari sales, email, atau nomor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Salesmen Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Sales</CardTitle>
                    <CardDescription>
                        {filteredSalesmen.length} sales
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Nama
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Telepon
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Bergabung
                                    </th>
                                    <th className="px-4 py-3 text-center font-semibold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSalesmen.map((salesman) => (
                                    <tr
                                        key={salesman.id}
                                        className="transition-smooth border-b border-border hover:bg-muted/30"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {salesman.name}
                                        </td>
                                        <td className="flex items-center gap-2 px-4 py-3 text-muted-foreground">
                                            {salesman.email ? (
                                                <>
                                                    <Mail className="h-4 w-4" />
                                                    {salesman.email}
                                                </>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="flex items-center gap-2 px-4 py-3 text-muted-foreground">
                                            {salesman.phone ? (
                                                <>
                                                    <Phone className="h-4 w-4" />
                                                    {salesman.phone}
                                                </>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {new Date(
                                                salesman.createdAt,
                                            ).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEdit(salesman)
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
                                                            salesman.id,
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
                        {filteredSalesmen.length === 0 && (
                            <div className="py-8 text-center text-muted-foreground">
                                Tidak ada sales ditemukan
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingSalesman
                                ? 'Edit Sales'
                                : 'Tambah Sales Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSalesman
                                ? 'Perbarui informasi sales'
                                : 'Masukkan detail sales baru'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Sales</Label>
                            <Input
                                id="name"
                                placeholder="Contoh: Budi Santoso"
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
                            <Label htmlFor="email">Email (Opsional)</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="budi@example.com"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telepon (Opsional)</Label>
                            <Input
                                id="phone"
                                placeholder="081234567890"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                            <Button type="submit" className="flex-1">
                                {editingSalesman ? 'Perbarui' : 'Tambah'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
