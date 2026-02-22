export const IOR_DASHBOARD_STATS = {
    total_orders: 142,
    active_shipments: 28,
    customs_pending: 12,
    warehouse_items: 85,
    revenue: {
        total: 1250400,
        monthly_growth: 12.5
    }
};

export const IOR_FOREIGN_ORDERS = [
    {
        id: "1",
        order_number: "ORD-9921",
        product_name: "iPhone 15 Pro Max",
        customer_name: "John Doe",
        marketplace: "Amazon US",
        price_usd: 1099,
        quantity: 1,
        amount_bdt: 131880,
        status: "processing",
        created_at: "2024-02-21T10:00:00Z"
    },
    {
        id: "2",
        order_number: "ORD-9922",
        product_name: "Sony WH-1000XM5",
        customer_name: "Jane Smith",
        marketplace: "eBay",
        price_usd: 348,
        quantity: 2,
        amount_bdt: 83520,
        status: "shipped",
        created_at: "2024-02-20T14:30:00Z"
    },
    {
        id: "3",
        order_number: "ORD-9923",
        product_name: "MacBook Air M2",
        customer_name: "Alice Brown",
        marketplace: "Amazon US",
        price_usd: 999,
        quantity: 1,
        amount_bdt: 119880,
        status: "warehouse",
        created_at: "2024-02-19T09:15:00Z"
    },
    {
        id: "4",
        order_number: "ORD-9924",
        product_name: "Nike Air Max 270",
        customer_name: "Bob Wilson",
        marketplace: "Walmart",
        price_usd: 150,
        quantity: 3,
        amount_bdt: 54000,
        status: "delivered",
        created_at: "2024-02-18T16:45:00Z"
    }
];

export const IOR_WAREHOUSE_ITEMS = [
    {
        id: 1,
        product_name: "iPhone 15 Pro Max",
        order_number: "ORD-9921",
        location: "A1-B2",
        weight: "0.5kg",
        status: "received",
        shipment_batch_id: null
    },
    {
        id: 2,
        product_name: "Sony WH-1000XM5",
        order_number: "ORD-9922",
        location: "C3-D4",
        weight: "1.2kg",
        status: "batched",
        shipment_batch_id: "B-101"
    }
];

export const IOR_CUSTOMS_DOCS = [
    {
        id: "DOC-001",
        name: "Commercial Invoice",
        type: "invoice",
        status: "verified",
        size: "1.2 MB",
        updated_at: "2024-02-21T10:00:00Z"
    },
    {
        id: "DOC-002",
        name: "Packing List",
        type: "packing_list",
        status: "pending",
        size: "0.8 MB",
        updated_at: "2024-02-21T11:00:00Z"
    },
    {
        id: "DOC-003",
        name: "Bill of Entry",
        type: "boe",
        status: "missing",
        size: "-",
        updated_at: "-"
    }
];

export const IOR_BESTSELLERS = [
    {
        id: 1,
        title: "Apple AirPods Pro (2nd Generation)",
        marketplace: "amazon",
        price_usd: 189.99,
        category: "Electronics",
        image_url: ""
    },
    {
        id: 2,
        title: "Logitech MX Master 3S Wireless Mouse",
        marketplace: "ebay",
        price_usd: 99.00,
        category: "Computing",
        image_url: ""
    }
];
