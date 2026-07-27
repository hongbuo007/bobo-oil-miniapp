import dayjs from 'dayjs';

// 兼容的 UUID 生成函数
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function formatNumber(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) return '--';
  return value.toFixed(decimals);
}

export function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined) return '--';
  return `¥${value.toFixed(2)}`;
}

export function formatConsumption(value: number | null | undefined): string {
  if (value === null || value === undefined) return '--';
  return `${value.toFixed(2)} L/100km`;
}

export function formatCostPerKm(value: number | null | undefined): string {
  if (value === null || value === undefined) return '--';
  return `¥${value.toFixed(2)}/km`;
}

export function formatDate(date: string | null | undefined, pattern = 'YYYY-MM-DD'): string {
  if (!date) return '--';
  return dayjs(date).format(pattern);
}

export function formatMileage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '--';
  return `${value.toLocaleString('zh-CN')} km`;
}

export function getConsumptionColor(value: number | null | undefined): string {
  if (value === null || value === undefined) return '#999';
  if (value < 7) return '#52c41a';
  if (value < 9) return '#faad14';
  if (value < 12) return '#ff7a45';
  return '#ff4d4f';
}
