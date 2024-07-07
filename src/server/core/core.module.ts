import { Module } from '@nestjs/common'
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
} from './service'

@Module({
  providers: [
    DbService,
    PostService,
    TagService,
    CategoryService,
    ConfigService,
    PageService,
    SysConfigService,
    JsonService,
    YmlService
  ],
  exports: [
    DbService,
    PostService,
    TagService,
    CategoryService,
    ConfigService,
    PageService,
    SysConfigService,
    JsonService,
    YmlService
  ]
})
export class CoreModule {}
