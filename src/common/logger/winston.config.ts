import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const logDir = join(process.cwd(), 'logs');

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      level: isProduction ? 'info' : 'debug',
      format: isProduction
        ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          )
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('NestApp', {
              prettyPrint: true,
              colors: true,
            }),
          ),
    }),

    new winston.transports.File({
      dirname: logDir,
      filename: 'app-error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),

    new winston.transports.File({
      dirname: logDir,
      filename: 'app-combined.log',
      level: isProduction ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),
  ],
};
