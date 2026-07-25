import { type LogLevel } from '@nestjs/common';
import { z } from 'zod';

import { defineModuleConfig } from '../config';

export const logLevels = [
  'verbose',
  'debug',
  'log',
  'warn',
  'error',
  'fatal',
] as const satisfies readonly LogLevel[];

export type LoggerLevel = (typeof logLevels)[number];

export const enabledLogLevels = (minimumLevel: LoggerLevel): LogLevel[] => {
  return logLevels.slice(logLevels.indexOf(minimumLevel));
};

declare global {
  interface AppConfigSchema {
    logger: {
      level: ConfigItem<LoggerLevel>;
    };
  }
}

defineModuleConfig('logger', {
  level: {
    desc: `Minimum log level to output. One of: ${logLevels.join(', ')}.`,
    default: 'log',
    env: 'LOG_LEVEL',
    shape: z.enum(logLevels),
  },
});
