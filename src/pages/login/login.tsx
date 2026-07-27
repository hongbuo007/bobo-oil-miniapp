import { useState, useEffect } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAuth } from '../../stores/useAuthStore';
import './login.scss';

export default function LoginPage() {
  const { isLoggedIn, wechatLogin, passwordLogin, register } = useAuth();
  const [mode, setMode] = useState<'wechat' | 'password'>('wechat');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasUser, setHasUser] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      Taro.switchTab({ url: '/pages/index/index' });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const { authApi } = await import('../../api');
      const res = await authApi.status();
      setHasUser(res.hasUser);
      if (res.hasUser) {
        setIsRegister(false);
      } else {
        setIsRegister(true);
      }
    } catch {
      // 后端不可用
    }
  };

  const handleWechatLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await wechatLogin();
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (loading) return;
    if (!password) {
      Taro.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    if (isRegister && password !== confirmPassword) {
      Taro.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }
    if (password.length < 4) {
      Taro.showToast({ title: '密码至少4位', icon: 'none' });
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(password);
      } else {
        await passwordLogin(password);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="login-container">
      <View className="login-header">
        <Text className="login-logo">🚗</Text>
        <Text className="login-title">bobo油耗</Text>
        <Text className="login-subtitle">记录每一滴油的旅程</Text>
      </View>

      <View className="login-card">
        {/* 微信一键登录 */}
        {mode === 'wechat' && (
          <View className="login-section">
            <Button
              className="wechat-login-btn"
              loading={loading}
              onClick={handleWechatLogin}
            >
              <Text className="wechat-icon">💬</Text>
              <Text>微信一键登录</Text>
            </Button>
            <View className="login-divider">
              <Text className="login-divider-text">或</Text>
            </View>
            <View className="switch-mode" onClick={() => setMode('password')}>
              <Text className="switch-mode-text">使用密码登录</Text>
            </View>
          </View>
        )}

        {/* 密码登录 */}
        {mode === 'password' && (
          <View className="login-section">
            <Text className="login-mode-title">
              {isRegister ? '首次使用，请设置密码' : '请输入密码'}
            </Text>

            <View className="form-group">
              <Input
                className="form-input password-input"
                type="text"
                password
                placeholder="请输入密码（至少4位）"
                value={password}
                onInput={e => setPassword(e.detail.value)}
                focus
              />
            </View>

            {isRegister && (
              <View className="form-group">
                <Input
                  className="form-input password-input"
                  type="text"
                  password
                  placeholder="请再次输入密码"
                  value={confirmPassword}
                  onInput={e => setConfirmPassword(e.detail.value)}
                />
              </View>
            )}

            <Button
              className="wechat-login-btn password-login-btn"
              loading={loading}
              onClick={handlePasswordSubmit}
            >
              {isRegister ? '设置密码并进入' : '登录'}
            </Button>

            <View className="switch-mode" onClick={() => setMode('wechat')}>
              <Text className="switch-mode-text">返回微信登录</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
