import type { FuelType } from './vehicle';

export interface RefuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  currentMileage: number;
  fuelAmount: number;
  unitPrice: number;
  totalCost: number;
  discount: number;
  actualCost: number;
  fuelType: FuelType;
  stationName: string;
  isFullTank: boolean;
  isLowFuelLight: boolean;
  isMissedPrevious: boolean;
  calculatedConsumption: number | null;
  calculatedCostPerKm: number | null;
  algorithmUsed: number | null;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsumptionResult {
  consumption: number | null;
  costPerKm: number | null;
  algorithm: number | null;
}

export type RefuelFormData = Omit<RefuelRecord, 'id' | 'calculatedConsumption' | 'calculatedCostPerKm' | 'algorithmUsed' | 'createdAt' | 'updatedAt'>;
