'use client';

import { CategoryDialog } from '@/components/stockhub/category-dialog';
import { DeleteConfirmDialog } from '@/components/stockhub/delete-confirm-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { deleteCategory } from '@/lib/storage';
import type { Category } from '@/lib/types';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface initialData {
    categories: Category[];
}

export default function CategoriesPage({ categories }: initialData) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );
    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        id: string;
    }>({ open: false, id: '' });
    const { toast } = useToast();

    const handleDelete = (id: string) => {
        setDeleteConfirm({ open: true, id });
    };

    const handleConfirmDelete = () => {
        deleteCategory(deleteConfirm.id);

        toast({
            title: 'Berhasil',
            description: 'Kategori telah dihapus',
        });
        setDeleteConfirm({ open: false, id: '' });
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setEditingCategory(null);
    };

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
                            Manajemen Kategori
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Kelola kategori produk
                        </p>
                    </div>
                    <Button onClick={handleAddNew} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            className="transition-smooth hover:shadow-lg"
                        >
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {category.name}
                                </CardTitle>
                                <CardDescription>
                                    {category.description || 'Tanpa deskripsi'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(category)}
                                        className="flex-1 gap-2"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleDelete(category.id)
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

                {categories.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            Belum ada kategori. Klik tombol "Tambah Kategori"
                            untuk membuat kategori baru.
                        </CardContent>
                    </Card>
                )}

                <DeleteConfirmDialog
                    open={deleteConfirm.open}
                    onOpenChange={(open) =>
                        setDeleteConfirm({ ...deleteConfirm, open })
                    }
                    title="Hapus Kategori"
                    description="Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan."
                    onConfirm={handleConfirmDelete}
                />

                <CategoryDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    category={editingCategory}
                    onClose={handleDialogClose}
                />
            </div>
        </AppLayout>
    );
}
