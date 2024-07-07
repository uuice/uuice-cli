import { Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { ApiModule } from './api/api.module'
import { FrontModule } from './front/front.module'

@Module({
  imports: [CoreModule, ApiModule, FrontModule]
})
export class AppModule {}
