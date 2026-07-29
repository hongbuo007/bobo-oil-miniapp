import { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAuth } from '../../stores/useAuthStore';
import { useVehicles } from '../../stores/useVehicleStore';
import { useRefuels } from '../../stores/useRefuelStore';
import { calculateDashboardStats, type DashboardStats } from '../../services/costCalculator';
import { formatMoney, formatConsumption, formatCostPerKm, formatMileage, formatNumber } from '../../utils/format';
import './index.scss';

export default function DashboardPage() {
  const { isLoggedIn, checkLoginStatus } = useAuth();
  const { activeVehicle, loadVehicles, vehicles } = useVehicles();
  const { records, loadRecords } = useRefuels();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    initPage();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadVehicles();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (activeVehicle) {
      loadRecords(activeVehicle.id);
    }
  }, [activeVehicle]);

  useEffect(() => {
    if (records.length > 0) {
      setStats(calculateDashboardStats(records));
    } else {
      setStats(null);
    }
  }, [records]);

  const initPage = async () => {
    const loggedIn = await checkLoginStatus();
    if (!loggedIn) {
      Taro.reLaunch({ url: '/pages/login/login' });
    }
  };

  const goAddRefuel = () => {
    Taro.navigateTo({ url: '/pages/add-refuel/add-refuel' });
  };

  const goRefuels = () => {
    Taro.switchTab({ url: '/pages/refuels/refuels' });
  };

  const goVehicles = () => {
    Taro.navigateTo({ url: '/pages/vehicles/vehicles' });
  };

  if (!stats) {
    return (
      <View className="container">
        <View className="card">
          <View className="empty-state">
            <Text className="empty-state-icon">📊</Text>
            <Text className="empty-state-text">还没有加油记录</Text>
            <Text className="empty-state-text text-secondary mt-24">添加第一条加油记录开始追踪油耗吧</Text>
            <View className="btn btn-primary btn-small mt-32" onClick={goAddRefuel}>
              添加加油记录
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="container">
      {/* 车辆选择 */}
      {vehicles.length > 0 && (
        <View className="vehicle-bar flex-between mb-24">
          <Text className="vehicle-name" onClick={goVehicles}>
            🚗 {activeVehicle?.name || '选择车辆'}
          </Text>
          <Text className="vehicle-switch text-light" onClick={goVehicles}>切换 &gt;</Text>
        </View>
      )}

      {/* 最新油耗 */}
      <View className="card latest-card">
        <Text className="card-title">最新油耗</Text>
        <View className="latest-value">
          <Text className={`latest-number ${(stats.latestConsumption || 0) > 10 ? 'danger' : ''}`}>
            {formatConsumption(stats.latestConsumption)}
          </Text>
          <Text className="latest-cost">{formatCostPerKm(stats.costPerKm)}</Text>
        </View>
      </View>

      {/* 统计卡片 */}
      <View className="stats-row">
        <View className="stat-card">
          <Text className="stat-value">{formatConsumption(stats.avgConsumption)}</Text>
          <Text className="stat-label">平均油耗</Text>
        </View>
        <View className="stat-card">
          <Text className="stat-value">{formatMoney(stats.monthlyCost)}</Text>
          <Text className="stat-label">本月油费</Text>
        </View>
        <View className="stat-card">
          <Text className="stat-value">{formatMoney(stats.totalCost)}</Text>
          <Text className="stat-label">累计油费</Text>
        </View>
        <View className="stat-card">
          <Text className="stat-value">{formatMileage(stats.totalMileage)}</Text>
          <Text className="stat-label">累计里程</Text>
        </View>
      </View>

      {/* 汇总信息 */}
      <View className="card">
        <Text className="card-title">加油汇总</Text>
        <View className="summary-list">
          <View className="summary-item flex-between">
            <Text className="text-secondary">累计加油量</Text>
            <Text className="summary-value">{formatNumber(stats.totalFuel)} L</Text>
          </View>
          <View className="summary-item flex-between">
            <Text className="text-secondary">累计实付</Text>
            <Text className="summary-value">{formatMoney(stats.totalCost)}</Text>
          </View>
          <View className="summary-item flex-between">
            <Text className="text-secondary">累计优惠</Text>
            <Text className="summary-value">{formatMoney(stats.totalDiscount)}</Text>
          </View>
          <View className="summary-item flex-between">
            <Text className="text-secondary">加油次数</Text>
            <Text className="summary-value">{stats.recordCount} 次</Text>
          </View>
          <View className="summary-item flex-between">
            <Text className="text-secondary">日均行程</Text>
            <Text className="summary-value">{stats.avgTripDistance > 0 ? `${stats.avgTripDistance} km` : '-'}</Text>
          </View>
          <View className="summary-item flex-between">
            <Text className="text-secondary">平均每公里</Text>
            <Text className="summary-value">{formatCostPerKm(stats.costPerKm)}</Text>
          </View>
        </View>
      </View>

      {/* 快捷操作 */}
      <View className="action-row">
        <View className="btn btn-primary btn-block" onClick={goAddRefuel}>
          + 添加加油记录
        </View>
        <View className="btn btn-outline btn-block mt-24" onClick={goRefuels}>
          查看全部记录
        </View>
      </View>
    </View>
  );
}
