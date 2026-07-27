import { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useRefuels } from '../../stores/useRefuelStore';
import { formatDate, formatMoney, formatConsumption, formatCostPerKm, formatNumber } from '../../utils/format';
import { ALGORITHM_NAMES } from '../../config/constants';
import type { RefuelRecord } from '../../models/refuel';
import './refuel-detail.scss';

export default function RefuelDetailPage() {
  const router = useRouter();
  const { id } = router.params;
  const { records, loadRecords } = useRefuels();
  const [record, setRecord] = useState<RefuelRecord | null>(null);

  useEffect(() => {
    const found = records.find(r => r.id === id);
    if (found) {
      setRecord(found);
    }
  }, [id, records]);

  if (!record) {
    return (
      <View className="container">
        <View className="card">
          <View className="empty-state">
            <Text className="empty-state-text">记录不存在</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="container">
      <View className="card">
        <View className="flex-between mb-24">
          <Text className="detail-date">{formatDate(record.date, 'YYYY年MM月DD日')}</Text>
          <View className="flex-row">
            {record.isFullTank && <Text className="tag tag-blue">跳枪</Text>}
            {record.isLowFuelLight && <Text className="tag tag-orange">亮灯</Text>}
            {record.isMissedPrevious && <Text className="tag tag-red">漏记</Text>}
          </View>
        </View>

        {/* 核心数据 */}
        <View className="detail-main-stats">
          <View className="detail-stat-big">
            <Text className="detail-big-value">
              {formatConsumption(record.calculatedConsumption)}
            </Text>
            <Text className="detail-big-label">油耗</Text>
          </View>
          <View className="detail-stat-big">
            <Text className="detail-big-value">
              {formatCostPerKm(record.calculatedCostPerKm)}
            </Text>
            <Text className="detail-big-label">每公里成本</Text>
          </View>
        </View>

        {record.algorithmUsed && (
          <View className="algorithm-badge">
            <Text className="tag tag-green">
              {ALGORITHM_NAMES[record.algorithmUsed]}
            </Text>
          </View>
        )}
      </View>

      <View className="card">
        <Text className="card-title">加油详情</Text>
        <View className="detail-list">
          <View className="detail-item flex-between">
            <Text className="text-secondary">里程</Text>
            <Text>{record.currentMileage.toLocaleString()} km</Text>
          </View>
          <View className="detail-item flex-between">
            <Text className="text-secondary">加油量</Text>
            <Text>{formatNumber(record.fuelAmount)} L</Text>
          </View>
          <View className="detail-item flex-between">
            <Text className="text-secondary">单价</Text>
            <Text>{formatMoney(record.unitPrice)}/L</Text>
          </View>
          <View className="detail-item flex-between">
            <Text className="text-secondary">机显金额</Text>
            <Text>{formatMoney(record.totalCost)}</Text>
          </View>
          <View className="detail-item flex-between">
            <Text className="text-secondary">优惠金额</Text>
            <Text className="text-success">{formatMoney(record.discount)}</Text>
          </View>
          <View className="detail-item flex-between">
            <Text className="text-secondary">实付金额</Text>
            <Text className="detail-highlight">{formatMoney(record.actualCost)}</Text>
          </View>
          <View className="detail-item flex-between">
            <Text className="text-secondary">油品</Text>
            <Text>{record.fuelType}</Text>
          </View>
          <View className="detail-item flex-between">
            <Text className="text-secondary">加油站</Text>
            <Text>{record.stationName || '--'}</Text>
          </View>
          {record.note && (
            <View className="detail-item flex-between">
              <Text className="text-secondary">备注</Text>
              <Text>{record.note}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
