import { useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAuth } from '../../stores/useAuthStore';
import { useVehicles } from '../../stores/useVehicleStore';
import { useRefuels } from '../../stores/useRefuelStore';
import { formatDate, formatMoney, formatConsumption, formatCostPerKm, formatNumber } from '../../utils/format';
import { ALGORITHM_NAMES } from '../../config/constants';
import './refuels.scss';

export default function RefuelsPage() {
  const { isLoggedIn, checkLoginStatus } = useAuth();
  const { activeVehicle, loadVehicles, vehicles } = useVehicles();
  const { records, loadRecords, deleteRecord } = useRefuels();

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

  const initPage = async () => {
    const loggedIn = await checkLoginStatus();
    if (!loggedIn) {
      Taro.reLaunch({ url: '/pages/login/login' });
    }
  };

  const goAddRefuel = () => {
    Taro.navigateTo({ url: '/pages/add-refuel/add-refuel' });
  };

  const goDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/refuel-detail/refuel-detail?id=${id}` });
  };

  const handleDelete = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '删除后不可恢复',
      success: async (res) => {
        if (res.confirm) {
          await deleteRecord(id);
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      },
    });
  };

  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <View className="container">
      {/* 头部操作栏 */}
      <View className="flex-between mb-24">
        <Text className="refuel-count">共 {records.length} 条记录</Text>
        <View className="btn btn-primary btn-small" onClick={goAddRefuel}>
          + 添加
        </View>
      </View>

      {sortedRecords.length === 0 ? (
        <View className="card">
          <View className="empty-state">
            <Text className="empty-state-icon">⛽</Text>
            <Text className="empty-state-text">还没有加油记录</Text>
            <View className="btn btn-primary btn-small mt-32" onClick={goAddRefuel}>
              添加第一条记录
            </View>
          </View>
        </View>
      ) : (
        <ScrollView scrollY className="refuel-list-scroll">
          {sortedRecords.map(record => (
            <View key={record.id} className="card refuel-card" onClick={() => goDetail(record.id)}>
              <View className="flex-between mb-16">
                <View className="flex-row">
                  <Text className="refuel-date">{formatDate(record.date)}</Text>
                  {record.isFullTank && <Text className="tag tag-blue ml-8">跳枪</Text>}
                  {record.isLowFuelLight && <Text className="tag tag-orange ml-8">亮灯</Text>}
                </View>
                <Text className="text-light refuel-delete" onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(record.id);
                }}>
                  删除
                </Text>
              </View>

              <View className="refuel-info-row">
                <View className="refuel-info-item">
                  <Text className="text-light">里程</Text>
                  <Text className="refuel-info-value">{record.currentMileage.toLocaleString()} km</Text>
                </View>
                <View className="refuel-info-item">
                  <Text className="text-light">加油量</Text>
                  <Text className="refuel-info-value">{formatNumber(record.fuelAmount)} L</Text>
                </View>
                <View className="refuel-info-item">
                  <Text className="text-light">实付</Text>
                  <Text className="refuel-info-value">{formatMoney(record.actualCost)}</Text>
                </View>
                <View className="refuel-info-item">
                  <Text className="text-light">油耗</Text>
                  <Text className={`refuel-info-value ${(record.calculatedConsumption || 0) > 10 ? 'danger' : ''}`}>
                    {formatConsumption(record.calculatedConsumption)}
                  </Text>
                </View>
              </View>

              <View className="refuel-footer flex-between mt-24">
                <Text className="text-light">{record.stationName || '未知加油站'} · {record.fuelType}</Text>
                {record.algorithmUsed && (
                  <Text className="tag tag-green">{ALGORITHM_NAMES[record.algorithmUsed]}</Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
