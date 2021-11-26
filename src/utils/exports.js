'use strict';

const glob = require('glob');
const path = require('path');

module.exports = ({
  pattern, options = null,
}) => {
  const _exports = {};
  const defaultOptions = {
    exportKey: 'camel-case',
    cwd: '.',
    skip: [],
    append: null,
  };

  const normalizeOption = ({options = null, defaultOptions}) => {
    if (!options) return defaultOptions;

    const keys = Object.keys(defaultOptions);
    const normalizedOptions = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!options[key]) {
        normalizedOptions[key] = defaultOptions[key];
        continue;
      }

      if (typeof options[key] === 'object' && !options[key].length) {
        normalizedOptions[key] = normalizeOption({
          options: options[key], defaultOptions: defaultOptions[key],
        });
        continue;
      }

      normalizedOptions[key] = options[key];
    }
    return normalizedOptions;
  };

  const formatKey = ({format, append, name}) => {
    const key = [];
    let chunk;
    const extension = name.match(/\.\w+/)[0];
    const directory = name.match(/[.+\/]+/)[0];

    const caseDelimiter = {
      'camel-case': '',
      'pascal-case': '',
      'snake-case': '_',
    };

    if (name.match('-')) {
      chunk = name.split('-');
    } else if (name.match('_')) {
      chunk = name.split('_');
    } else {
      chunk = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(' ');
    }

    if (append) {
      chunk.push(append);
    }

    for (let i = 0; i < chunk.length; i++) {
      chunk[i] = chunk[i].toLowerCase()
          .replace(directory, '')
          .replace(extension, '');
      if (i === 0) {
        if (format === 'pascal-case') {
          chunk[i] = chunk[i].charAt(0).toUpperCase() + chunk[i].slice(1);
        }
        key.push(chunk[i]);
        continue;
      }

      if (format !== 'snake-case') {
        chunk[i] = chunk[i].charAt(0).toUpperCase() + chunk[i].slice(1);
      }
      key.push(chunk[i]);
    }

    return key.join(caseDelimiter[format]);
  };

  options = normalizeOption({options, defaultOptions});

  const files = glob.sync(`${ pattern }`, {cwd: options.cwd});
  for (let i = 0; i < files.length; i++) {
    if (files[i].match('index.js') || options.skip.indexOf(files[i]) > -1) {
      continue;
    }

    const key = formatKey({
      format: options.exportKey, append: options.append, name: files[i],
    });
    _exports[key] = require(path.resolve(path.join(options.cwd, files[i])));
  }

  return _exports;
};
