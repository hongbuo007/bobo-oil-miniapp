export type VehicleType = 'fuel' | 'diesel' | 'hybrid' | 'electric' | 'phev';
export type TransmissionType = 'MT' | 'AT' | 'CVT' | 'DCT';
export type FuelType = '92#' | '95#' | '98#' | '0#柴油';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  vehicleType: VehicleType;
  licensePlate: string;
  engineCapacity: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  fuelTankCapacity: number;
  purchaseDate: string;
  currentMileage: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type VehicleFormData = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>;
