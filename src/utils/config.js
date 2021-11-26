'use strict';

const config = {};

config['validatorConfig'] = {
  useJoiError: true,
  supportedMethods: ['post', 'get', 'put', 'delete'],
  validationOptions: {
    abortEarly: true,
  },
};

module.exports = config;
