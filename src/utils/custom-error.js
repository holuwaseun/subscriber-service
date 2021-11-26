'use strict';

const CustomError = {};

/**
 * Validation Error
 */
class ValidationError extends Error {
  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.code = 400;
    this.name = 'ValidationError';
  }
}

/**
 * Server Error
 */
class ServerError extends Error {
  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.code = 500;
    this.name = 'ServerError';
  }
}

/**
 * Type Error
 */
class TypeError extends ServerError {
  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'TypeError';
  }
}

/**
 * Socket Error
 */
class SocketError extends ServerError {
  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'SocketError';
  }
}

/**
 * Authorization Error
 */
class AuthorizationError extends Error {
  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.code = 401;
    this.name = 'AuthorizationError';
  }
}

/**
 * Resource Not Found Error
 */
class ResourceNotFoundError extends Error {
  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.code = 404;
    this.name = 'ResourceNotFoundError';
  }
}

/**
 * Resource Not Created Error
 */
class ResourceNotCreatedError extends ServerError {
  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'ResourceNotCreatedError';
  }
}

/**
 * Resource Not Deleted Error
 */
class ResourceNotDeletedError extends ServerError {
  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'ResourceNotDeletedError';
  }
}

/**
 * Gateway Error
 */
class GatewayError extends Error {
  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.code = 400;
    this.name = 'GatewayError';
  }
}

CustomError['SERVER_ERROR'] = ServerError;
CustomError['TYPE_ERROR'] = TypeError;
CustomError['VALIDATION_ERROR'] = ValidationError;
CustomError['AUTHORIZATION_ERROR'] = AuthorizationError;
CustomError['RESOURCE_NOT_FOUND_ERROR'] = ResourceNotFoundError;
CustomError['RESOURCE_NOT_CREATED_ERROR'] = ResourceNotCreatedError;
CustomError['RESOURCE_NOT_DELETED_ERROR'] = ResourceNotDeletedError;
CustomError['SOCKET_ERROR'] = SocketError;
CustomError['GATEWAY_ERROR'] = GatewayError;

module.exports = CustomError;
