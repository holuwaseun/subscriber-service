'use strict';

const _exports = require('../utils/exports');

module.exports = _exports({
  pattern: './*.js',
  options: {
    cwd: './src/controllers',
    exportKey: 'pascal-case',
    append: 'controller',
  },
});
