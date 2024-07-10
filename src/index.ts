// export service, types, nunjucks, app NestExpressApplication
import lodash from 'lodash'
import moment from 'moment'
import * as nunjucks from 'nunjucks'
import {
  CategoryService,
  ConfigService,
  DbService,
  JsonService,
  PageService,
  PostService,
  SysConfigService,
  TagService,
  YmlService
} from './server/core/service'

export * from './server/core/service'
export * from './types'
export * as nunjucks from 'nunjucks'
export { NestExpressApplication } from '@nestjs/platform-express'

export {
  moment,
  lodash,
  CategoryService,
  ConfigService,
  DbService,
  JsonService,
  PageService,
  PostService,
  SysConfigService,
  TagService,
  YmlService
}

export interface CustomTagOptions {
  env: nunjucks.Environment
  categoryService: CategoryService
  configService: ConfigService
  dbService: DbService
  jsonService: JsonService
  pageService: PageService
  postService: PostService
  sysConfigService: SysConfigService
  tagService: TagService
  ymlService: YmlService
}
