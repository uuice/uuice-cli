import { MiddlewareConsumer, Module, SetMetadata } from '@nestjs/common'
import { MODULE_PATH } from '@nestjs/common/constants'
import { PostController } from './controller/post.controller'
import { TagController } from './controller/tag.controller'
import { CategoryController } from './controller/category.controller'
import { SysConfigController } from './controller/sys-config.controller'
import { JsonController } from './controller/json.controller'
import { CoreModule } from '../core/core.module'
import { PageController } from './controller/page.controller'
import { LowdbUndefinedMiddleware } from './middleware/lowdb-undefined.middleware'
import { YmlController } from './controller/yml.controller'

@SetMetadata(MODULE_PATH, '/api')
@Module({
  imports: [CoreModule],
  controllers: [
    PageController,
    PostController,
    TagController,
    CategoryController,
    SysConfigController,
    JsonController,
    YmlController
  ]
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LowdbUndefinedMiddleware).forRoutes('*')
  }
}
