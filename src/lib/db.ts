import Dexie, { Table } from 'dexie';

export interface OfflineOrder {
    id?: number;
    tempId: string;
    items: any[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: string;
    paymentDetails: any;
    status: 'pending' | 'synced' | 'failed';
    createdAt: number;
    branchId: number;
    staffId: number;
    customerData?: any;
    zatcaData?: any;
}

export interface OfflineProduct {
    id: string;
    name: string;
    sku: string;
    barcode: string;
    price: number;
    stock: number;
    category: string;
    image: string;
    updatedAt: number;
}

export class PosDatabase extends Dexie {
    orders!: Table<OfflineOrder>;
    products!: Table<OfflineProduct>;

    constructor() {
        super('PosDatabase');
        this.version(1).stores({
            orders: '++id, tempId, status, createdAt, branchId',
            products: 'id, barcode, category, sku'
        });
    }
}

export const db = new PosDatabase();
