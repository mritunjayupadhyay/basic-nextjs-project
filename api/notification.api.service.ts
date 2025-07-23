import { IEShippingNotification } from "@/interfaces/notification.interface";

// Mock data for notifications
const mockNotifications: IEShippingNotification[] = [
  {
    id: "n1",
    type: "mention" as const,
    title: "You were mentioned in PO-2025-001",
    message:
      "Sarah Chen: @Mike Rodriguez please verify the refrigeration unit.",
    poNumber: "PO-2025-001",
    author: "Sarah Chen",
    timestamp: "2025-07-04T10:30:00Z",
    isRead: false,
    priority: "medium" as const,
    actionRequired: true,
  },
  {
    id: "n2",
    type: "comment" as const,
    title: "New comment on PO-2025-002",
    message:
      "Jennifer Kim: Documentation review completed. Tax clearance pending.",
    poNumber: "PO-2025-002",
    author: "Jennifer Kim",
    timestamp: "2025-07-04T09:00:00Z",
    isRead: false,
    priority: "high" as const,
    actionRequired: true,
  },
  {
    id: "n3",
    type: "system" as const,
    title: "Shipment status updated",
    message: "PO-2025-001 status changed to In Transit",
    poNumber: "PO-2025-001",
    timestamp: "2025-07-04T12:00:00Z",
    isRead: true,
    priority: "low" as const,
  },
  {
    id: "n4",
    type: "action" as const,
    title: "Urgent: Permit expiring soon",
    message: "PO-2025-004 permit expires in 2 days. Renewal required.",
    poNumber: "PO-2025-004",
    timestamp: "2025-07-04T08:00:00Z",
    isRead: false,
    priority: "high" as const,
    actionRequired: true,
  },
  {
    id: "n5",
    type: "update" as const,
    title: "Delivery completed",
    message: "PO-2025-003 has been successfully delivered.",
    poNumber: "PO-2025-003",
    timestamp: "2025-07-03T15:30:00Z",
    isRead: true,
    priority: "low" as const,
  },
];

// API functions
export const fetchNotifications = async (): Promise<IEShippingNotification[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockNotifications;
};

// Additional API functions for mutations
export const markNotificationAsReadAPI = async (id: string): Promise<IEShippingNotification> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find and update the notification in mock data
  const notification = mockNotifications.find(n => n.id === id);
  if (!notification) {
    throw new Error('Notification not found');
  }
  
  return { ...notification, isRead: true };
};

export const markAllNotificationsAsReadAPI = async (): Promise<IEShippingNotification[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Update all notifications in mock data
  const updatedNotifications = mockNotifications.map(n => ({ ...n, isRead: true }));
  mockNotifications.splice(0, mockNotifications.length, ...updatedNotifications);
  
  return updatedNotifications;
};

export const deleteNotificationAPI = async (id: string): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockNotifications.findIndex(n => n.id === id);
  if (index === -1) {
    throw new Error('Notification not found');
  }
  
  mockNotifications.splice(index, 1);
};

export const runtime = 'edge';
