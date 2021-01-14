const path = require('path');

module.exports = {
  interfaces: path.resolve(__dirname, './src/interfaces/'),
  renderer: path.resolve(__dirname, './src/renderer/'),
  server: path.resolve(__dirname, './src/server/'),
  utils: path.resolve(__dirname, './src/utils/'),
};
