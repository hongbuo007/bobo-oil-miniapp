import type { RefuelRecord, RefuelFormData, ConsumptionResult } from '../models/refuel';

/**
 * 跳枪法油耗计算引擎
 *
 * 四种算法：
 * 算法1（两次跳枪）：当前跳枪 + 上次也跳枪 + 无漏记
 * 算法2（两次亮灯）：当前亮灯 + 上次也亮灯 + 无漏记
 * 算法3（两点跳枪，跨记录）：当前跳枪 + 历史有跳枪
 * 算法4（两点亮灯，跨记录）：当前亮灯 + 历史有亮灯
 */

function getActualCost(r: RefuelRecord | RefuelFormData): number {
  if ('actualCost' in r && r.actualCost !== undefined && r.actualCost !== null) {
    return r.actualCost;
  }
  if ('discount' in r && r.discount !== undefined && r.discount !== null) {
    return r.totalCost - (r as any).discount;
  }
  return r.totalCost;
}

function findLastIndex<T>(arr: T[], predicate: (item: T) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) return i;
  }
  return -1;
}

function round(value: number, decimals = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function calculateConsumption(
  currentRecord: RefuelFormData | RefuelRecord,
  historyRecords: RefuelRecord[]
): ConsumptionResult {
  if (currentRecord.isMissedPrevious) {
    return { consumption: null, costPerKm: null, algorithm: null };
  }

  if (historyRecords.length === 0) {
    return { consumption: null, costPerKm: null, algorithm: null };
  }

  const lastRecord = historyRecords[historyRecords.length - 1];
  if (currentRecord.currentMileage <= lastRecord.currentMileage) {
    return { consumption: null, costPerKm: null, algorithm: null };
  }

  return findBestAlgorithm(currentRecord, historyRecords);
}

function findBestAlgorithm(
  current: RefuelFormData | RefuelRecord,
  history: RefuelRecord[]
): ConsumptionResult {
  const candidates: { result: ConsumptionResult; span: number; priority: number }[] = [];

  // 算法1 & 3: 跳枪
  if (current.isFullTank) {
    const lastFullTankIdx = findLastIndex(history, (r) => r.isFullTank && !r.isMissedPrevious);
    if (lastFullTankIdx >= 0) {
      const lastFullTank = history[lastFullTankIdx];
      const span = history.length - lastFullTankIdx;
      const mileageDiff = current.currentMileage - lastFullTank.currentMileage;
      if (mileageDiff > 0) {
        if (span === 1) {
          const consumption = (current.fuelAmount / mileageDiff) * 100;
          const costPerKm = getActualCost(current) / mileageDiff;
          candidates.push({
            result: { consumption: round(consumption), costPerKm: round(costPerKm), algorithm: 1 },
            span: 1,
            priority: 1,
          });
        } else {
          const intervalFuel = history.slice(lastFullTankIdx + 1).reduce((sum, r) => sum + r.fuelAmount, 0) + current.fuelAmount;
          const intervalCost = history.slice(lastFullTankIdx + 1).reduce((sum, r) => sum + getActualCost(r), 0) + getActualCost(current);
          const consumption = (intervalFuel / mileageDiff) * 100;
          const costPerKm = intervalCost / mileageDiff;
          candidates.push({
            result: { consumption: round(consumption), costPerKm: round(costPerKm), algorithm: 3 },
            span,
            priority: 3,
          });
        }
      }
    }
  }

  // 算法2 & 4: 亮灯
  if (current.isLowFuelLight) {
    const lastLightIdx = findLastIndex(history, (r) => r.isLowFuelLight && !r.isMissedPrevious);
    if (lastLightIdx >= 0) {
      const lastLight = history[lastLightIdx];
      const span = history.length - lastLightIdx;
      const mileageDiff = current.currentMileage - lastLight.currentMileage;
      if (mileageDiff > 0) {
        if (span === 1) {
          const consumption = (lastLight.fuelAmount / mileageDiff) * 100;
          const intervalCost = history.slice(lastLightIdx).reduce((sum, r) => sum + getActualCost(r), 0);
          const costPerKm = intervalCost / mileageDiff;
          candidates.push({
            result: { consumption: round(consumption), costPerKm: round(costPerKm), algorithm: 2 },
            span: 1,
            priority: 2,
          });
        } else {
          const intervalFuel = history.slice(lastLightIdx).reduce((sum, r) => sum + r.fuelAmount, 0);
          const intervalCost = history.slice(lastLightIdx).reduce((sum, r) => sum + getActualCost(r), 0);
          const consumption = (intervalFuel / mileageDiff) * 100;
          const costPerKm = intervalCost / mileageDiff;
          candidates.push({
            result: { consumption: round(consumption), costPerKm: round(costPerKm), algorithm: 4 },
            span,
            priority: 4,
          });
        }
      }
    }
  }

  candidates.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.span - b.span;
  });

  if (candidates.length > 0) return candidates[0].result;
  return { consumption: null, costPerKm: null, algorithm: null };
}

// 批量重算缺失油耗的记录
export function recalcMissing(records: RefuelRecord[]): RefuelRecord[] {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const result: RefuelRecord[] = [];
  const history: RefuelRecord[] = [];

  for (const record of sorted) {
    if (record.calculatedConsumption === null || record.calculatedConsumption === undefined) {
      const calc = calculateConsumption(record, history);
      record = { ...record, ...calc };
    }
    result.push(record);
    history.push(record);
  }

  return result;
}
