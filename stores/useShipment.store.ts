import { IEShippingShipment } from '@/interfaces/shipment.interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ShipmentState {
  selectedShipment: IEShippingShipment | null;
  shipmentFilters: {
    status: string[];
    dateRange: [Date, Date] | null;
    searchTerm: string;
  };
  
  // Actions
  selectShipment: (shipment: IEShippingShipment | null) => void;
  setFilters: (filters: Partial<ShipmentState['shipmentFilters']>) => void;
  clearFilters: () => void;
}

export const useShipmentStore = create<ShipmentState>()(
  devtools(
    (set) => ({
      selectedShipment: null,
      shipmentFilters: {
        status: [],
        dateRange: null,
        searchTerm: '',
      },
      
      selectShipment: (selectedShipment) =>
        set({ selectedShipment }, false, 'selectShipment'),
      
      setFilters: (newFilters) =>
        set(
          (state) => ({
            shipmentFilters: { ...state.shipmentFilters, ...newFilters },
          }),
          false,
          'setFilters'
        ),
      
      clearFilters: () =>
        set(
          {
            shipmentFilters: {
              status: [],
              dateRange: null,
              searchTerm: '',
            },
          },
          false,
          'clearFilters'
        ),
    }),
    { name: 'shipment-store' }
  )
);