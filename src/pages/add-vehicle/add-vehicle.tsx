import { useState } from 'react';
import { View, Text, Input, Picker, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useVehicles } from '../../stores/useVehicleStore';
import { generateUUID } from '../../utils/format';
import { VEHICLE_TYPES, FUEL_TYPES, TRANSMISSION_TYPES } from '../../config/constants';
import type { VehicleFormData, VehicleType, FuelType, TransmissionType } from '../../models/vehicle';
import './add-vehicle.scss';

const VEHICLE_TYPE_KEYS = Object.keys(VEHICLE_TYPES);
const TRANSMISSION_KEYS = Object.keys(TRANSMISSION_TYPES);

export default function AddVehiclePage() {
  const { addVehicle } = useVehicles();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<VehicleFormData>({
    name: '',
    brand: '',
    model: '',
    vehicleType: 'fuel' as VehicleType,
    licensePlate: '',
    engineCapacity: 1.5,
    transmission: 'AT' as TransmissionType,
    fuelType: '92#' as FuelType,
    fuelTankCapacity: 50,
    purchaseDate: '',
    currentMileage: 0,
    imageUrl: '',
  });

  const updateField = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Taro.showToast({ title: '请输入车辆名称', icon: 'none' });
      return;
    }

    setLoading(true);
    try {
      await addVehicle(form);
      Taro.showToast({ title: '添加成功', icon: 'success' });
      setTimeout(() => Taro.navigateBack(), 1500);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '添加失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="container">
      <View className="card">
        <Text className="card-title">车辆信息</Text>

        <View className="form-group">
          <Text className="form-label">车辆名称 *</Text>
          <Input
            className="form-input"
            placeholder="如：我的卡罗拉"
            value={form.name}
            onInput={e => updateField('name', e.detail.value)}
          />
        </View>

        <View className="form-group">
          <Text className="form-label">品牌</Text>
          <Input
            className="form-input"
            placeholder="如：丰田"
            value={form.brand}
            onInput={e => updateField('brand', e.detail.value)}
          />
        </View>

        <View className="form-group">
          <Text className="form-label">型号</Text>
          <Input
            className="form-input"
            placeholder="如：卡罗拉 2023款"
            value={form.model}
            onInput={e => updateField('model', e.detail.value)}
          />
        </View>

        <View className="form-group">
          <Text className="form-label">车牌号</Text>
          <Input
            className="form-input"
            placeholder="如：京A12345"
            value={form.licensePlate}
            onInput={e => updateField('licensePlate', e.detail.value)}
          />
        </View>

        <View className="form-group">
          <Text className="form-label">车辆类型</Text>
          <Picker
            mode="selector"
            range={VEHICLE_TYPE_KEYS}
            value={VEHICLE_TYPE_KEYS.indexOf(form.vehicleType)}
            onChange={e => updateField('vehicleType', VEHICLE_TYPE_KEYS[Number(e.detail.value)])}
          >
            <View className="form-input picker-input">
              {VEHICLE_TYPES[form.vehicleType]}
            </View>
          </Picker>
        </View>

        <View className="form-group">
          <Text className="form-label">排量 (L)</Text>
          <Input
            className="form-input"
            type="digit"
            placeholder="如：1.5"
            value={form.engineCapacity ? String(form.engineCapacity) : ''}
            onInput={e => updateField('engineCapacity', Number(e.detail.value))}
          />
        </View>

        <View className="form-group">
          <Text className="form-label">变速箱</Text>
          <Picker
            mode="selector"
            range={TRANSMISSION_KEYS}
            value={TRANSMISSION_KEYS.indexOf(form.transmission)}
            onChange={e => updateField('transmission', TRANSMISSION_KEYS[Number(e.detail.value)])}
          >
            <View className="form-input picker-input">
              {TRANSMISSION_TYPES[form.transmission]}
            </View>
          </Picker>
        </View>

        <View className="form-group">
          <Text className="form-label">常用油品</Text>
          <Picker
            mode="selector"
            range={[...FUEL_TYPES]}
            value={FUEL_TYPES.indexOf(form.fuelType as any)}
            onChange={e => updateField('fuelType', FUEL_TYPES[Number(e.detail.value)])}
          >
            <View className="form-input picker-input">{form.fuelType}</View>
          </Picker>
        </View>

        <View className="form-group">
          <Text className="form-label">油箱容量 (L)</Text>
          <Input
            className="form-input"
            type="digit"
            placeholder="如：50"
            value={form.fuelTankCapacity ? String(form.fuelTankCapacity) : ''}
            onInput={e => updateField('fuelTankCapacity', Number(e.detail.value))}
          />
        </View>

        <View className="form-group">
          <Text className="form-label">购车日期</Text>
          <Picker
            mode="date"
            value={form.purchaseDate}
            onChange={e => updateField('purchaseDate', e.detail.value)}
          >
            <View className="form-input picker-input">
              {form.purchaseDate || '请选择购车日期'}
            </View>
          </Picker>
        </View>

        <View className="form-group">
          <Text className="form-label">当前里程 (km)</Text>
          <Input
            className="form-input"
            type="digit"
            placeholder="请输入当前总里程"
            value={form.currentMileage ? String(form.currentMileage) : ''}
            onInput={e => updateField('currentMileage', Number(e.detail.value))}
          />
        </View>
      </View>

      <View className="submit-area">
        <Button
          className="btn btn-primary btn-block"
          loading={loading}
          onClick={handleSubmit}
        >
          保存车辆
        </Button>
      </View>
    </View>
  );
}
