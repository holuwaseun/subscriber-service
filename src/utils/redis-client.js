'use strict';

const IORedis = require('ioredis');
let connection = null;

module.exports = ({logger, store}) => {
  /**
   *
   * @return {null}
   */
  const connect = () => {
    try {
      logger.debug('connecting to redis store', 'redis');
      if (!connection) {
        connection = new IORedis(store.redis.url, {
          port: Number(store.redis.port),
          host: store.redis.host,
          family: 4,
          password: store.redis.password,
          db: Number(store.redis.database),
        });
      }

      logger.debug('connected to redis store', 'redis');
      return connection;
    } catch (error) {
      logger.error(error.message, 'redis');
    }
  };

  /**
   *
   * @param {Object|string} data
   * @param {string} type
   * @return {string|null|any}
   */
  const formatData = (data = null, type = 'read') => {
    if (!data) {
      return null;
    }

    if (type === 'write') {
      return JSON.stringify(data);
    }

    return JSON.parse(data);
  };

  /**
   *
   * @param {string} key
   * @return {Promise<string|*|null>}
   */
  const readKey = async (key) => {
    if (!key) {
      throw new Error('cannot write to an undefined key');
    }

    const data = await connection.get(key);
    console.log(data, 'REDIS DATA');
    return formatData(data, 'read');
  };

  /**
   *
   * @param {string} key
   * @param {Object} data
   * @return {Promise<boolean|*>}
   */
  const writeKey = async (key, data) => {
    if (!key) {
      throw new Error('cannot write to an undefined key');
    }

    if (!data) {
      return false;
    }

    await connection.set(key, formatData(data, 'write'));
    return data;
  };

  return {
    connect,
    readKey,
    writeKey,
  };
};
