const path = require('path');
module.exports = {
  resolve: {
    alias: {
      '@service': path.resolve(__dirname, './src/service'),
      '@libs': path.resolve(__dirname, './src/assets/libs'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/component')
    }
  }
};
