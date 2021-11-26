'use strict';

module.exports = ({errorClass, errorFormatterFn}) => {
  const generateError = ({
    message = 'internal server error', errorType = 'SERVER_ERROR',
  }) => {
    throw new errorClass[errorType](message);
  };

  const handleResponse = ({
    response, code = 200, payload = {},
    error = undefined,
  }) => {
    if (error) {
      const err = _formatError({error});
      code = err.code;
      payload.message = err.message;
    }

    return response.status(code).send({
      ...payload,
    });
  };

  const _formatError = ({error}) => errorFormatterFn(error);

  return {
    generateError,
    handleResponse,
  };
};
