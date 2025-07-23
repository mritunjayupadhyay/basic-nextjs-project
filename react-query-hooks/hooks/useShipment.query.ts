import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import { IEShippingShipment } from '@/interfaces/shipment.interface';
import { fetchShipments } from '@/api-services/shipment.api.service';

export const useShipments = (): UseQueryResult<IEShippingShipment[], Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.shipments,
    queryFn: fetchShipments,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};