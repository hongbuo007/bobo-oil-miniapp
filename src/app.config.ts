export default {
  pages: [
    'pages/index/index',
    'pages/login/login',
    'pages/refuels/refuels',
    'pages/add-refuel/add-refuel',
    'pages/refuel-detail/refuel-detail',
    'pages/vehicles/vehicles',
    'pages/add-vehicle/add-vehicle',
    'pages/statistics/statistics',
    'pages/settings/settings',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1890ff',
    navigationBarTitleText: 'bobo油耗',
    navigationBarTextStyle: 'white',
  },
  tabBar: {
    color: '#999',
    selectedColor: '#1890ff',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '仪表盘',
        iconPath: 'assets/tabbar/dashboard.png',
        selectedIconPath: 'assets/tabbar/dashboard-active.png',
      },
      {
        pagePath: 'pages/refuels/refuels',
        text: '加油记录',
        iconPath: 'assets/tabbar/refuel.png',
        selectedIconPath: 'assets/tabbar/refuel-active.png',
      },
      {
        pagePath: 'pages/statistics/statistics',
        text: '统计',
        iconPath: 'assets/tabbar/stats.png',
        selectedIconPath: 'assets/tabbar/stats-active.png',
      },
      {
        pagePath: 'pages/settings/settings',
        text: '设置',
        iconPath: 'assets/tabbar/settings.png',
        selectedIconPath: 'assets/tabbar/settings-active.png',
      },
    ],
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于记录加油站位置',
    },
  },
};
