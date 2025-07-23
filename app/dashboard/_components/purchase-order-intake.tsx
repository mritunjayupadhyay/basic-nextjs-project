"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useShipments } from "@/react-query-hooks/hooks/useShipment.query";
import { Activity, CalendarDays, Package, PackageCheck, Timer, TrendingUp } from "lucide-react";
import { useMemo } from "react";

export const PurchaseOrderIntake: React.FC = () => {
    const { data: shipments = [] } = useShipments();
  const kpis = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Get start of current week (Monday)
    const currentDate = new Date();
    const monday = new Date(currentDate);
    monday.setDate(
      currentDate.getDate() -
        (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1)
    );
    const weekStart = monday.toISOString().split("T")[0];

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const weekEnd = sunday.toISOString().split("T")[0];

    // PO counts by timing
    const poToday = shipments.filter((s) => s.etd === today).length;
    const poNext7Days = shipments.filter(
      (s) => s.etd > today && s.etd <= weekFromNow
    ).length;

    // PST tracking - POs in preparing status
    const pstTotal = shipments.filter(
      (s) => s.status === "preparing"
    ).length;
    const pstCompleted = shipments.filter(
      (s) => s.status === "preparing" && s.progress >= 80
    ).length;
    const pstRemaining = pstTotal - pstCompleted;

    // PSW tracking - POs scheduled for preparation this week
    const pswThisWeek = shipments.filter(
      (s) => s.status === "preparing" && s.etd >= weekStart && s.etd <= weekEnd
    ).length;

    return {
      poToday,
      poNext7Days,
      pstTotal,
      pstCompleted,
      pstRemaining,
      pswThisWeek,
    };
  }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Purchase Order Intake
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor incoming PO volumes that require preparation
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Updated 2 minutes ago</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Compact PO Card */}
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">PO</h3>
                  <p className="text-xs text-gray-600">Purchase Orders</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  {kpis.poToday + kpis.poNext7Days}
                </div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">
                    Today
                  </span>
                </div>
                <span className="text-sm font-bold text-red-600">
                  {kpis.poToday}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">
                    Next 7 days
                  </span>
                </div>
                <span className="text-sm font-bold text-orange-600">
                  {kpis.poNext7Days}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <TrendingUp className="w-3 h-3" />
                <span>+2 vs yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <PackageCheck className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">PST</h3>
                      <p className="text-xs text-gray-600">Prepare for Shipping</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">{kpis.pstTotal}</div>
                    <div className="text-xs text-gray-500">Total POs</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">Completed</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">{kpis.pstCompleted}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">Remaining</span>
                    </div>
                    <span className="text-sm font-bold text-gray-600">{kpis.pstRemaining}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Timer className="w-3 h-3" />
                      <span>Progress</span>
                    </div>
                    <div className="text-xs font-medium text-amber-600">
                      {kpis.pstTotal > 0 ? Math.round((kpis.pstCompleted / kpis.pstTotal) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">PSW</h3>
                      <p className="text-xs text-gray-600">Weekly Preparation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">{kpis.pswThisWeek}</div>
                    <div className="text-xs text-gray-500">This Week</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">Scheduled</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">{kpis.pswThisWeek}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">Planning</span>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">{Math.max(0, kpis.pswThisWeek - 2)}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <TrendingUp className="w-3 h-3" />
                    <span>+3 vs last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
      </div>
    </div>
  );
};
