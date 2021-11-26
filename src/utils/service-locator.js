'use strict';

const {
  createContainer, asValue, asFunction, asClass,
} = require('awilix');

const serviceLocator = createContainer();

const ServiceLocator = {
  isLive: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV === 'development',
};

ServiceLocator.instance = serviceLocator;

serviceLocator.register(
    'di',
    asFunction(() => serviceLocator).singleton(),
);

serviceLocator.register(
    '_CONTAINER_',
    asFunction(() => ServiceLocator).singleton(),
);

ServiceLocator.registerValue = ({tag, handler}) =>
  serviceLocator.register(tag, asValue(handler));

ServiceLocator.registerClass = ({tag, handler, singleton = false}) => {
  if (!singleton) return serviceLocator.register(tag, asClass(handler));
  return serviceLocator.register(tag, asClass(handler).singleton());
};

ServiceLocator.registerFunction = ({tag, handler}) =>
  serviceLocator.register(tag, asFunction(handler));

ServiceLocator.registerSingleton = ({tag, handler}) =>
  serviceLocator.register(tag, asFunction(handler).singleton());

module.exports = ServiceLocator;
