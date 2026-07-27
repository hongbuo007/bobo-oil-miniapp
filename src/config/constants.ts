export const VEHICLE_TYPES: Record<string, string> = {
  fuel: '燃油车',
  diesel: '柴油车',
  hybrid: '油电混动',
  electric: '纯电动',
  phev: '插电混动',
};

export const FUEL_TYPES = ['92#', '95#', '98#', '0#柴油'] as const;

export const TRANSMISSION_TYPES: Record<string, string> = {
  MT: '手动挡',
  AT: '自动挡',
  CVT: '无级变速',
  DCT: '双离合',
};

export const ALGORITHM_NAMES: Record<number, string> = {
  1: '两次跳枪法',
  2: '两次亮灯法',
  3: '两点跳枪法(跨记录)',
  4: '两点亮灯法(跨记录)',
};

export const APP_NAME = 'bobo油耗';
export const APP_VERSION = '1.0.0';
export const API_BASE = 'https://youhao.hongbuo007.cn/api';
