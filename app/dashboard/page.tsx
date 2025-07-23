'use client';
import { DashboardHeader } from "./_components/dashboard-header";
import { PurchaseOrderIntake } from "./_components/purchase-order-intake";
import { DashboardFilter } from "./_components/dashboard-filter";
import { ShippingList } from "./_components/shipping-list";
import { useShipmentDataSync } from "@/hooks/useShipmentDataSync.hook";

export default function Dashboard() {
  useShipmentDataSync();
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader />
        <PurchaseOrderIntake />
        <DashboardFilter />
        <ShippingList /> 
      </div>
    </div>
  );
}
