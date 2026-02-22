import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import api from '@/lib/api';
import { toast } from 'sonner';

export const usePosSync = () => {
    const pendingOrders = useLiveQuery(
        () => db.orders.where('status').equals('pending').toArray()
    );

    useEffect(() => {
        const syncOrders = async () => {
            if (!pendingOrders || pendingOrders.length === 0) return;

            // Check for internet connection
            if (!navigator.onLine) return;

            console.log(`Syncing ${pendingOrders.length} pending orders...`);

            for (const order of pendingOrders) {
                try {
                    const response = await api.post('/api/pos/sync-order', order);

                    if (response.data.success) {
                        await db.orders.update(order.id!, {
                            status: 'synced',
                            zatcaData: response.data.zatca_qr // Store ZATCA QR from server
                        });
                    }
                } catch (error) {
                    console.error(`Failed to sync order ${order.tempId}:`, error);
                }
            }
        };

        // Attempt sync when online status changes or when pendingOrders updates
        window.addEventListener('online', syncOrders);
        syncOrders();

        return () => window.removeEventListener('online', syncOrders);
    }, [pendingOrders]);

    return {
        pendingCount: pendingOrders?.length || 0,
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
    };
};
