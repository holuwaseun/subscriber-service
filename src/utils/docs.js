'use strict';

const path = require('path');
const yaml = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const swaggerDocs = yaml.load(path.join(__dirname, '../../OpenAPI.yml'));

module.exports = () => {
  const serve = () => swaggerUI.serve;

  const handle = () => swaggerUI.setup(swaggerDocs);

  return {
    serve,
    handle,
  };
};
