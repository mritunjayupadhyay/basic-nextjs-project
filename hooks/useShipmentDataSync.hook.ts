'use client';
import { useShipments } from "@/react-query-hooks/hooks/useShipment.query";
import { useShipmentFilterStore } from "@/stores/useShipmentFilter.store";
import { useEffect } from "react";

export const useShipmentDataSync = () => {
  const { data: shipments = [], isLoading, error, isSuccess } = useShipments();
  const updateFilteredShipments = useShipmentFilterStore(state => state.updateFilteredShipments);

  // Update filtered shipments whenever shipment data changes
  useEffect(() => {
    if (isSuccess && shipments.length > 0) {
      updateFilteredShipments(shipments);
    }
  }, [shipments, isSuccess, updateFilteredShipments]);

  // Also update when filters change (this is handled within the store actions)
  // but we need to ensure data is available first
  useEffect(() => {
    if (shipments.length > 0) {
      updateFilteredShipments(shipments);
    }
  }, [shipments, updateFilteredShipments]);

  return {
    shipments,
    isLoading,
    error,
    isSuccess
  };
};