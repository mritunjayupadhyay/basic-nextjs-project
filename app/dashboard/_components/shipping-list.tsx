"use client";
import { ColoadAccordion } from "@/components/ColoadAccordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IEShippingShipment } from "@/interfaces/shipment.interface";
import { useShipmentStore } from "@/stores/useShipment.store";
import { useFilteredShipments } from "@/stores/useShipmentFilter.store";
import { useUIStore } from "@/stores/useUI.store";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle,
  CircleCheck,
  CircleDot,
  Clock,
  Copy,
  FileCheck,
  FileText,
  Layers,
  Package,
  Package2,
  Plane,
  Receipt,
  Ship,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export const ShippingList: React.FC = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Air":
        return <Plane className="w-4 h-4" />;
      case "Oversea":
        return <Ship className="w-4 h-4" />;
      case "Truck":
        return <Truck className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPOTypeIcon = (poType: string) => {
    switch (poType) {
      case "Single":
        return <Package className="w-4 h-4" />;
      case "Multiple":
        return <Package2 className="w-4 h-4" />;
      case "Co-load":
        return <Layers className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPOTypeColor = (poType: string) => {
    switch (poType) {
      case "Single":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Multiple":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Co-load":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "confirm":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "preparing":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "in-transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "clearance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "delayed":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPSTStatusColor = (pstStatus: string) => {
    switch (pstStatus) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "in-progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "not-started":
        return "bg-gray-50 text-gray-600 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getPSTStatusIcon = (pstStatus: string) => {
    switch (pstStatus) {
      case "completed":
        return <CircleCheck className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <CircleDot className="w-4 h-4 text-amber-600" />;
      case "not-started":
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPSTStatusText = (pstStatus: string) => {
    switch (pstStatus) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "not-started":
        return "Not Started";
      default:
        return "Unknown";
    }
  };

  const filteredShipments = useFilteredShipments();
  const { setSelectedShipment } = useShipmentStore();
  const { setIsPanelOpen, setCurrentDashboardView, viewModeDashboardShippingList, setViewModeDashboardShippingList } = useUIStore();

  type SortOption =
    | "none"
    | "clearDate-asc"
    | "clearDate-desc"
    | "status-asc"
    | "status-desc";

  const [activePOTypeTab, setActivePOTypeTab] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortOption>("none");
  // Navigation state
  const [selectedPOForPST, setSelectedPOForPST] = useState<string | null>(null);

  const handleShipmentClick = (shipment: IEShippingShipment) => {
    setSelectedShipment(shipment);
    setIsPanelOpen(true);
  };

  const handleCreatePST = (poNumber?: string) => {
    setSelectedPOForPST(poNumber || null);
    setCurrentDashboardView("create-pst");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Details</CardTitle>
      </CardHeader>
      <CardContent>
        {/* PO Type Tabs */}
        <Tabs
          value={activePOTypeTab}
          onValueChange={setActivePOTypeTab}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                All
              </TabsTrigger>
              <TabsTrigger value="Single" className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                Single
              </TabsTrigger>
              <TabsTrigger value="Multiple" className="flex items-center gap-1">
                <Package2 className="w-3 h-3" />
                Multiple
              </TabsTrigger>
              <TabsTrigger value="Co-load" className="flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Co-load
              </TabsTrigger>
            </TabsList>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1">
              <Button
                variant={viewModeDashboardShippingList === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewModeDashboardShippingList("timeline")}
              >
                Timeline
              </Button>
              <Button
                variant={viewModeDashboardShippingList === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewModeDashboardShippingList("table")}
              >
                Table
              </Button>
            </div>
          </div>

          {/* Tab Content for Each PO Type */}
          {["all", "Single", "Multiple", "Co-load"].map((poType) => (
            <TabsContent key={poType} value={poType}>
              <Tabs value={viewModeDashboardShippingList} className="space-y-4">
                <TabsContent value="timeline">
                  {/* Workflow Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Shipment Workflow
                        {poType !== "all" && (
                          <span className="text-sm text-gray-600 ml-2">
                            - {poType} PO ({filteredShipments.length})
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                          <span>PO</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>ETD</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>ETA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Clearance</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {filteredShipments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No shipments found for{" "}
                          {poType === "all"
                            ? "the selected filters"
                            : `${poType} PO type`}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredShipments.map((shipment) => (
                            <Card
                              key={shipment.id}
                              className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => handleShipmentClick(shipment)}
                            >
                              <CardContent className="pt-4">
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                  {/* Shipment Info */}
                                  <div className="lg:col-span-2">
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          {getTypeIcon(shipment.type)}
                                          <span className="text-sm text-gray-900">
                                            {shipment.supplierName}
                                          </span>
                                        </div>
                                        <div className="text-lg text-gray-900 mb-1">
                                          {shipment.poNumber}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {shipment.port}
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <Badge
                                          className={getStatusColor(
                                            shipment.status
                                          )}
                                        >
                                          {shipment.status}
                                        </Badge>
                                        <Badge
                                          className={getPOTypeColor(
                                            shipment.poType
                                          )}
                                        >
                                          <div className="flex items-center gap-1">
                                            {getPOTypeIcon(shipment.poType)}
                                            {shipment.poType}
                                          </div>
                                        </Badge>
                                        {/* PST Status Badge */}
                                        <Badge
                                          className={getPSTStatusColor(
                                            shipment.pstStatus
                                          )}
                                        >
                                          <div className="flex items-center gap-1">
                                            {getPSTStatusIcon(
                                              shipment.pstStatus
                                            )}
                                            <span className="text-xs">
                                              PST{" "}
                                              {getPSTStatusText(
                                                shipment.pstStatus
                                              )}
                                            </span>
                                          </div>
                                        </Badge>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCreatePST(shipment.poNumber);
                                          }}
                                          className="flex items-center gap-1 text-xs h-6 px-2"
                                        >
                                          <FileCheck className="w-3 h-3" />
                                          Create PST
                                        </Button>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-gray-600">
                                          Clear Date:
                                        </span>
                                        <div>{shipment.dateClear}</div>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">
                                          Term:
                                        </span>
                                        <div>{shipment.term}</div>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">
                                          BL/AWB:
                                        </span>
                                        <div>{shipment.blAwbNumber}</div>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">
                                          Container:
                                        </span>
                                        <div>{shipment.qualityContainer}</div>
                                      </div>
                                    </div>

                                    {/* Co-load additional info */}
                                    {shipment.poType === "Co-load" &&
                                      shipment.relatedPOs &&
                                      shipment.relatedPOs.length > 0 && (
                                        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                                          <div className="flex items-center gap-1 mb-1">
                                            <Copy className="w-3 h-3" />
                                            <span className="text-orange-800">
                                              Shared Container POs:
                                            </span>
                                          </div>
                                          <div className="text-orange-700">
                                            {shipment.relatedPOs.join(", ")}
                                          </div>
                                        </div>
                                      )}
                                  </div>

                                  {/* Progress & Status */}
                                  <div className="space-y-3">
                                    <div>
                                      <div className="flex items-center justify-between text-sm mb-1">
                                        <span>Progress</span>
                                        <span>{shipment.progress}%</span>
                                      </div>
                                      <Progress
                                        value={shipment.progress}
                                        className="h-2"
                                      />
                                    </div>

                                    <div className="flex items-center gap-4 text-sm">
                                      <div className="flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        Permit:
                                        {shipment.permitStatus ? (
                                          <CheckCircle className="w-3 h-3 text-green-600" />
                                        ) : (
                                          <XCircle className="w-3 h-3 text-red-600" />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Receipt className="w-3 h-3" />
                                        Tax:
                                        {shipment.taxStatus ? (
                                          <CheckCircle className="w-3 h-3 text-green-600" />
                                        ) : (
                                          <XCircle className="w-3 h-3 text-red-600" />
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Timeline */}
                                  <div className="space-y-2">
                                    <div className="text-sm text-gray-600 mb-2">
                                      Timeline
                                    </div>
                                    <div className="space-y-1 text-xs">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                        <span>PO Created</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>ETD: {shipment.etd}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span>ETA: {shipment.eta}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={`w-2 h-2 rounded-full ${
                                            shipment.status === "completed"
                                              ? "bg-green-500"
                                              : "bg-gray-300"
                                          }`}
                                        ></div>
                                        <span>Clear: {shipment.dateClear}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="table">
                  {/* Data Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div>
                          Shipment Details Table
                          {poType !== "all" && (
                            <span className="text-sm text-gray-600 ml-2">
                              - {poType} PO ({filteredShipments.length})
                            </span>
                          )}
                        </div>
                        {sortOption !== "none" && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Sorted by:</span>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              <div className="flex items-center gap-1">
                                {sortOption === "clearDate-asc" && (
                                  <>
                                    <ArrowUp className="w-3 h-3" />
                                    Clear Date (Nearest First)
                                  </>
                                )}
                                {sortOption === "clearDate-desc" && (
                                  <>
                                    <ArrowDown className="w-3 h-3" />
                                    Clear Date (Furthest First)
                                  </>
                                )}
                                {sortOption === "status-asc" && (
                                  <>
                                    <ArrowUp className="w-3 h-3" />
                                    Status (Submitted → Completed)
                                  </>
                                )}
                                {sortOption === "status-desc" && (
                                  <>
                                    <ArrowDown className="w-3 h-3" />
                                    Status (Completed → Submitted)
                                  </>
                                )}
                              </div>
                            </Badge>
                          </div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {filteredShipments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No shipments found for{" "}
                          {poType === "all"
                            ? "the selected filters"
                            : `${poType} PO type`}
                        </div>
                      ) : (
                        <>
                          {/* Co-load Accordion Table */}
                          {poType === "Co-load" ? (
                            <ColoadAccordion
                              shipments={filteredShipments}
                              onShipmentClick={handleShipmentClick}
                              getStatusColor={getStatusColor}
                              getPOTypeColor={getPOTypeColor}
                              getPOTypeIcon={getPOTypeIcon}
                            />
                          ) : (
                            /* Regular Table for Non Co-load */
                            <div className="overflow-x-auto border rounded-lg">
                              <Table className="relative">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="sticky left-0 z-20 bg-white border-r min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                      Supplier
                                    </TableHead>
                                    <TableHead className="sticky left-[200px] z-20 bg-white border-r min-w-[150px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                      PO Number
                                    </TableHead>
                                    <TableHead className="min-w-[140px]">
                                      Transport Type
                                    </TableHead>
                                    <TableHead className="min-w-[120px]">
                                      PO Type
                                    </TableHead>
                                    <TableHead className="min-w-[110px]">
                                      PST Status
                                    </TableHead>
                                    <TableHead className="min-w-[160px]">
                                      Port
                                    </TableHead>
                                    <TableHead className="min-w-[100px]">
                                      ETD
                                    </TableHead>
                                    <TableHead className="min-w-[100px]">
                                      ETA
                                    </TableHead>
                                    <TableHead className="min-w-[120px]">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            className="h-auto p-0 hover:bg-transparent"
                                          >
                                            <div className="flex items-center gap-2">
                                              <span>Clear Date</span>
                                              {sortOption.startsWith(
                                                "clearDate"
                                              ) ? (
                                                sortOption ===
                                                "clearDate-asc" ? (
                                                  <ArrowUp className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                  <ArrowDown className="w-4 h-4 text-blue-600" />
                                                )
                                              ) : (
                                                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                                              )}
                                            </div>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                          <DropdownMenuItem
                                            onClick={() =>
                                              setSortOption("clearDate-asc")
                                            }
                                            className="flex items-center gap-2"
                                          >
                                            <ArrowUp className="w-4 h-4" />
                                            Nearest First
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              setSortOption("clearDate-desc")
                                            }
                                            className="flex items-center gap-2"
                                          >
                                            <ArrowDown className="w-4 h-4" />
                                            Furthest First
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              setSortOption("none")
                                            }
                                            className="flex items-center gap-2"
                                          >
                                            <ArrowUpDown className="w-4 h-4" />
                                            No Sort
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableHead>
                                    <TableHead className="min-w-[100px]">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            className="h-auto p-0 hover:bg-transparent"
                                          >
                                            <div className="flex items-center gap-2">
                                              <span>Status</span>
                                              {sortOption.startsWith(
                                                "status"
                                              ) ? (
                                                sortOption === "status-asc" ? (
                                                  <ArrowUp className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                  <ArrowDown className="w-4 h-4 text-blue-600" />
                                                )
                                              ) : (
                                                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                                              )}
                                            </div>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                          <DropdownMenuItem
                                            onClick={() =>
                                              setSortOption("status-asc")
                                            }
                                            className="flex items-center gap-2"
                                          >
                                            <ArrowUp className="w-4 h-4" />
                                            By Progress (Submitted → Completed)
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              setSortOption("status-desc")
                                            }
                                            className="flex items-center gap-2"
                                          >
                                            <ArrowDown className="w-4 h-4" />
                                            By Progress (Completed → Submitted)
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              setSortOption("none")
                                            }
                                            className="flex items-center gap-2"
                                          >
                                            <ArrowUpDown className="w-4 h-4" />
                                            No Sort
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableHead>
                                    <TableHead className="min-w-[80px]">
                                      Permit
                                    </TableHead>
                                    <TableHead className="min-w-[80px]">
                                      Tax
                                    </TableHead>
                                    <TableHead className="min-w-[140px]">
                                      BL/AWB
                                    </TableHead>
                                    <TableHead className="min-w-[100px]">
                                      Actions
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {filteredShipments.map((shipment) => (
                                    <TableRow
                                      key={shipment.id}
                                      className="cursor-pointer hover:bg-gray-50"
                                      onClick={() =>
                                        handleShipmentClick(shipment)
                                      }
                                    >
                                      <TableCell className="sticky left-0 z-10 bg-white border-r min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                        <div
                                          className="truncate pr-2"
                                          title={shipment.supplierName}
                                        >
                                          {shipment.supplierName}
                                        </div>
                                      </TableCell>
                                      <TableCell className="sticky left-[200px] z-10 bg-white border-r min-w-[150px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                        <div className="flex items-center gap-2 pr-2">
                                          <div
                                            className="truncate text-blue-600"
                                            title={shipment.poNumber}
                                          >
                                            {shipment.poNumber}
                                          </div>
                                          {shipment.poType === "Co-load" &&
                                            shipment.relatedPOs &&
                                            shipment.relatedPOs.length > 0 && (
                                              <Popover>
                                                <PopoverTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2 py-0 text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                                    onClick={(e) =>
                                                      e.stopPropagation()
                                                    }
                                                  >
                                                    See More
                                                  </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                  className="w-64 p-3"
                                                  align="start"
                                                >
                                                  <div className="space-y-2">
                                                    <div className="flex items-center gap-2 pb-2 border-b">
                                                      <Layers className="w-4 h-4 text-orange-600" />
                                                      <span className="text-sm font-medium text-gray-900">
                                                        Co-load Container POs
                                                      </span>
                                                    </div>
                                                    <div className="text-xs text-gray-600 mb-2">
                                                      This container includes
                                                      the following POs:
                                                    </div>
                                                    <div className="space-y-1">
                                                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded border border-orange-200">
                                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                        <span className="text-sm font-medium text-orange-800">
                                                          {shipment.poNumber}
                                                        </span>
                                                        <Badge
                                                          variant="outline"
                                                          className="text-xs h-4 px-1 text-orange-700 border-orange-300"
                                                        >
                                                          Current
                                                        </Badge>
                                                      </div>
                                                      {shipment.relatedPOs.map(
                                                        (
                                                          relatedPO: string,
                                                          index: number
                                                        ) => (
                                                          <div
                                                            key={index}
                                                            className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                                                          >
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                            <span className="text-sm text-gray-700">
                                                              {relatedPO}
                                                            </span>
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                    <div className="pt-2 border-t text-xs text-gray-500">
                                                      Total:{" "}
                                                      {1 +
                                                        shipment.relatedPOs
                                                          .length}{" "}
                                                      POs sharing this container
                                                    </div>
                                                  </div>
                                                </PopoverContent>
                                              </Popover>
                                            )}
                                        </div>
                                      </TableCell>
                                      <TableCell className="min-w-[140px]">
                                        <div className="flex items-center gap-1">
                                          {getTypeIcon(shipment.type)}
                                          {shipment.type}
                                        </div>
                                      </TableCell>
                                      <TableCell className="min-w-[120px]">
                                        <Badge
                                          className={getPOTypeColor(
                                            shipment.poType
                                          )}
                                        >
                                          <div className="flex items-center gap-1">
                                            {getPOTypeIcon(shipment.poType)}
                                            {shipment.poType}
                                          </div>
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="min-w-[110px]">
                                        <div className="flex items-center gap-1">
                                          {getPSTStatusIcon(shipment.pstStatus)}
                                          <span
                                            className={`text-sm font-normal ${
                                              shipment.pstStatus === "completed"
                                                ? "text-green-600"
                                                : shipment.pstStatus ===
                                                  "in-progress"
                                                ? "text-amber-600"
                                                : "text-gray-400"
                                            }`}
                                          >
                                            {getPSTStatusText(
                                              shipment.pstStatus
                                            )}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="min-w-[160px]">
                                        <div
                                          className="truncate"
                                          title={shipment.port}
                                        >
                                          {shipment.port}
                                        </div>
                                      </TableCell>
                                      <TableCell className="min-w-[100px]">
                                        {shipment.etd}
                                      </TableCell>
                                      <TableCell className="min-w-[100px]">
                                        {shipment.eta}
                                      </TableCell>
                                      <TableCell className="min-w-[120px]">
                                        {shipment.dateClear}
                                      </TableCell>
                                      <TableCell className="min-w-[100px]">
                                        <Badge
                                          className={getStatusColor(
                                            shipment.status
                                          )}
                                        >
                                          {shipment.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="min-w-[80px] text-center">
                                        {shipment.permitStatus ? (
                                          <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                                        ) : (
                                          <XCircle className="w-4 h-4 text-red-600 mx-auto" />
                                        )}
                                      </TableCell>
                                      <TableCell className="min-w-[80px] text-center">
                                        {shipment.taxStatus ? (
                                          <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                                        ) : (
                                          <XCircle className="w-4 h-4 text-red-600 mx-auto" />
                                        )}
                                      </TableCell>
                                      <TableCell className="min-w-[140px]">
                                        <div
                                          className="truncate"
                                          title={shipment.blAwbNumber}
                                        >
                                          {shipment.blAwbNumber}
                                        </div>
                                      </TableCell>
                                      <TableCell className="min-w-[100px]">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCreatePST(shipment.poNumber);
                                          }}
                                          className="flex items-center gap-1 text-xs h-7 px-2"
                                        >
                                          <FileCheck className="w-3 h-3" />
                                          PST
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
