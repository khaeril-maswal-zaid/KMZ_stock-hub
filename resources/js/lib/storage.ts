import type { Product } from '@/lib/types';

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
    router.put(uptKriteria.url(id), updates, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function deleteCategory(id: number) {
    router.delete(destroyKriteria.url(id), {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function addProduct(product: any) {
    router.post(storeProduct.url(), product, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function updateProduct(code: string, updates: Product) {
    router.put(udtProduct.url(code), updates, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function deleteProduct(code: string) {
    router.delete(dltProduct.url(code), {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function transaction(data: any) {
    router.post(storeTransaction.url(), data, {
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
    router.post(storeTransaction.url(), data, {
        onSuccess: () => {
            return data.type + ' Berhasil';
        },
        onError: (err) => {
            console.log(err);

            return err;
        },
    });
}

export function addSalesman(salesman: any) {
    router.post(storeSalesmen.url(), salesman, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function updateSalesman(id: number, updates: any) {
    router.put(uptSalesman.url(id), updates, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function deleteSalesman(id: number) {
    router.delete(dstSalesman.url(id), {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function addPurchase(purchase: any) {
    router.post(storeTransaction().url(), purchase, {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}

export function deletePurchase(id: Number) {
    router.delete(dltTransaksi.url(id), {
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (err) => {
            console.log(err);
        },
    });
}
