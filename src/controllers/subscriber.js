'use strict';

module.exports = ({responseHandler, logger}) => {
  const processMessage = () => {
    return async (request, response, next) => {
      try {
        logger.debug('Subscribe Topic Received');
        const {body} = request;

        console.log({...body});

        return responseHandler.handleResponse({
          response,
          code: 200,
          error: false,
          payload: {
            message: 'topic subscription message received',
          },
        });
      } catch (error) {
        logger.debug(error);
        return next(error);
      }
    };
  };

  return {
    processMessage,
  };
};
