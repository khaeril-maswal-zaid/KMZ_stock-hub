"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Product, Category, Salesman } from "@/lib/types"
import { getCategories, addProduct, updateProduct, getSalesmen } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onClose: () => void
}

export function ProductDialog({ open, onOpenChange, product, onClose }: ProductDialogProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [salesmen, setSalesmen] = useState<Salesman[]>([])
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    categoryId: "",
    salesmanId: "",
    price: "",
    unit: "PCS" as const,
    description: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    setCategories(getCategories())
    setSalesmen(getSalesmen())
  }, [])

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code,
        name: product.name,
        categoryId: product.categoryId,
        salesmanId: product.salesmanId || "",
        price: product.price.toString(),
        unit: product.unit,
        description: product.description || "",
      })
    } else {
      setFormData({
        code: "",
        name: "",
        categoryId: "",
        salesmanId: "",
        price: "",
        unit: "PCS",
        description: "",
      })
    }
  }, [product, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code || !formData.name || !formData.categoryId || !formData.price) {
      toast({
        title: "Error",
        description: "Semua field wajib diisi",
        variant: "destructive",
      })
      return
    }

    try {
      if (product) {
        updateProduct(product.id, {
          code: formData.code,
          name: formData.name,
          categoryId: formData.categoryId,
          salesmanId: formData.salesmanId || undefined,
          price: Number.parseFloat(formData.price),
          unit: formData.unit,
          description: formData.description,
        })
        toast({
          title: "Berhasil",
          description: "Barang telah diperbarui",
        })
      } else {
        addProduct({
          code: formData.code,
          name: formData.name,
          categoryId: formData.categoryId,
          salesmanId: formData.salesmanId || undefined,
          price: Number.parseFloat(formData.price),
          quantity: 0,
          unit: formData.unit,
          description: formData.description,
        })
        toast({
          title: "Berhasil",
          description: "Barang telah ditambahkan",
        })
      }
      onOpenChange(false)
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Barang" : "Tambah Barang Baru"}</DialogTitle>
          <DialogDescription>{product ? "Perbarui informasi barang" : "Masukkan detail barang baru"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Kode Barang</Label>
            <Input
              id="code"
              placeholder="Contoh: ELEC001"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Barang</Label>
            <Input
              id="name"
              placeholder="Contoh: Laptop Dell XPS"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salesman">Sales (Opsional)</Label>
            <Select
              value={formData.salesmanId}
              onValueChange={(value) => setFormData({ ...formData, salesmanId: value })}
            >
              <SelectTrigger id="salesman">
                <SelectValue placeholder="Pilih sales" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak ada</SelectItem>
                {salesmen.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
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
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Satuan</Label>
              <Select value={formData.unit} onValueChange={(value: any) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PCS">PCS (Pcs)</SelectItem>
                  <SelectItem value="KOLI">KOLI (Kotak)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              placeholder="Deskripsi barang..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              {product ? "Perbarui" : "Tambah"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
