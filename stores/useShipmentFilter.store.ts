// stores/useShipmentFilterStore.ts
import { IEShippingShipment } from '@/interfaces/shipment.interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ShipmentFilters {
  searchTerm: string;
  selectedType: string;
  selectedPOType: string;
  activePOTypeTab: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  sortOption: string;
}

export interface ShipmentFilterState {
  // Filter values
  filters: ShipmentFilters;
  
  // Computed/derived state
  filteredShipments: IEShippingShipment[];
  filteredCount: number;
  
  // Actions
  setSearchTerm: (searchTerm: string) => void;
  setSelectedType: (type: string) => void;
  setSelectedPOType: (poType: string) => void;
  setActivePOTypeTab: (tab: string) => void;
  setDateRange: (start: string, end: string) => void;
  setSortOption: (option: string) => void;
  clearDateRange: () => void;
  clearAllFilters: () => void;
  
  // Internal action to update filtered results
  updateFilteredShipments: (allShipments: IEShippingShipment[]) => void;
}

const initialFilters: ShipmentFilters = {
  searchTerm: '',
  selectedType: 'all',
  selectedPOType: 'all',
  activePOTypeTab: 'all',
  dateRangeStart: '',
  dateRangeEnd: '',
  sortOption: 'none',
};

// Status priority for sorting
const statusPriority = {
  'Pending': 1,
  'In Progress': 2,
  'In Transit': 3,
  'Customs Clearance': 4,
  'Out for Delivery': 5,
  'Delivered': 6,
  'Cancelled': 7,
};

export const useShipmentFilterStore = create<ShipmentFilterState>()(
  devtools(
    (set, get) => ({
      // Initial state
      filters: initialFilters,
      filteredShipments: [],
      filteredCount: 0,
      
      // Filter actions
      setSearchTerm: (searchTerm) => {
        set(
          (state) => ({
            filters: { ...state.filters, searchTerm },
          }),
          false,
          'setSearchTerm'
        );
        // Trigger filtering after state update
        const { filteredShipments } = get();
        get().updateFilteredShipments(filteredShipments);
      },
      
      setSelectedType: (selectedType) => {
        set(
          (state) => ({
            filters: { ...state.filters, selectedType },
          }),
          false,
          'setSelectedType'
        );
        const { filteredShipments } = get();
        get().updateFilteredShipments(filteredShipments);
      },
      
      setSelectedPOType: (selectedPOType) => {
        set(
          (state) => ({
            filters: { ...state.filters, selectedPOType },
          }),
          false,
          'setSelectedPOType'
        );
        const { filteredShipments } = get();
        get().updateFilteredShipments(filteredShipments);
      },
      
      setActivePOTypeTab: (activePOTypeTab) => {
        set(
          (state) => ({
            filters: { ...state.filters, activePOTypeTab },
          }),
          false,
          'setActivePOTypeTab'
        );
        const { filteredShipments } = get();
        get().updateFilteredShipments(filteredShipments);
      },
      
      setDateRange: (dateRangeStart, dateRangeEnd) => {
        set(
          (state) => ({
            filters: { ...state.filters, dateRangeStart, dateRangeEnd },
          }),
          false,
          'setDateRange'
        );
        const { filteredShipments } = get();
        get().updateFilteredShipments(filteredShipments);
      },
      
      setSortOption: (sortOption) => {
        set(
          (state) => ({
            filters: { ...state.filters, sortOption },
          }),
          false,
          'setSortOption'
        );
        const { filteredShipments } = get();
        get().updateFilteredShipments(filteredShipments);
      },
      
      clearDateRange: () => {
        set(
          (state) => ({
            filters: { ...state.filters, dateRangeStart: '', dateRangeEnd: '' },
          }),
          false,
          'clearDateRange'
        );
        const { filteredShipments } = get();
        get().updateFilteredShipments(filteredShipments);
      },
      
      clearAllFilters: () => {
        set(
          {
            filters: initialFilters,
          },
          false,
          'clearAllFilters'
        );
        const { filteredShipments } = get();
        get().updateFilteredShipments(filteredShipments);
      },
      
      // Core filtering logic
      updateFilteredShipments: (allShipments: IEShippingShipment[]) => {
        const { filters } = get();
        const {
          searchTerm,
          selectedType,
          selectedPOType,
          activePOTypeTab,
          dateRangeStart,
          dateRangeEnd,
          sortOption,
        } = filters;
        
        const filtered = allShipments.filter(shipment => {
          const matchesType = selectedType === 'all' || shipment.type === selectedType;
          const matchesPOType = selectedPOType === 'all' || shipment.poNumber === selectedPOType;
          const matchesTabPOType = activePOTypeTab === 'all' || shipment.poNumber === activePOTypeTab;
          const matchesSearch = searchTerm === '' || 
            shipment.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.poNumber.toLowerCase().includes(searchTerm.toLowerCase());
          
          // Date range filtering based on ETD
          let matchesDateRange = true;
          if (dateRangeStart && dateRangeEnd) {
            matchesDateRange = shipment.etd >= dateRangeStart && shipment.etd <= dateRangeEnd;
          } else if (dateRangeStart) {
            matchesDateRange = shipment.etd >= dateRangeStart;
          } else if (dateRangeEnd) {
            matchesDateRange = shipment.etd <= dateRangeEnd;
          }
          
          return matchesType && matchesPOType && matchesTabPOType && matchesSearch && matchesDateRange;
        });
        
        // Apply sorting
        if (sortOption !== 'none') {
          filtered.sort((a, b) => {
            if (sortOption === 'clearDate-asc' || sortOption === 'clearDate-desc') {
              const aDate = new Date(a.dateClear).getTime();
              const bDate = new Date(b.dateClear).getTime();
              return sortOption === 'clearDate-asc' ? aDate - bDate : bDate - aDate;
            }
            
            if (sortOption === 'status-asc' || sortOption === 'status-desc') {
              const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 999;
              const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 999;
              return sortOption === 'status-asc' ? aPriority - bPriority : bPriority - aPriority;
            }
            
            return 0;
          });
        }
        
        set(
          {
            filteredShipments: filtered,
            filteredCount: filtered.length,
          },
          false,
          'updateFilteredShipments'
        );
      },
    }),
    { name: 'shipment-filter-store' }
  )
);

// Selector hooks for better performance - FIXED VERSION
export const useShipmentFilters = () => useShipmentFilterStore(state => state.filters);
export const useFilteredShipments = () => useShipmentFilterStore(state => state.filteredShipments);
export const useFilteredCount = () => useShipmentFilterStore(state => state.filteredCount);

// Individual action hooks to avoid infinite loops
export const useSetSearchTerm = () => useShipmentFilterStore(state => state.setSearchTerm);
export const useSetSelectedType = () => useShipmentFilterStore(state => state.setSelectedType);
export const useSetSelectedPOType = () => useShipmentFilterStore(state => state.setSelectedPOType);
export const useSetActivePOTypeTab = () => useShipmentFilterStore(state => state.setActivePOTypeTab);
export const useSetDateRange = () => useShipmentFilterStore(state => state.setDateRange);
export const useSetSortOption = () => useShipmentFilterStore(state => state.setSortOption);
export const useClearDateRange = () => useShipmentFilterStore(state => state.clearDateRange);
export const useClearAllFilters = () => useShipmentFilterStore(state => state.clearAllFilters);
export const useUpdateFilteredShipments = () => useShipmentFilterStore(state => state.updateFilteredShipments);