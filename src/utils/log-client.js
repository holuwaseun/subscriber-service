'use strict';

const {createLogger, transports, format} = require('winston');
const {timestamp, json} = format;
require('winston-daily-rotate-file');

module.exports = ({
  name = 'app', logToFile = false,
  filename = `combined`, fileLogLevel = null,
}) => {
  const transport = [new transports.Console()];

  if (logToFile && filename) {
    const fileTransportConfig = {
      filename: `${ filename }-%DATE%.log`,
      dirname: 'logs',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    };
    if (fileLogLevel) {
      fileTransportConfig['level'] = fileLogLevel;
    }
    transport.push(new transports.DailyRotateFile(fileTransportConfig));
  }

  return createLogger({
    defaultMeta: {component: name},
    format: format.combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), json()),
    transports: transport,
    exceptionHandlers: [
      new transports.Console(),
      new transports.DailyRotateFile({
        filename: `exception-%DATE%.log`,
        dirname: 'logs',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });
};
