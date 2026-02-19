import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import './config'; // side-effect: registers the logger.level config descriptor via defineModuleConfig
import { AFFiNELogger } from './service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AFFiNELogger],
  exports: [AFFiNELogger],
})
export class LoggerModule { }

export { AFFiNELogger } from './service';
