'use strict';

module.exports = ({di, express, responseHandler, errorClass}) => {
  const {Router: expressRoute} = express;
  const router = expressRoute();

  router.get('/health', (request, response) => responseHandler.handleResponse({
    request,
    response,
    code: 200,
    message: 'publisher service is up up and away',
  }));

  Object.keys(require('../routes')).map((key) => {
    const entry = di.resolve(key);
    router.use(entry);
  });

  router.all(
      '*',
      (request, response, next) =>
        next(new errorClass.RESOURCE_NOT_FOUND_ERROR('route not found')),
  );
  return router;
};
