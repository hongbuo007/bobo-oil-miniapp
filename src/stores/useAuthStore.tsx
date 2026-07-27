import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { authApi, setToken as saveToken, getToken } from '../api';
import type { AuthState, WechatUserInfo } from '../models/auth';

interface AuthContextType extends AuthState {
  wechatLogin: () => Promise<void>;
  passwordLogin: (password: string) => Promise<void>;
  register: (password: string) => Promise<void>;
  logout: () => void;
  checkLoginStatus: () => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    token: null,
    userInfo: null,
  });

  const updateAuth = useCallback((token: string | null, userInfo: WechatUserInfo | null) => {
    saveToken(token);
    setState({
      isLoggedIn: !!token,
      token,
      userInfo,
    });
  }, []);

  const wechatLogin = useCallback(async () => {
    try {
      const loginRes = await Taro.login();
      if (!loginRes.code) throw new Error('获取微信登录code失败');

      // 获取用户信息（需要用户授权）
      let userInfo: any = undefined;
      try {
        const setting = await Taro.getSetting();
        if (setting.authSetting['scope.userInfo']) {
          const info = await Taro.getUserInfo();
          userInfo = info.userInfo;
        }
      } catch {
        // 用户未授权，不传 userInfo
      }

      const res = await authApi.wechatLogin(loginRes.code, userInfo);
      updateAuth(res.token, res.userInfo || null);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '登录失败', icon: 'none' });
      throw err;
    }
  }, [updateAuth]);

  const passwordLogin = useCallback(async (password: string) => {
    try {
      const res = await authApi.login(password);
      updateAuth(res.token, null);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '登录失败', icon: 'none' });
      throw err;
    }
  }, [updateAuth]);

  const register = useCallback(async (password: string) => {
    try {
      const res = await authApi.register(password);
      updateAuth(res.token, null);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '注册失败', icon: 'none' });
      throw err;
    }
  }, [updateAuth]);

  const logout = useCallback(() => {
    updateAuth(null, null);
  }, [updateAuth]);

  const checkLoginStatus = useCallback(async (): Promise<boolean> => {
    const token = getToken();
    if (token) {
      updateAuth(token, state.userInfo);
      return true;
    }
    return false;
  }, [updateAuth, state.userInfo]);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    await authApi.changePassword(oldPassword, newPassword);
    Taro.showToast({ title: '密码修改成功', icon: 'success' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, wechatLogin, passwordLogin, register, logout, checkLoginStatus, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
