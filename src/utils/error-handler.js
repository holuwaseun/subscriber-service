'use strict';

module.exports = ({errorClass}) => {
  return (error) => {
    if (error instanceof errorClass.GATEWAY_ERROR) {
      return {
        code: error.code,
        message: `Gateway Error: ${error.message}`,
      };
    }

    if (error instanceof errorClass.VALIDATION_ERROR) {
      return {
        code: error.code,
        message: `Validation Error: ${error.message}`,
      };
    }

    if (error instanceof errorClass.AUTHORIZATION_ERROR) {
      return {
        code: error.code,
        message: `Authorization Error: ${error.message}`,
      };
    }

    if (error instanceof errorClass.RESOURCE_NOT_FOUND_ERROR) {
      return {
        code: error.code,
        message: `Resource Not Found Error: ${error.message}`,
      };
    }

    if (error instanceof errorClass.TYPE_ERROR) {
      return {
        code: error.code,
        message: `Type Error: ${error.message}`,
      };
    }

    if (error instanceof errorClass.RESOURCE_NOT_CREATED_ERROR) {
      return {
        code: error.code,
        message: `Resource Not Created Error: ${error.message}`,
      };
    }

    if (error instanceof errorClass.RESOURCE_NOT_DELETED_ERROR) {
      return {
        code: error.code,
        message: `Resource Not Deleted Error: ${error.message}`,
      };
    }

    return {
      code: error.code || 500,
      message: `Unknown Error: ${error.message}`,
    };
  };
};
