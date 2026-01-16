export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface PaginationLinks {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
    links: PaginationLinks;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    created_at: Date;
}

export interface Salesman {
    id: number;
    name: string;
    code: string;
    email?: string;
    phone?: string;
    created_at: string;
}

export interface Product {
    name: string;
    kategori_barang_id: number;
    unit: 'PCS' | 'KOLI';
    quantity: number;
    code?: string;
    id?: number;
    category?: Category;
}

export interface Purchase {
    id: number;
    barang_id: number;
    barang: Product;
    quantity: number;
    unit_price: number;
    total_price: number;
    date_transaction: string;
}

export interface Sale {
    id: number;
    barang: Product;
    barang_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    date_transaction: string;
}

export interface StockHistory {
    id: number;
    productId: string;
    type: 'IN' | 'OUT';
    quantity: number;
    notes?: string;
    createdAt: Date;
}
