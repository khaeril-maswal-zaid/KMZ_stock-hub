import type { Category, Product, Sale, StockHistory, Salesman, Purchase } from "./types"

const STORAGE_KEYS = {
  CATEGORIES: "stock_categories",
  PRODUCTS: "stock_products",
  SALES: "stock_sales",
  PURCHASES: "stock_purchases",
  HISTORY: "stock_history",
  SALESMEN: "stock_salesmen",
}

// Mock data
const mockCategories: Category[] = [
  { id: "1", name: "Elektronik", description: "Produk elektronik", createdAt: new Date() },
  { id: "2", name: "Pakaian", description: "Produk pakaian", createdAt: new Date() },
  { id: "3", name: "Makanan", description: "Produk makanan", createdAt: new Date() },
]

const mockSalesmen: Salesman[] = [
  { id: "s1", name: "Budi Santoso", email: "budi@example.com", phone: "081234567890", createdAt: new Date() },
  { id: "s2", name: "Siti Nurhaliza", email: "siti@example.com", phone: "081234567891", createdAt: new Date() },
  { id: "s3", name: "Ahmad Wijaya", email: "ahmad@example.com", phone: "081234567892", createdAt: new Date() },
]

const mockProducts: Product[] = [
  {
    id: "1",
    code: "ELEC001",
    name: "Laptop Dell XPS 13",
    categoryId: "1",
    salesmanId: "s1",
    price: 12000000,
    quantity: 5,
    unit: "PCS",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    code: "ELEC002",
    name: "Mouse Logitech MX Master",
    categoryId: "1",
    salesmanId: "s2",
    price: 850000,
    quantity: 25,
    unit: "PCS",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    code: "PAK001",
    name: "Kaos Polos Premium",
    categoryId: "2",
    salesmanId: "s1",
    price: 75000,
    quantity: 0,
    unit: "PCS",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockSales: Sale[] = [
  {
    id: "1",
    productId: "1",
    quantity: 1,
    unitPrice: 12000000,
    totalPrice: 12000000,
    saleDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    productId: "2",
    quantity: 3,
    unitPrice: 850000,
    totalPrice: 2550000,
    saleDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
]

const mockPurchases: Purchase[] = [
  {
    id: "p1",
    productId: "1",
    quantity: 5,
    unitPrice: 11000000,
    totalPrice: 55000000,
    purchaseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "p2",
    productId: "2",
    quantity: 25,
    unitPrice: 800000,
    totalPrice: 20000000,
    purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
]

// Initialize storage
export function initializeStorage() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategories))
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALESMEN)) {
    localStorage.setItem(STORAGE_KEYS.SALESMEN, JSON.stringify(mockSalesmen))
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts))
  }
  if (!localStorage.getItem(STORAGE_KEYS.PURCHASES)) {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(mockPurchases))
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(mockSales))
  }
  if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]))
  }
}

// Categories
export function getCategories(): Category[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
  return data ? JSON.parse(data) : []
}

export function addCategory(category: Omit<Category, "id" | "createdAt">): Category {
  const categories = getCategories()
  const newCategory: Category = {
    ...category,
    id: Date.now().toString(),
    createdAt: new Date(),
  }
  categories.push(newCategory)
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  return newCategory
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const categories = getCategories()
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return null
  categories[index] = { ...categories[index], ...updates }
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  return categories[index]
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories()
  const filtered = categories.filter((c) => c.id !== id)
  if (filtered.length === categories.length) return false
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered))
  return true
}

// Products
export function getProducts(): Product[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
  return data ? JSON.parse(data) : []
}

export function addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
  const products = getProducts()
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  products.push(newProduct)
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
  return newProduct
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return null
  products[index] = { ...products[index], ...updates, updatedAt: new Date() }
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
  return products[index]
}

export function deleteProduct(id: string): boolean {
  const products = getProducts()
  const filtered = products.filter((p) => p.id !== id)
  if (filtered.length === products.length) return false
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered))
  return true
}

// Sales
export function getSales(): Sale[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.SALES)
  return data ? JSON.parse(data) : []
}

export function addSale(sale: Omit<Sale, "id">): Sale {
  const sales = getSales()
  const newSale: Sale = {
    ...sale,
    id: Date.now().toString(),
  }
  sales.push(newSale)
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales))
  return newSale
}

// Stock History
export function getStockHistory(): StockHistory[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY)
  return data ? JSON.parse(data) : []
}

export function addStockHistory(history: Omit<StockHistory, "id" | "createdAt">): StockHistory {
  const histories = getStockHistory()
  const newHistory: StockHistory = {
    ...history,
    id: Date.now().toString(),
    createdAt: new Date(),
  }
  histories.push(newHistory)
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(histories))
  return newHistory
}

// Salesmen
export function getSalesmen(): Salesman[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.SALESMEN)
  return data ? JSON.parse(data) : []
}

export function addSalesman(salesman: Omit<Salesman, "id" | "createdAt">): Salesman {
  const salesmen = getSalesmen()
  const newSalesman: Salesman = {
    ...salesman,
    id: Date.now().toString(),
    createdAt: new Date(),
  }
  salesmen.push(newSalesman)
  localStorage.setItem(STORAGE_KEYS.SALESMEN, JSON.stringify(salesmen))
  return newSalesman
}

export function updateSalesman(id: string, updates: Partial<Salesman>): Salesman | null {
  const salesmen = getSalesmen()
  const index = salesmen.findIndex((s) => s.id === id)
  if (index === -1) return null
  salesmen[index] = { ...salesmen[index], ...updates }
  localStorage.setItem(STORAGE_KEYS.SALESMEN, JSON.stringify(salesmen))
  return salesmen[index]
}

export function deleteSalesman(id: string): boolean {
  const salesmen = getSalesmen()
  const filtered = salesmen.filter((s) => s.id !== id)
  if (filtered.length === salesmen.length) return false
  localStorage.setItem(STORAGE_KEYS.SALESMEN, JSON.stringify(filtered))
  return true
}

// Purchases
export function getPurchases(): Purchase[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.PURCHASES)
  return data ? JSON.parse(data) : []
}

export function addPurchase(purchase: Omit<Purchase, "id">): Purchase {
  const purchases = getPurchases()
  const newPurchase: Purchase = {
    ...purchase,
    id: Date.now().toString(),
  }
  purchases.push(newPurchase)
  localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases))

  // Update product quantity
  const product = getProducts().find((p) => p.id === purchase.productId)
  if (product) {
    updateProduct(purchase.productId, {
      quantity: product.quantity + purchase.quantity,
    })
    // Add to stock history
    addStockHistory({
      productId: purchase.productId,
      type: "IN",
      quantity: purchase.quantity,
      notes: `Pembelian - ${purchase.quantity} unit @ Rp${purchase.unitPrice.toLocaleString("id-ID")}`,
    })
  }

  return newPurchase
}

export function deletePurchase(id: string): boolean {
  const purchases = getPurchases()
  const purchase = purchases.find((p) => p.id === id)

  if (!purchase) return false

  // Revert product quantity
  const product = getProducts().find((p) => p.id === purchase.productId)
  if (product) {
    updateProduct(purchase.productId, {
      quantity: Math.max(0, product.quantity - purchase.quantity),
    })
  }

  const filtered = purchases.filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(filtered))
  return true
}

// Statistics
export function getStatistics() {
  const products = getProducts()
  const sales = getSales()

  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0)
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0)
  const totalSales = sales.length

  return { totalProducts, totalStock, totalRevenue, totalSales }
}
