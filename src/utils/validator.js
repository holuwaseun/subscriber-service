'use strict';

const async = require('async');
const lodash = require('lodash');

const defaultConfig = {
  useJoiError: true,
  supportedMethods: ['post', 'get', 'put', 'delete', 'patch'],
  validators: {
    use_validators: true,
    defaults: ['body', 'params', 'query', 'headers'],
  },
  validationOptions: {
    abortEarly: true,
    allowUnknown: false,
    stripUnknown: true,
  },
};

let _config = {};

module.exports = ({
  validationSchema, joi, config, logger, errorClass,
}) => {
  const {parallel} = async;
  const {get, includes, map} = lodash;

  const _sanitizeConfig = (defaultConfig, config) => {
    const finalConfig = {};

    Object.keys(defaultConfig).map((key) => {
      if (
        typeof defaultConfig[key] === 'object' && !defaultConfig[key].length
      ) {
        if (!config.hasOwnProperty(key)) {
          finalConfig[key] = defaultConfig[key];
        } else {
          finalConfig[key] = _sanitizeConfig(defaultConfig[key], config[key]);
        }
      } else {
        if (!config.hasOwnProperty(key)) {
          finalConfig[key] = defaultConfig[key];
        } else {
          finalConfig[key] = config[key];
        }
      }
    });
    return finalConfig;
  };

  _config = _sanitizeConfig(defaultConfig, config.validatorConfig);

  const validateRequest = () => {
    return async (request, response, next) => {
      let {method, route} = request;
      const {path} = route;
      method = method.toLowerCase();
      const schema = _getSchema(path);

      if (!_validateMethod(method)) {
        logger.debug(`invalid request method`, {method, route, path});
        return next(
            new errorClass['VALIDATION_ERROR'](
                'invalid request method',
            ),
        );
      }

      if (!schema || !schema[method]) {
        logger.debug(
            `no validation schema found to validate request`,
            {method, route, path},
        );
        return next(
            new errorClass['VALIDATION_ERROR'](
                'no validation schema found to validate request',
            ),
        );
      }

      const validations = [];

      const methodSchema = schema[method];

      _config.validators.defaults.map((validator) => {
        if (methodSchema.hasOwnProperty(validator)) {
          validations.push((callback) => _validateSchema(
              validator, request[validator],
              methodSchema[validator], callback,
          ));
        }
      });

      if (!validations.length) {
        logger.debug(
            `no validation schema found to validate request`,
            {method, route, path},
        );
        return next(
            new errorClass['VALIDATION_ERROR'](
                'no validation schema found to validate request',
            ),
        );
      }

      await _doValidation(validations, request)
          .catch((error) => next(_handleError(error)));

      next();
      return null;
    };
  };

  const _doValidation = (validations, request) => {
    return new Promise((resolve, reject) => {
      return parallel(validations, (error, results) => {
        if (error) {
          logger.error(`validation error`, _formatJoiError(error));
          return reject(error);
        }

        map(results, (entry) => {
          request[entry.field] = entry.value;
          return entry;
        });
        return resolve(request);
      });
    });
  };

  const _getSchema = (route) => get(validationSchema, route);

  const _validateMethod = (method) => includes(
      _config.supportedMethods, method,
  );

  const _validateSchema = (field, payload, schema, callback) => {
    const {error, value} = joi.object(schema)
        .validate({...payload}, {..._config.validationOptions});
    if (error) return callback(error, null);
    return callback(null, {field, value});
  };

  const _handleError = (error) => {
    if (!_config.useJoiError) {
      return new errorClass['VALIDATION_ERROR'](error.message);
    }

    return _formatJoiError(error);
  };

  const _formatJoiError = (error) => {
    const message = map(
        error.details,
        ({message}) => message.replace(/['"]/g, ''),
    );
    return new errorClass['VALIDATION_ERROR'](message.join(', '));
  };

  return {
    validateRequest,
  };
};
