import type {
    Category,
    Product,
    Purchase,
    Sale,
    Salesman,
    StockHistory,
} from '@/lib/types';

import {
    destroy as dltProduct,
    store as storeProduct,
    update as udtProduct,
} from '@/routes/product';

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

import {
    destroy as dltTransaksi,
    store as storeTransaction,
} from '@/routes/transaction';
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

export function updateProduct(code: string, updates: Product) {
    router.put(udtProduct(code).url, updates, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function deleteProduct(code: string) {
    router.delete(dltProduct(code).url, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
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

export function deletePurchase(id: Number) {
    router.delete(dltTransaksi(id).url, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function getSalesThisMonth(): Sale[] {
    const sales = getSales();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return sales.filter((s) => new Date(s.saleDate) >= startOfMonth);
}

export function getPurchasesThisMonth(): Purchase[] {
    const purchases = getPurchases();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return purchases.filter((p) => new Date(p.purchaseDate) >= startOfMonth);
}

export function getSalesPerMonth(): {
    month: string;
    sales: number;
    purchases: number;
}[] {
    const sales = getSales();
    const purchases = getPurchases();
    const monthMap = new Map<string, { sales: number; purchases: number }>();

    // Process sales
    sales.forEach((s) => {
        const date = new Date(s.saleDate);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const current = monthMap.get(key) || { sales: 0, purchases: 0 };
        monthMap.set(key, { ...current, sales: current.sales + s.totalPrice });
    });

    // Process purchases
    purchases.forEach((p) => {
        const date = new Date(p.purchaseDate);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const current = monthMap.get(key) || { sales: 0, purchases: 0 };
        monthMap.set(key, {
            ...current,
            purchases: current.purchases + p.totalPrice,
        });
    });

    // Convert to array and sort by month
    const sorted = Array.from(monthMap.entries())
        .sort()
        .slice(-6)
        .map(([key, value]) => {
            const [year, month] = key.split('-');
            const monthNames = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ];
            return {
                month: monthNames[Number.parseInt(month) - 1],
                ...value,
            };
        });

    return sorted;
}

export function getTopProductsByQuantity(): {
    productId: string;
    productName: string;
    quantity: number;
}[] {
    const history = getStockHistory();
    const products = getProducts();
    const outMap = new Map<string, number>();

    history
        .filter((h) => h.type === 'OUT')
        .forEach((h) => {
            outMap.set(
                h.productId,
                (outMap.get(h.productId) || 0) + h.quantity,
            );
        });

    return Array.from(outMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([productId, quantity]) => {
            const product = products.find((p) => p.id === productId);
            return {
                productId,
                productName: product?.name || 'Unknown',
                quantity,
            };
        });
}

export function getTransactionsByCategory(): {
    category: string;
    count: number;
}[] {
    const sales = getSales();
    const purchases = getPurchases();
    const products = getProducts();
    const categories = getCategories();
    const categoryMap = new Map<string, number>();

    // Count sales
    sales.forEach((s) => {
        const product = products.find((p) => p.id === s.productId);
        if (product) {
            const category = categories.find(
                (c) => c.id === product.categoryId,
            );
            if (category) {
                categoryMap.set(
                    category.name,
                    (categoryMap.get(category.name) || 0) + 1,
                );
            }
        }
    });

    // Count purchases
    purchases.forEach((p) => {
        const product = products.find((pr) => pr.id === p.productId);
        if (product) {
            const category = categories.find(
                (c) => c.id === product.categoryId,
            );
            if (category) {
                categoryMap.set(
                    category.name,
                    (categoryMap.get(category.name) || 0) + 1,
                );
            }
        }
    });

    return Array.from(categoryMap.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
}

export function getAllTransactions(): (
    | (Sale & { type: 'SALE'; productName: string })
    | (Purchase & { type: 'PURCHASE'; productName: string })
)[] {
    const sales = getSales();
    const purchases = getPurchases();
    const products = getProducts();

    const allTransactions = [
        ...sales.map((s) => ({
            ...s,
            type: 'SALE' as const,
            productName:
                products.find((p) => p.id === s.productId)?.name || 'Unknown',
        })),
        ...purchases.map((p) => ({
            ...p,
            type: 'PURCHASE' as const,
            productName:
                products.find((pr) => pr.id === p.productId)?.name || 'Unknown',
        })),
    ];

    return allTransactions.sort((a, b) => {
        const dateA = new Date(a.type === 'SALE' ? a.saleDate : a.purchaseDate);
        const dateB = new Date(b.type === 'SALE' ? b.saleDate : b.purchaseDate);
        return dateB.getTime() - dateA.getTime();
    });
}
