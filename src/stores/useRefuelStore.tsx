import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { refuelsApi } from '../api';
import type { RefuelRecord, RefuelFormData } from '../models/refuel';

interface RefuelContextType {
  records: RefuelRecord[];
  loading: boolean;
  loadRecords: (vehicleId?: string) => Promise<void>;
  addRecord: (data: RefuelFormData) => Promise<RefuelRecord>;
  updateRecord: (id: string, data: Partial<RefuelRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  importRecords: (records: any[]) => Promise<void>;
}

const RefuelContext = createContext<RefuelContextType | null>(null);

export function RefuelProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<RefuelRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecords = useCallback(async (vehicleId?: string) => {
    setLoading(true);
    try {
      const data = await refuelsApi.list(vehicleId);
      setRecords(data);
    } catch (err) {
      console.error('加载加油记录失败', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addRecord = useCallback(async (data: RefuelFormData): Promise<RefuelRecord> => {
    const record = await refuelsApi.create(data);
    // 重新加载以获取后端计算的油耗
    return record;
  }, []);

  const updateRecord = useCallback(async (id: string, data: Partial<RefuelRecord>) => {
    await refuelsApi.update(id, data);
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  }, []);

  const deleteRecord = useCallback(async (id: string) => {
    await refuelsApi.remove(id);
    setRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  const importRecords = useCallback(async (records: any[]) => {
    await refuelsApi.import(records);
  }, []);

  return (
    <RefuelContext.Provider value={{
      records, loading,
      loadRecords, addRecord, updateRecord, deleteRecord, importRecords,
    }}>
      {children}
    </RefuelContext.Provider>
  );
}

export function useRefuels(): RefuelContextType {
  const ctx = useContext(RefuelContext);
  if (!ctx) throw new Error('useRefuels must be used within RefuelProvider');
  return ctx;
}
