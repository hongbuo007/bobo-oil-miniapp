import Taro from '@tarojs/taro';
import { API_BASE } from '../config/constants';

let authToken: string | null = null;

export function setToken(token: string | null) {
  authToken = token;
  if (token) {
    Taro.setStorageSync('bobo_token', token);
  } else {
    Taro.removeStorageSync('bobo_token');
  }
}

export function getToken(): string | null {
  if (authToken) return authToken;
  try {
    authToken = Taro.getStorageSync('bobo_token');
    return authToken;
  } catch {
    return null;
  }
}

async function request(path: string, options: any = {}): Promise<any> {
  const token = getToken();
  const header: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.header || {}),
  };
  if (token) {
    header['Authorization'] = `Bearer ${token}`;
  }

  const res = await Taro.request({
    url: `${API_BASE}${path}`,
    method: options.method || 'GET',
    data: options.body ? JSON.parse(options.body) : options.data,
    header,
  });

  if (res.statusCode < 200 || res.statusCode >= 300) {
    const data = res.data as any;
    throw new Error(data?.error || '请求失败');
  }

  return res.data;
}

// Auth API
export const authApi = {
  status: () => request('/auth/status'),
  wechatLogin: (code: string, userInfo?: any) =>
    request('/auth/wechat-login', { method: 'POST', body: JSON.stringify({ code, userInfo }) }),
  login: (password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),
  register: (password: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ password }) }),
  changePassword: (oldPassword: string, newPassword: string) =>
    request('/auth/password', { method: 'PUT', body: JSON.stringify({ oldPassword, newPassword }) }),
};

// Vehicles API
export const vehiclesApi = {
  list: () => request('/vehicles'),
  create: (data: any) => request('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request(`/vehicles/${id}`, { method: 'DELETE' }),
};

// Refuels API
export const refuelsApi = {
  list: (vehicleId?: string) => request(`/refuels${vehicleId ? `?vehicleId=${vehicleId}` : ''}`),
  create: (data: any) => request('/refuels', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request(`/refuels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request(`/refuels/${id}`, { method: 'DELETE' }),
  import: (records: any[]) => request('/refuels/import', { method: 'POST', body: JSON.stringify({ records }) }),
};
