module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true,
      targets: {
        ios: '10',
        android: '5.0',
      },
    }],
  ],
};
