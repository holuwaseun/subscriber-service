'use strict';

module.exports = ({joi}) => {
  return {
    '/:topic': {
      post: {
        params: {
          topic: joi.string().required(),
        },
      },
    },
  };
};
