import { IEShippingNotification } from '@/interfaces/notification.interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface NotificationState {
    notifications: IEShippingNotification[];
    isNotificationPanelOpen: boolean;

    // Actions
    setNotifications: (notifications: IEShippingNotification[]) => void;
    setIsNotificationPanelOpen: (isOpen: boolean) => void;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    deleteNotification: (id: string) => void;

    // Computed values
    unreadCount: () => number;
    getNotificationsByType: (type: string) => IEShippingNotification[];
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      isNotificationPanelOpen: false,
      
      setNotifications: (notifications) => 
        set({ notifications }, false, 'setNotifications'),
      
      setIsNotificationPanelOpen: (isNotificationPanelOpen) => 
        set({ isNotificationPanelOpen }, false, 'setIsNotificationPanelOpen'),
      
      markNotificationAsRead: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true } : n
            ),
          }),
          false,
          'markNotificationAsRead'
        ),
      
      markAllNotificationsAsRead: () =>
        set(
          (state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          }),
          false,
          'markAllNotificationsAsRead'
        ),
      
      deleteNotification: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          'deleteNotification'
        ),
      
      // Computed values
      unreadCount: () => get().notifications.filter(n => !n.isRead).length,
      getNotificationsByType: (type) => 
        get().notifications.filter(n => n.type === type),
    }),
    { name: 'notification-store' }
  )
);