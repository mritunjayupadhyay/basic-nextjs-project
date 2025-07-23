// components/DashboardHeader.tsx
import { Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useShipmentStore } from "@/stores/useShipment.store";
import { NotificationCenter } from "@/components/NotificatonCenter";
import { useShipments } from "@/react-query-hooks/hooks/useShipment.query";
import { IEShippingNotification } from "@/interfaces/notification.interface";
import { useUIStore } from "@/stores/useUI.store";
import { useNotificationStore } from "@/stores/useNotification.store";
import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "@/react-query-hooks/hooks/useNotification.query";

export const DashboardHeader: React.FC = () => {
  // Server state from React Query
  const { data: notifications = [] } = useNotifications();
  const { data: shipments = [] } = useShipments();
  const markAsReadMutation = useMarkNotificationAsRead();
  const deleteNotificationMutation = useDeleteNotification();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const { isNotificationPanelOpen, setIsNotificationPanelOpen } =
    useNotificationStore();

  const { setActiveTab, setIsPanelOpen } = useUIStore();
  const { setSelectedShipment } = useShipmentStore();

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: IEShippingNotification) => {
    // Mark as read optimistically
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }

    // Handle shipment selection if notification has poNumber
    if (notification.poNumber) {
      const shipment = shipments.find(
        (s) => s.poNumber === notification.poNumber
      );
      if (shipment) {
        setSelectedShipment(shipment);
        setActiveTab("communication");
        setIsPanelOpen(true);
      }
    }

    // Close notification panel
    setIsNotificationPanelOpen(false);
  };

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotificationMutation.mutate(id);
  };

  // Format current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between">
      {/* Left side - Title and status */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Shipping Management Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-gray-600">
            Track and manage your logistics operations
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Popover
          open={isNotificationPanelOpen}
          onOpenChange={setIsNotificationPanelOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="relative hover:bg-gray-50 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDeleteNotification={handleDeleteNotification}
              onNotificationClick={handleNotificationClick}
              isLoading={
                markAsReadMutation.isPending ||
                deleteNotificationMutation.isPending ||
                markAllAsReadMutation.isPending
              }
            />
          </PopoverContent>
        </Popover>

        {/* Current Date */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {currentDate}
          </span>
        </div>
      </div>
    </div>
  );
};
