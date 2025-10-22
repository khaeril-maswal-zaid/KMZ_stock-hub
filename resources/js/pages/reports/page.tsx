"use client"

import { useEffect, useState } from "react"
import { getProducts, getSales, getStockHistory } from "@/lib/storage"
import type { Product, Sale, StockHistory } from "@/lib/types"
import { TrendingUp, Package, Award } from "lucide-react"

export default function ReportsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [history, setHistory] = useState<StockHistory[]>([])

  useEffect(() => {
    setProducts(getProducts())
    setSales(getSales())
    setHistory(getStockHistory())
  }, [])

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "-"
  }

  const getProductUnit = (productId: string) => {
    return products.find((p) => p.id === productId)?.unit || "PCS"
  }

  // Calculate statistics
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0)
  const totalItemsSold = sales.reduce((sum, s) => sum + s.quantity, 0)
  const topProduct = sales
    .reduce((acc, sale) => {
      const existing = acc.find((s) => s.productId === sale.productId)
      if (existing) {
        existing.quantity += sale.quantity
        existing.revenue += sale.totalPrice
      } else {
        acc.push({ productId: sale.productId, quantity: sale.quantity, revenue: sale.totalPrice })
      }
      return acc
    }, [] as any[])
    .sort((a, b) => b.revenue - a.revenue)[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Laporan & Analitik</h1>
        <p className="text-muted-foreground mt-2">Ringkasan penjualan dan stok</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Pendapatan Card - Rose Gradient */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/20 shadow-sm hover:shadow-md transition-smooth">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-rose-600"></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Pendapatan</h3>
              <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-lg">
                <TrendingUp className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">Rp {(totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground mt-2">Dari semua penjualan</p>
          </div>
        </div>

        {/* Total Terjual Card - Orange Gradient */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 shadow-sm hover:shadow-md transition-smooth">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-orange-600"></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Terjual</h3>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">{totalItemsSold}</div>
            <p className="text-xs text-muted-foreground mt-2">Unit produk</p>
          </div>
        </div>

        {/* Produk Terlaris Card - Violet Gradient */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20 shadow-sm hover:shadow-md transition-smooth">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-violet-600"></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Produk Terlaris</h3>
              <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
                <Award className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">
              {topProduct ? getProductName(topProduct.productId).substring(0, 15) : "-"}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {topProduct ? `${topProduct.quantity} unit terjual` : "Belum ada data"}
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/30 dark:to-slate-900/20 shadow-sm">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-400 to-slate-500"></div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Riwayat Stok</h3>
          <p className="text-sm text-muted-foreground mb-4">Perubahan stok barang</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Tanggal</th>
                  <th className="text-left py-3 px-4 font-semibold">Barang</th>
                  <th className="text-center py-3 px-4 font-semibold">Tipe</th>
                  <th className="text-right py-3 px-4 font-semibold">Jumlah</th>
                  <th className="text-left py-3 px-4 font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {history
                  .slice()
                  .reverse()
                  .map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-3 px-4 font-medium">{getProductName(item.productId)}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            item.type === "IN"
                              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {item.type === "IN" ? "Masuk" : "Keluar"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold">
                        {item.quantity} {getProductUnit(item.productId)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{item.notes || "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {history.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">Belum ada riwayat stok</div>
            )}
          </div>
        </div>
      </div>

      {sales.length > 0 && (
        <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/30 dark:to-slate-900/20 shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-400 to-slate-500"></div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Produk Terlaris</h3>
            <p className="text-sm text-muted-foreground mb-4">Produk dengan penjualan tertinggi</p>
            <div className="space-y-3">
              {sales
                .reduce((acc, sale) => {
                  const existing = acc.find((s) => s.productId === sale.productId)
                  if (existing) {
                    existing.quantity += sale.quantity
                    existing.revenue += sale.totalPrice
                  } else {
                    acc.push({ productId: sale.productId, quantity: sale.quantity, revenue: sale.totalPrice })
                  }
                  return acc
                }, [] as any[])
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map((item, index) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-border hover:border-primary/50 transition-smooth"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{getProductName(item.productId)}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} unit terjual</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">Rp {(item.revenue / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
