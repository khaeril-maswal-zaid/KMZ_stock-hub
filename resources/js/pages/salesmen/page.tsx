'use client';

import type React from 'react';

import { DeleteConfirmDialog } from '@/components/stockhub/delete-confirm-dialog';
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
import AppLayout from '@/layouts/app-layout';
import { formatDateIna } from '@/lib/date';
import { addSalesman, deleteSalesman, updateSalesman } from '@/lib/storage';
import type { Salesman } from '@/lib/types';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit2, Mail, Phone, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface initialData {
    salesmen: Salesman[];
}

export default function SalesmenPage({ salesmen }: initialData) {
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

    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        id: number;
    }>({ open: false, id: 0 });

    const { toast } = useToast();

    const handleDelete = (id: number) => {
        setDeleteConfirm({ open: true, id });
    };

    const handleConfirmDelete = () => {
        deleteSalesman(Number(deleteConfirm.id));

        toast({
            title: 'Berhasil',
            description: 'Sales telah dihapus',
        });
        setDeleteConfirm({ open: false, id: 0 });
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

        const data = {
            id: '',
            name: formData.name,
            email: formData.email || undefined,
            phone: formData.phone || undefined,
        };

        try {
            if (editingSalesman) {
                updateSalesman(Number(editingSalesman.id), data);

                toast({
                    title: 'Berhasil',
                    description: 'Sales telah diperbarui',
                });
            } else {
                addSalesman(data);
                toast({
                    title: 'Berhasil',
                    description: 'Sales telah ditambahkan',
                });
            }
            setIsDialogOpen(false);
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
                        {/* Salesmen Grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredSalesmen.map((salesman) => (
                                <Card
                                    key={salesman.id}
                                    className="transition-smooth border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-50/50 hover:shadow-lg dark:from-blue-950/20 dark:to-blue-950/10"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            {salesman.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Bergabung:{' '}
                                            {formatDateIna(salesman.created_at)}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {salesman.email && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    {salesman.email}
                                                </span>
                                            </div>
                                        )}
                                        {salesman.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    {salesman.phone}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleEdit(salesman)
                                                }
                                                className="flex-1 gap-2"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(salesman.id)
                                                }
                                                className="flex-1 gap-2 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Hapus
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <DeleteConfirmDialog
                    open={deleteConfirm.open}
                    onOpenChange={(open) =>
                        setDeleteConfirm({ ...deleteConfirm, open })
                    }
                    title="Hapus Sales"
                    description="Apakah Anda yakin ingin menghapus sales ini? Tindakan ini tidak dapat dibatalkan."
                    onConfirm={handleConfirmDelete}
                />

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
                                <Label htmlFor="phone">
                                    Telepon (Opsional)
                                </Label>
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
        </AppLayout>
    );
}
