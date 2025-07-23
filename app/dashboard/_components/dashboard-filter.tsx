// components/DashboardFilter.tsx
'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  useFilteredCount, 
  useShipmentFilters,
  useSetSearchTerm,
  useSetSelectedType,
  useSetSelectedPOType,
  useSetDateRange,
  useClearDateRange
} from "@/stores/useShipmentFilter.store";
import { CalendarDays, Filter, Search, X } from "lucide-react";

export const DashboardFilter: React.FC = () => {
  // Get filter state from Zustand store
  const filters = useShipmentFilters();
  const filteredCount = useFilteredCount();
  
  // Get individual action hooks
  const setSearchTerm = useSetSearchTerm();
  const setSelectedType = useSetSelectedType();
  const setSelectedPOType = useSetSelectedPOType();
  const setDateRange = useSetDateRange();
  const clearDateRange = useClearDateRange();

  const {
    searchTerm,
    selectedType,
    selectedPOType,
    dateRangeStart,
    dateRangeEnd,
  } = filters;

  // Handle date range changes
  const handleStartDateChange = (start: string) => {
    setDateRange(start, dateRangeEnd);
  };

  const handleEndDateChange = (end: string) => {
    setDateRange(dateRangeStart, end);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by supplier or PO number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Transport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Air">Air</SelectItem>
                  <SelectItem value="Oversea">Oversea</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedPOType} onValueChange={setSelectedPOType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="PO Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All PO Types</SelectItem>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Multiple">Multiple</SelectItem>
                  <SelectItem value="Co-load">Co-load</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filters */}
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              <Input
                type="date"
                placeholder="Start Date"
                value={dateRangeStart}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-36"
              />
              <span className="text-gray-400 text-sm">to</span>
              <Input
                type="date"
                placeholder="End Date"
                value={dateRangeEnd}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-36"
              />
              {(dateRangeStart || dateRangeEnd) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearDateRange}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  title="Clear date range"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Active Date Range Display */}
        {(dateRangeStart || dateRangeEnd) && (
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <CalendarDays className="w-3 h-3 mr-1" />
              ETD Range: {dateRangeStart || 'Any'} to {dateRangeEnd || 'Any'}
            </Badge>
            <span className="text-xs text-gray-500">
              {filteredCount} shipment{filteredCount !== 1 ? 's' : ''} found
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};