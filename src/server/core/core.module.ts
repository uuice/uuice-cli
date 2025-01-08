import { Module } from '@nestjs/common'
import {
  AuthorService,
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
    YmlService,
    AuthorService
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
    YmlService,
    AuthorService
  ]
})
export class CoreModule {}
