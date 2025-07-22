export interface IEShippingNotification {
  id: string;
  type: "mention" | "comment" | "system" | "action" | "update";
  title: string;
  message: string;
  poNumber: string;
  author?: string; // Optional since system notifications don't have authors
  timestamp: string; // ISO date string
  isRead: boolean;
  priority: "low" | "medium" | "high";
  actionRequired?: boolean; // Optional since not all notifications require action
}