'use strict';

module.exports = {
  server: {
    port: process.env.PORT,
    baseUrl: process.env.API_BASE,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    batchTTL: process.env.ITEM_TTL || 300,
    listTTL: process.env.LIST_TTL || 30,
    url: process.env.REDIS_URL,
    database: process.env.REDIS_DATABASE || '1',
  },
};
