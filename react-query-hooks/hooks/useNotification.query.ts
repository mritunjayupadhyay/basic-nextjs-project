import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import { fetchNotifications } from '@/api/notification.api.service';
import { IEShippingNotification } from '@/interfaces/notification.interface';

export const useNotifications = (): UseQueryResult<IEShippingNotification[], Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: fetchNotifications,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};