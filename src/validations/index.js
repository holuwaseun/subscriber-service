'use strict';

const _exports = require('../utils/exports');

module.exports = _exports({
  pattern: './*.js',
  options: {
    cwd: './src/validations',
    exportKey: 'camel-case',
    append: 'validation',
  },
});
