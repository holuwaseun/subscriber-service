'use strict';

module.exports = ({SubscriberController, validator, express}) => {
  const {Router: expressRouter} = express;

  const router = expressRouter();

  router.route('/:topic')
      .post(validator.validateRequest(), SubscriberController.processMessage());

  return router;
};
