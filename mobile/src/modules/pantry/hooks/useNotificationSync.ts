import { useEffect } from 'react';
import { ensureNotificationChannel, ensurePermission, syncItemReminders } from '../../../services/notificationScheduler';
import { useInventoryItemsQuery } from './useInventoryItemsQuery';

export function useNotificationSync(): void {
  const { data } = useInventoryItemsQuery({ status: 'active', limit: 200 });

  useEffect(() => {
    ensureNotificationChannel();
    ensurePermission();
  }, []);

  useEffect(() => {
    if (data) {
      syncItemReminders(data.items);
    }
  }, [data]);
}
