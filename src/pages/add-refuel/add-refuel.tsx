import { useState } from 'react';
import { View, Text, Input, Switch, Picker, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useVehicles } from '../../stores/useVehicleStore';
import { useRefuels } from '../../stores/useRefuelStore';
import { generateUUID } from '../../utils/format';
import { FUEL_TYPES } from '../../config/constants';
import type { RefuelFormData } from '../../models/refuel';
import type { FuelType } from '../../models/vehicle';
import './add-refuel.scss';

export default function AddRefuelPage() {
  const { activeVehicle } = useVehicles();
  const { addRecord } = useRefuels();

  const [form, setForm] = useState<RefuelFormData>({
    vehicleId: activeVehicle?.id || '',
    date: new Date().toISOString().slice(0, 10),
    currentMileage: activeVehicle?.currentMileage || 0,
    fuelAmount: 0,
    unitPrice: 0,
    totalCost: 0,
    discount: 0,
    actualCost: 0,
    fuelType: (activeVehicle?.fuelType || '92#') as FuelType,
    stationName: '',
    isFullTank: true,
    isLowFuelLight: false,
    isMissedPrevious: false,
    note: '',
  });
  const [loading, setLoading] = useState(false);

  const updateField = (key: string, value: any) => {
    const newForm = { ...form, [key]: value };
    // 自动计算实付金额
    if (key === 'totalCost' || key === 'discount') {
      newForm.actualCost = Math.max(0, (newForm.totalCost || 0) - (newForm.discount || 0));
    }
    setForm(newForm);
  };

  const handleSubmit = async () => {
    if (!form.vehicleId) {
      Taro.showToast({ title: '请先添加车辆', icon: 'none' });
      return;
    }
    if (form.currentMileage <= 0) {
      Taro.showToast({ title: '请输入当前里程', icon: 'none' });
      return;
    }
    if (form.fuelAmount <= 0) {
      Taro.showToast({ title: '请输入加油量', icon: 'none' });
      return;
    }

    setLoading(true);
    try {
      await addRecord(form);
      Taro.showToast({ title: '添加成功', icon: 'success' });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '添加失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="container">
      <View className="card">
        <Text className="card-title">加油信息</Text>

        {/* 日期 */}
        <View className="form-group">
          <Text className="form-label">日期</Text>
          <Picker
            mode="date"
            value={form.date}
            onChange={e => updateField('date', e.detail.value)}
          >
            <View className="form-input picker-input">{form.date}</View>
          </Picker>
        </View>

        {/* 里程 */}
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

        {/* 加油量 */}
        <View className="form-group">
          <Text className="form-label">加油量 (L)</Text>
          <Input
            className="form-input"
            type="digit"
            placeholder="请输入加油升数"
            value={form.fuelAmount ? String(form.fuelAmount) : ''}
            onInput={e => updateField('fuelAmount', Number(e.detail.value))}
          />
        </View>

        {/* 单价 */}
        <View className="form-group">
          <Text className="form-label">单价 (元/L)</Text>
          <Input
            className="form-input"
            type="digit"
            placeholder="请输入油价"
            value={form.unitPrice ? String(form.unitPrice) : ''}
            onInput={e => updateField('unitPrice', Number(e.detail.value))}
          />
        </View>

        {/* 总金额 */}
        <View className="form-group">
          <Text className="form-label">机显金额 (元)</Text>
          <Input
            className="form-input"
            type="digit"
            placeholder="加油机显示的总金额"
            value={form.totalCost ? String(form.totalCost) : ''}
            onInput={e => updateField('totalCost', Number(e.detail.value))}
          />
        </View>

        {/* 优惠金额 */}
        <View className="form-group">
          <Text className="form-label">优惠金额 (元)</Text>
          <Input
            className="form-input"
            type="digit"
            placeholder="优惠/折扣金额"
            value={form.discount ? String(form.discount) : ''}
            onInput={e => updateField('discount', Number(e.detail.value))}
          />
        </View>

        {/* 实付金额（自动计算） */}
        <View className="form-group">
          <Text className="form-label">实付金额 (元)</Text>
          <View className="form-input actual-cost-display">
            <Text className="actual-cost-text">¥ {form.actualCost.toFixed(2)}</Text>
            <Text className="text-light actual-cost-hint">= 机显金额 - 优惠金额</Text>
          </View>
        </View>

        {/* 油品 */}
        <View className="form-group">
          <Text className="form-label">油品类型</Text>
          <Picker
            mode="selector"
            range={FUEL_TYPES}
            value={FUEL_TYPES.indexOf(form.fuelType as any)}
            onChange={e => updateField('fuelType', FUEL_TYPES[Number(e.detail.value)])}
          >
            <View className="form-input picker-input">{form.fuelType}</View>
          </Picker>
        </View>

        {/* 加油站 */}
        <View className="form-group">
          <Text className="form-label">加油站</Text>
          <Input
            className="form-input"
            placeholder="请输入加油站名称"
            value={form.stationName}
            onInput={e => updateField('stationName', e.detail.value)}
          />
        </View>

        {/* 备注 */}
        <View className="form-group">
          <Text className="form-label">备注</Text>
          <Input
            className="form-input"
            placeholder="备注信息（可选）"
            value={form.note}
            onInput={e => updateField('note', e.detail.value)}
          />
        </View>
      </View>

      {/* 标记开关 */}
      <View className="card">
        <Text className="card-title">加油标记</Text>

        <View className="form-switch-row">
          <Text className="form-switch-label">是否加满（跳枪）</Text>
          <Switch
            checked={form.isFullTank}
            color="#1890ff"
            onChange={e => updateField('isFullTank', e.detail.value)}
          />
        </View>

        <View className="form-switch-row">
          <Text className="form-switch-label">是否亮燃油灯</Text>
          <Switch
            checked={form.isLowFuelLight}
            color="#faad14"
            onChange={e => updateField('isLowFuelLight', e.detail.value)}
          />
        </View>

        <View className="form-switch-row">
          <Text className="form-switch-label">漏记上次加油</Text>
          <Switch
            checked={form.isMissedPrevious}
            color="#ff4d4f"
            onChange={e => updateField('isMissedPrevious', e.detail.value)}
          />
        </View>
      </View>

      {/* 提交按钮 */}
      <View className="submit-area">
        <Button
          className="btn btn-primary btn-block"
          loading={loading}
          onClick={handleSubmit}
        >
          保存记录
        </Button>
      </View>
    </View>
  );
}
