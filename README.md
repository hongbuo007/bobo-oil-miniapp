# bobo油耗 - 微信小程序

基于 Taro 4 + React + TypeScript 开发的车辆油耗管理微信小程序。

## 技术栈

- **Taro 4.2** — 跨端框架，编译为微信小程序
- **React 18** + TypeScript
- **SCSS** 样式
- 跳枪法四种算法自动计算油耗

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（实时编译）
npm run dev:weapp

# 生产构建
npm run build:weapp
```

构建产物在 `dist/` 目录，用**微信开发者工具**打开即可预览。

## 项目结构

```
src/
├── api/            # API 请求封装（Taro.request）
├── config/         # 常量配置
├── models/         # TypeScript 类型定义
├── pages/          # 页面
│   ├── index/      # 仪表盘
│   ├── login/      # 微信一键登录
│   ├── refuels/    # 加油记录列表
│   ├── add-refuel/ # 添加加油记录
│   ├── refuel-detail/ # 加油详情
│   ├── vehicles/   # 车辆管理
│   ├── add-vehicle/ # 添加车辆
│   ├── statistics/ # 统计报表
│   └── settings/   # 设置
├── services/       # 油耗计算引擎
├── stores/         # 状态管理（React Context）
└── utils/          # 工具函数
```

## 后端配置

小程序需要后端 API 支持。后端地址配置在 `src/config/constants.ts`：

```ts
export const API_BASE = 'https://youhao.hongbuo007.cn/api';
```

### 微信登录配置

在 `docker-compose.yml` 中设置微信小程序 AppID 和 AppSecret：

```yaml
environment:
  - WECHAT_APPID=你的小程序AppID
  - WECHAT_SECRET=你的小程序AppSecret
```

> 开发模式下未配置 AppID 时，会使用 code 哈希作为 openid，方便本地调试。

## 发布到微信小程序

1. 在[微信公众平台](https://mp.weixin.qq.com/)注册小程序，获取 AppID
2. 修改 `project.config.json` 中的 `appid` 为你的 AppID
3. 运行 `npm run build:weapp`
4. 用微信开发者工具打开 `dist/` 目录
5. 上传代码并提交审核

## 功能特性

- 🚗 多车辆管理
- ⛽ 加油记录 CRUD（含优惠金额/实付金额）
- 📊 跳枪法四种算法自动计算油耗
- 📈 月度统计报表（柱状图 + 汇总表）
- 🔐 微信一键登录
- 🌐 与 Web 版共享同一后端

## 相关项目

- [bobo-oil (Web 版)](https://github.com/hongbuo007/bobo-oil) — React + Vite + Ant Design
