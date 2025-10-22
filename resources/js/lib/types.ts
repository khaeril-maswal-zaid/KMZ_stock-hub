export interface Category {
  id: string
  name: string
  description?: string
  createdAt: Date
}

export interface Salesman {
  id: string
  name: string
  email?: string
  phone?: string
  createdAt: Date
}

export interface Product {
  id: string
  code: string
  name: string
  categoryId: string
  salesmanId?: string
  price: number
  quantity: number
  unit: "PCS" | "KOLI"
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Purchase {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  purchaseDate: Date
}

export interface Sale {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  saleDate: Date
}

export interface StockHistory {
  id: string
  productId: string
  type: "IN" | "OUT"
  quantity: number
  notes?: string
  createdAt: Date
}
