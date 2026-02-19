import { type LogLevel } from '@nestjs/common';
import { z } from 'zod';

import { defineModuleConfig } from '../config';

// All log levels supported by NestJS
const LOG_LEVELS: LogLevel[] = [
    'verbose',
    'debug',
    'log',
    'warn',
    'error',
    'fatal',
];

declare global {
    interface AppConfigSchema {
        logger: {
            // Minimum log level to output; messages below this level will be suppressed.
            // e.g. setting 'warn' will only emit warn / error / fatal messages.
            level: ConfigItem<LogLevel>;
        };
    }
}

defineModuleConfig('logger', {
    level: {
        desc: `Minimum log level to output. One of: ${LOG_LEVELS.join(', ')}.`,
        default: 'log' as LogLevel,
        env: 'LOG_LEVEL',
        shape: z.enum(['verbose', 'debug', 'log', 'warn', 'error', 'fatal']),
    },
});
