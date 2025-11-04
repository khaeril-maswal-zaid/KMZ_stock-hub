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
import { ChevronLeft, ChevronRight, Edit2, Plus, Trash2 } from 'lucide-react';
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
        id: number;
    }>({ open: false, id: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();

    const handleDelete = (id: number) => {
        setDeleteConfirm({ open: true, id });
    };

    const handleConfirmDelete = () => {
        deleteCategory(deleteConfirm.id);

        toast({
            title: 'Berhasil',
            description: 'Kategori telah dihapus',
        });
        setDeleteConfirm({ open: false, id: 0 });
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

    const ITEMS_PER_PAGE = 20;

    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCategories = categories.slice(startIndex, endIndex);

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

                {/* Categories Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Kategori</CardTitle>
                        <CardDescription>
                            {categories.length} kategori
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Nama Kategori
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Deskripsi
                                        </th>
                                        <th className="px-4 py-3 text-center font-semibold">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCategories.map((category) => (
                                        <tr
                                            key={category.id}
                                            className="transition-smooth border-b border-border hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {category.name}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {category.description || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(category)
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
                                                                category.id,
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
                            {paginatedCategories.length === 0 && (
                                <div className="py-8 text-center text-muted-foreground">
                                    Tidak ada kategori ditemukan
                                </div>
                            )}
                        </div>

                        {categories.length > 0 && (
                            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {startIndex + 1}-
                                    {Math.min(endIndex, categories.length)} dari{' '}
                                    {categories.length} kategori
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(1, currentPage - 1),
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="gap-2"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Sebelumnya
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1,
                                        ).map((page) => (
                                            <Button
                                                key={page}
                                                variant={
                                                    currentPage === page
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }
                                                className="h-8 w-8 p-0"
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    totalPages,
                                                    currentPage + 1,
                                                ),
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="gap-2"
                                    >
                                        Selanjutnya
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

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
