import type {
    Category,
    Product,
    Purchase,
    Sale,
    Salesman,
    StockHistory,
} from '@/lib/types';

import { store as storeProduct } from '@/routes/product';

import {
    destroy as destroyKriteria,
    store as storeKriteria,
    update as uptKriteria,
} from '@/routes/categorie';

import {
    destroy as dstSalesman,
    store as storeSalesmen,
    update as uptSalesman,
} from '@/routes/salesmen';

import { store as storeTransaction } from '@/routes/transaction';
import { router } from '@inertiajs/react';

const STORAGE_KEYS = {
    CATEGORIES: 'stock_categories',
    PRODUCTS: 'stock_products',
    SALES: 'stock_sales',
    PURCHASES: 'stock_purchases',
    HISTORY: 'stock_history',
    SALESMEN: 'stock_salesmen',
};

// Categories
export function getCategories(): Category[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
}

export function addCategory(data: any) {
    router.post(storeKriteria().url, data, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function updateCategory(id: number, updates: any) {
    router.put(uptKriteria(id).url, updates, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function deleteCategory(id: number) {
    router.delete(destroyKriteria(id).url, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

// Products
export function getProducts(): Product[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
}

export function addProduct(product: any) {
    router.post(storeProduct().url, product, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function updateProduct(
    id: string,
    updates: Partial<Product>,
): Product | null {
    const products = getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, updatedAt: new Date() };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return products[index];
}

export function deleteProduct(id: string): boolean {
    const products = getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    return true;
}

// Sales
export function getSales(): Sale[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    return data ? JSON.parse(data) : [];
}

export function transaction(data: any) {
    router.post(storeTransaction().url, data, {
        onSuccess: () => {
            return data.type + ' Berhasil';
        },
        onError: (err) => {
            console.log(err);

            return err;
        },
    });
}

export function transactionMassal(data: any) {
    router.post(storeTransaction().url, data, {
        onSuccess: () => {
            return data.type + ' Berhasil';
        },
        onError: (err) => {
            console.log(err);

            return err;
        },
    });
}

// Stock History
export function getStockHistory(): StockHistory[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
}

export function addStockHistory(
    history: Omit<StockHistory, 'id' | 'createdAt'>,
): StockHistory {
    const histories = getStockHistory();
    const newHistory: StockHistory = {
        ...history,
        id: Date.now().toString(),
        createdAt: new Date(),
    };
    histories.push(newHistory);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(histories));
    return newHistory;
}

// Salesmen
export function getSalesmen(): Salesman[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.SALESMEN);
    return data ? JSON.parse(data) : [];
}

export function addSalesman(salesman: any) {
    router.post(storeSalesmen().url, salesman, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function updateSalesman(id: number, updates: any) {
    router.put(uptSalesman(id).url, updates, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function deleteSalesman(id: number) {
    router.delete(dstSalesman(id).url, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

// Purchases
export function getPurchases(): Purchase[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    return data ? JSON.parse(data) : [];
}

export function addPurchase(purchase: any) {
    router.post(storeTransaction().url, purchase, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function deletePurchase(id: string): boolean {
    const purchases = getPurchases();
    const purchase = purchases.find((p) => p.id === id);

    if (!purchase) return false;

    // Revert product quantity
    const product = getProducts().find((p) => p.id === purchase.productId);
    if (product) {
        updateProduct(purchase.productId, {
            quantity: Math.max(0, product.quantity - purchase.quantity),
        });
    }

    const filtered = purchases.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(filtered));
    return true;
}

// Statistics
export function getStatistics() {
    const products = getProducts();
    const sales = getSales();

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
    const totalSales = sales.length;

    return { totalProducts, totalStock, totalRevenue, totalSales };
}
