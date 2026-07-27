import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { vehiclesApi } from '../api';
import type { Vehicle, VehicleFormData } from '../models/vehicle';

interface VehicleContextType {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  loading: boolean;
  loadVehicles: () => Promise<void>;
  addVehicle: (data: VehicleFormData) => Promise<Vehicle>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  setActiveVehicle: (vehicle: Vehicle | null) => void;
}

const VehicleContext = createContext<VehicleContextType | null>(null);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vehiclesApi.list();
      setVehicles(data);
      if (data.length > 0 && !activeVehicle) {
        setActiveVehicle(data.find((v: Vehicle) => v.isActive) || data[0]);
      }
    } catch (err) {
      console.error('加载车辆失败', err);
    } finally {
      setLoading(false);
    }
  }, [activeVehicle]);

  const addVehicle = useCallback(async (data: VehicleFormData): Promise<Vehicle> => {
    const vehicle = await vehiclesApi.create(data);
    setVehicles(prev => [...prev, vehicle]);
    if (!activeVehicle) setActiveVehicle(vehicle);
    return vehicle;
  }, [activeVehicle]);

  const updateVehicle = useCallback(async (id: string, data: Partial<Vehicle>) => {
    await vehiclesApi.update(id, data);
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
    if (activeVehicle?.id === id) {
      setActiveVehicle(prev => prev ? { ...prev, ...data } : null);
    }
  }, [activeVehicle]);

  const deleteVehicle = useCallback(async (id: string) => {
    await vehiclesApi.remove(id);
    setVehicles(prev => prev.filter(v => v.id !== id));
    if (activeVehicle?.id === id) {
      setActiveVehicle(null);
    }
  }, [activeVehicle]);

  return (
    <VehicleContext.Provider value={{
      vehicles, activeVehicle, loading,
      loadVehicles, addVehicle, updateVehicle, deleteVehicle, setActiveVehicle,
    }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles(): VehicleContextType {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error('useVehicles must be used within VehicleProvider');
  return ctx;
}
