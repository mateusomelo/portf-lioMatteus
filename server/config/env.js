const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-troque-em-producao',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  SITE_URL: process.env.SITE_URL || 'http://localhost:3000'
};
