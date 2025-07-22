// Shipping shipment status types
export type ShipmentStatus = 
  | 'submitted'
  | 'approved' 
  | 'confirm'
  | 'preparing'
  | 'in-transit'
  | 'clearance'
  | 'completed'
  | 'delayed';

// PST (Pre-Shipment Testing) status types
export type PstStatus = 
  | 'not-started'
  | 'in-progress'
  | 'completed';

// Shipping type
export type ShippingType = 
  | 'Air'
  | 'Oversea'
  | 'Truck';

// Purchase Order type
export type PoType = 
  | 'Single'
  | 'Multiple'
  | 'Co-load';

// International Commercial Terms
export type IncoTerms = 
  | 'FOB'  // Free On Board
  | 'CIF'  // Cost, Insurance, and Freight
  | 'CFR'  // Cost and Freight
  | 'EXW'  // Ex Works
  | 'DDP'; // Delivered Duty Paid

// Priority levels
export type Priority = 
  | 'Low'
  | 'Medium'
  | 'High';


export interface IEShippingShipment {
  /** Unique identifier for the shipment */
  id: string;
  
  /** Name of the supplier/vendor */
  supplierName: string;
  
  /** Purchase Order number */
  poNumber: string;
  
  /** Port or hub for shipment processing */
  port: string;
  
  /** Date when shipment was cleared (YYYY-MM-DD format) */
  dateClear: string;
  
  /** Type of shipping method */
  type: ShippingType;
  
  /** Type of purchase order */
  poType: PoType;
  
  /** International commercial terms */
  term: IncoTerms;
  
  /** Whether permits are approved/valid */
  permitStatus: boolean;
  
  /** Bill of Lading or Air Waybill number */
  blAwbNumber: string;
  
  /** Quality control container/reference number */
  qualityContainer: string;
  
  /** Tax payment status */
  taxStatus: boolean;
  
  /** Estimated Time of Departure (YYYY-MM-DD format) */
  etd: string;
  
  /** Estimated Time of Arrival (YYYY-MM-DD format) */
  eta: string;
  
  /** Current status of the shipment */
  status: ShipmentStatus;
  
  /** Progress percentage (0-100) */
  progress: number;
  
  /** Pre-Shipment Testing status */
  pstStatus: PstStatus;
  
  /** Supplier contact phone number */
  supplierContact: string;
  
  /** Supplier email address */
  supplierEmail: string;
  
  /** Supplier physical address */
  supplierAddress: string;
  
  /** Total value of shipment in currency units */
  totalValue: number;
  
  /** Weight of shipment (with unit as string) */
  weight: string;
  
  /** Dimensions of shipment (with unit as string) */
  dimensions: string;
  
  /** Name of assigned shipping agent */
  assignedAgent: string;
  
  /** Agent contact phone number */
  agentContact: string;
  
  /** Tracking number for the shipment */
  trackingNumber: string;
  
  /** Customs declaration reference */
  customsDeclaration: string;
  
  /** Whether shipment is insured */
  insurance: boolean;
  
  /** Priority level of the shipment */
  priority: Priority;
  
  /** Special handling instructions */
  specialInstructions: string;
  
  /** Array of required/included documents */
  documents: string[];
  
  /** Array of related Purchase Order numbers */
  relatedPOs: string[];
}