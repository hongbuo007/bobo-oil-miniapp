import { useState } from 'react';
import { View, Text, Image, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAuth } from '../../stores/useAuthStore';
import { APP_NAME, APP_VERSION } from '../../config/constants';
import './settings.scss';

export default function SettingsPage() {
  const { isLoggedIn, logout, changePassword, checkLoginStatus, userInfo } = useAuth();
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Taro.showModal({
      title: '确认退出',
      content: '退出后需要重新登录',
      success: (res) => {
        if (res.confirm) {
          logout();
          Taro.reLaunch({ url: '/pages/login/login' });
        }
      },
    });
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Taro.showToast({ title: '请填写完整', icon: 'none' });
      return;
    }
    if (newPassword.length < 4) {
      Taro.showToast({ title: '新密码至少4位', icon: 'none' });
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setShowChangePwd(false);
      setOldPassword('');
      setNewPassword('');
    } finally {
      setLoading(false);
    }
  };

  const goVehicles = () => {
    Taro.navigateTo({ url: '/pages/vehicles/vehicles' });
  };

  return (
    <View className="container">
      {/* 用户信息 */}
      <View className="card">
        <View className="user-info">
          <View className="user-avatar">
            <Text>
              {userInfo?.avatarUrl ? (
                <Image src={userInfo.avatarUrl} className="avatar-img" />
              ) : (
                '👤'
              )}
            </Text>
          </View>
          <View className="user-detail">
            <Text className="user-name">{userInfo?.nickname || '用户'}</Text>
            <Text className="text-light">微信登录</Text>
          </View>
        </View>
      </View>

      {/* 功能菜单 */}
      <View className="card menu-card">
        <View className="menu-item flex-between" onClick={goVehicles}>
          <Text>🚗 车辆管理</Text>
          <Text className="text-light">&gt;</Text>
        </View>
        <View className="menu-item flex-between" onClick={() => setShowChangePwd(!showChangePwd)}>
          <Text>🔒 修改密码</Text>
          <Text className="text-light">&gt;</Text>
        </View>
      </View>

      {/* 修改密码表单 */}
      {showChangePwd && (
        <View className="card">
          <Text className="card-title">修改密码</Text>
          <View className="form-group">
            <Text className="form-label">原密码</Text>
            <Input
              className="form-input"
              type="text"
              password
              placeholder="请输入原��码"
              value={oldPassword}
              onInput={e => setOldPassword(e.detail.value)}
            />
          </View>
          <View className="form-group">
            <Text className="form-label">新密码</Text>
            <Input
              className="form-input"
              type="text"
              password
              placeholder="请输入新密码（至少4位）"
              value={newPassword}
              onInput={e => setNewPassword(e.detail.value)}
            />
          </View>
          <Button
            className="btn btn-primary btn-block"
            loading={loading}
            onClick={handleChangePassword}
          >
            确认修改
          </Button>
        </View>
      )}

      {/* 退出登录 */}
      <View className="card menu-card">
        <View className="menu-item flex-between" onClick={handleLogout}>
          <Text className="logout-text">退出登录</Text>
        </View>
      </View>

      {/* 版本信息 */}
      <View className="version-info text-center">
        <Text className="text-light">{APP_NAME} v{APP_VERSION}</Text>
      </View>
    </View>
  );
}
