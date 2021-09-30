const colorLogger = require('node-color-log');
const level = process.env.LOGGINGLEVEL || 'error';
colorLogger.setLevel(level);
module.exports = colorLogger;