import { useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useVehicles } from '../../stores/useVehicleStore';
import { VEHICLE_TYPES } from '../../config/constants';
import './vehicles.scss';

export default function VehiclesPage() {
  const { vehicles, activeVehicle, loadVehicles, setActiveVehicle, deleteVehicle } = useVehicles();

  useEffect(() => {
    loadVehicles();
  }, []);

  const goAddVehicle = () => {
    Taro.navigateTo({ url: '/pages/add-vehicle/add-vehicle' });
  };

  const handleDelete = (id: string) => {
    if (vehicles.length <= 1) {
      Taro.showToast({ title: '至少保留一辆车', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '确认删除',
      content: '删除后不可恢复',
      success: async (res) => {
        if (res.confirm) {
          await deleteVehicle(id);
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      },
    });
  };

  return (
    <View className="container">
      <View className="flex-between mb-24">
        <Text className="vehicle-count">共 {vehicles.length} 辆车</Text>
        <View className="btn btn-primary btn-small" onClick={goAddVehicle}>
          + 添加
        </View>
      </View>

      {vehicles.length === 0 ? (
        <View className="card">
          <View className="empty-state">
            <Text className="empty-state-icon">🚗</Text>
            <Text className="empty-state-text">还没有添加车辆</Text>
            <View className="btn btn-primary btn-small mt-32" onClick={goAddVehicle}>
              添加车辆
            </View>
          </View>
        </View>
      ) : (
        vehicles.map(vehicle => (
          <View
            key={vehicle.id}
            className={`card vehicle-card ${activeVehicle?.id === vehicle.id ? 'active' : ''}`}
            onClick={() => setActiveVehicle(vehicle)}
          >
            <View className="flex-between mb-16">
              <View className="flex-row">
                <Text className="vehicle-card-name">{vehicle.name}</Text>
                {activeVehicle?.id === vehicle.id && (
                  <Text className="tag tag-blue ml-8">当前</Text>
                )}
              </View>
              <Text
                className="text-light vehicle-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(vehicle.id);
                }}
              >
                删除
              </Text>
            </View>
            <View className="vehicle-card-info">
              <Text className="text-secondary">
                {vehicle.brand} {vehicle.model}
              </Text>
              <Text className="text-secondary ml-16">{vehicle.licensePlate || '未上牌'}</Text>
            </View>
            <View className="vehicle-card-meta flex-row mt-16">
              <Text className="tag">{VEHICLE_TYPES[vehicle.vehicleType]}</Text>
              <Text className="tag ml-8">{vehicle.fuelType}</Text>
              <Text className="tag ml-8">{vehicle.engineCapacity}L</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
