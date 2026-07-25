import './config';

import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { AFFiNELogger } from './service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AFFiNELogger],
  exports: [AFFiNELogger],
})
export class LoggerModule {}

export { enabledLogLevels, type LoggerLevel, logLevels } from './config';
export { AFFiNELogger } from './service';
