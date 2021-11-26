'use strict';

module.exports = ({di}) => {
  const schema = {};

  Object.keys(require('../validations')).map((key) => {
    const entry = di.resolve(key);
    Object.assign(schema, entry);
  });

  return schema;
};
