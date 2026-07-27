import { useEffect, useState, useMemo } from 'react';
import { View, Text, Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAuth } from '../../stores/useAuthStore';
import { useVehicles } from '../../stores/useVehicleStore';
import { useRefuels } from '../../stores/useRefuelStore';
import { calculateMonthlyStats, type MonthlyStats } from '../../services/costCalculator';
import { formatMoney, formatConsumption, formatNumber } from '../../utils/format';
import './statistics.scss';

export default function StatisticsPage() {
  const { isLoggedIn, checkLoginStatus } = useAuth();
  const { activeVehicle, loadVehicles } = useVehicles();
  const { records, loadRecords } = useRefuels();
  const [tab, setTab] = useState<'trend' | 'table'>('trend');

  useEffect(() => {
    initPage();
  }, []);

  useEffect(() => {
    if (isLoggedIn) loadVehicles();
  }, [isLoggedIn]);

  useEffect(() => {
    if (activeVehicle) loadRecords(activeVehicle.id);
  }, [activeVehicle]);

  const initPage = async () => {
    const loggedIn = await checkLoginStatus();
    if (!loggedIn) {
      Taro.reLaunch({ url: '/pages/login/login' });
    }
  };

  const monthlyStats = useMemo(() => calculateMonthlyStats(records), [records]);

  // 油耗趋势数据（最近12个月）
  const recentStats = useMemo(() => monthlyStats.slice(-12), [monthlyStats]);
  const maxConsumption = Math.max(...recentStats.map(s => s.avgConsumption), 1);

  if (records.length === 0) {
    return (
      <View className="container">
        <View className="card">
          <View className="empty-state">
            <Text className="empty-state-icon">📈</Text>
            <Text className="empty-state-text">还没有数据</Text>
            <Text className="empty-state-text text-secondary mt-24">添加加油记录后查看统计</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="container">
      {/* Tab 切换 */}
      <View className="stats-tabs mb-24">
        <View
          className={`stats-tab ${tab === 'trend' ? 'active' : ''}`}
          onClick={() => setTab('trend')}
        >
          <Text>趋势图</Text>
        </View>
        <View
          className={`stats-tab ${tab === 'table' ? 'active' : ''}`}
          onClick={() => setTab('table')}
        >
          <Text>月度汇总</Text>
        </View>
      </View>

      {tab === 'trend' && (
        <>
          {/* 油耗趋势柱状图（简易 CSS 实现） */}
          <View className="card">
            <Text className="card-title">月度平均油耗 (L/100km)</Text>
            <View className="chart-container">
              {recentStats.map((stat) => (
                <View key={stat.month} className="chart-bar-group">
                  <Text className="chart-bar-value">
                    {stat.avgConsumption > 0 ? stat.avgConsumption.toFixed(1) : '-'}
                  </Text>
                  <View className="chart-bar-wrapper">
                    <View
                      className="chart-bar"
                      style={{
                        height: `${Math.max((stat.avgConsumption / maxConsumption) * 200, 4)}px`,
                        backgroundColor: stat.avgConsumption > 10 ? '#ff4d4f' : stat.avgConsumption > 8 ? '#faad14' : '#52c41a',
                      }}
                    />
                  </View>
                  <Text className="chart-bar-label">{stat.month.slice(5)}月</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 月度费用柱状图 */}
          <View className="card">
            <Text className="card-title">月度油费 (元)</Text>
            <View className="chart-container">
              {recentStats.map((stat) => {
                const maxCost = Math.max(...recentStats.map(s => s.totalCost), 1);
                return (
                  <View key={stat.month} className="chart-bar-group">
                    <Text className="chart-bar-value">
                      {stat.totalCost > 0 ? stat.totalCost.toFixed(0) : '-'}
                    </Text>
                    <View className="chart-bar-wrapper">
                      <View
                        className="chart-bar cost-bar"
                        style={{
                          height: `${Math.max((stat.totalCost / maxCost) * 200, 4)}px`,
                        }}
                      />
                    </View>
                    <Text className="chart-bar-label">{stat.month.slice(5)}月</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </>
      )}

      {tab === 'table' && (
        <View className="card">
          <Text className="card-title">月度汇总</Text>
          <View className="monthly-table">
            <View className="table-header flex-between">
              <Text className="th-col month-col">月份</Text>
              <Text className="th-col">里程</Text>
              <Text className="th-col">油耗</Text>
              <Text className="th-col">油费</Text>
              <Text className="th-col">次数</Text>
            </View>
            {monthlyStats.map((stat) => (
              <View key={stat.month} className="table-row flex-between">
                <Text className="td-col month-col">{stat.month}</Text>
                <Text className="td-col">{stat.totalMileage}km</Text>
                <Text className="td-col">{stat.avgConsumption > 0 ? stat.avgConsumption.toFixed(1) : '-'}</Text>
                <Text className="td-col">¥{stat.totalCost.toFixed(0)}</Text>
                <Text className="td-col">{stat.recordCount}次</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
