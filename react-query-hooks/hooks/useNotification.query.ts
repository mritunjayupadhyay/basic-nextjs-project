import { useMutation, useQuery, UseQueryResult, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import { deleteNotificationAPI, fetchNotifications, markAllNotificationsAsReadAPI, markNotificationAsReadAPI } from '@/api-services/notification.api.service';
import { IEShippingNotification } from '@/interfaces/notification.interface';

export const useNotifications = (): UseQueryResult<IEShippingNotification[], Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: fetchNotifications,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

// IEShippingNotification Mutations
export const useMarkNotificationAsRead = (): UseMutationResult<IEShippingNotification, Error, string> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markNotificationAsReadAPI,
    
    // Optimistic update
    onMutate: async (id: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notifications });
      
      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData<IEShippingNotification[]>(QUERY_KEYS.notifications);
      
      // Optimistically update to the new value
      queryClient.setQueryData<IEShippingNotification[]>(QUERY_KEYS.notifications, (old = []) =>
        old.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      return { previousNotifications };
    },
    
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(QUERY_KEYS.notifications, context.previousNotifications);
      }
    },
    
    // Always refetch after error or success to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });
};

export const useDeleteNotification = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteNotificationAPI,
    
    // Optimistic update
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notifications });
      
      const previousNotifications = queryClient.getQueryData<IEShippingNotification[]>(QUERY_KEYS.notifications);
      
      // Remove notification optimistically
      queryClient.setQueryData<IEShippingNotification[]>(QUERY_KEYS.notifications, (old = []) =>
        old.filter(notification => notification.id !== id)
      );
      
      return { previousNotifications };
    },
    
    onError: (error, id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(QUERY_KEYS.notifications, context.previousNotifications);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });
};

export const useMarkAllNotificationsAsRead = (): UseMutationResult<IEShippingNotification[], Error, void> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markAllNotificationsAsReadAPI,
    
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notifications });
      
      const previousNotifications = queryClient.getQueryData<IEShippingNotification[]>(QUERY_KEYS.notifications);
      
      // Mark all as read optimistically
      queryClient.setQueryData<IEShippingNotification[]>(QUERY_KEYS.notifications, (old = []) =>
        old.map(notification => ({ ...notification, isRead: true }))
      );
      
      return { previousNotifications };
    },
    
    onError: (error, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(QUERY_KEYS.notifications, context.previousNotifications);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });
};