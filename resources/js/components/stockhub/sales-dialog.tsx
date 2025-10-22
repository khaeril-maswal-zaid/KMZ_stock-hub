"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/lib/types"

interface SalesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
  onAddSale: (productId: string, quantity: number) => void
}

export function SalesDialog({ open, onOpenChange, products, onAddSale }: SalesDialogProps) {
  const [selectedProductId, setSelectedProductId] = useState("")
  const [quantity, setQuantity] = useState("")

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedProductId && quantity) {
      onAddSale(selectedProductId, Number.parseInt(quantity))
      setSelectedProductId("")
      setQuantity("")
    }
  }

  const totalPrice = selectedProduct ? selectedProduct.price * (Number.parseInt(quantity) || 0) : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Catat Penjualan</DialogTitle>
          <DialogDescription>Pilih barang dan masukkan jumlah yang dijual</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Pilih Barang</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger id="product">
                <SelectValue placeholder="Pilih barang..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (Stok: {product.quantity} {product.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <>
              <div className="bg-muted/50 p-3 rounded space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kode:</span>
                  <span className="font-mono font-bold">{selectedProduct.code}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Harga Satuan:</span>
                  <span className="font-bold">Rp {selectedProduct.price.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Stok Tersedia:</span>
                  <span className="font-bold">
                    {selectedProduct.quantity} {selectedProduct.unit}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah Penjualan</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  max={selectedProduct.quantity}
                />
              </div>

              {quantity && (
                <div className="bg-primary/10 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Penjualan:</span>
                    <span className="text-lg font-bold text-primary">Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={!selectedProductId || !quantity} className="flex-1">
              Catat Penjualan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
