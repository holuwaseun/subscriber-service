'use strict';

require('dotenv').config({});

const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const {Server: httpServer} = require('http');
const morgan = require('morgan');
const di = require('./src/utils/di');

const run = async () => {
  const start = new Date();
  const logger = di.resolve('logger');

  try {
    const responseHandler = di.resolve('responseHandler');
    const router = di.resolve('router');
    const store = di.resolve('store');
    const docs = di.resolve('docs');

    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(compression());

    const server = httpServer(app);

    app.use(bodyParser.urlencoded({
      extended: true,
      limit: '100mb',
    }));
    app.use(bodyParser.json({
      limit: '100mb',
    }));

    app.use('/docs', docs.serve(), docs.handle());
    app.use(morgan(
        ':method :url :status :res[content-length] - :response-time ms',
    ));

    app.use(store.server.baseUrl, router);

    server.on('listening', (error) => {
      if (error) {
        logger.error(error.message, error);
        process.exit(1);
      }

      logger.info('subscriber service started', {
        pid: process.pid,
        port: store.server.port,
        baseUrl: store.server.baseUrl,
      });
      const end = new Date();
      logger.info('app metrics', {
        startup: `${ end.getTime() - start.getTime() }ms`,
      });
    });

    app.use(
        (error, request, response, next) =>
          responseHandler.handleResponse({request, response, error}),
    );

    server.listen(store.server.port, (error) => {
      if (
        process.env.NODE_APP_INSTANCE === '0' || !process.env.NODE_APP_INSTANCE
      ) {
        logger.info('main process started', {
          pid: process.pid,
          port: store.server.port,
          baseUrl: store.server.baseUrl,
          instance: store.server.instance,
        });
      }
    });

    process.on('SIGINT', async () => {
      logger.info(`shutting down application`);
      process.exit();
    });

    process.on(
        'unhandledRejection', (error) =>
          console.error('Unhandled Rejection:', error, error.stack),
    );
    process.on(
        'uncaughtException', (error) =>
          console.error('Uncaught Exception:', error, error.stack),
    );
  } catch (error) {
    console.log(error);
    logger.error(error.message, error);
    process.exit(1);
  }
};

run().catch((error) => {
  console.log(error);
  process.exit(1);
});
