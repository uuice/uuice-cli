import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService, CWD, SysConfigService } from '../core/service'
import { join } from 'node:path'
import * as nunjucks from 'nunjucks'

import moment from 'moment'
import _ from 'lodash'
import { Console, date, shorten, stripHtml, symbolsCount, titleToUrl } from './filter'
import { dateFormat, getColor } from './function'
import {
  CategoryItem,
  CategoryList,
  JsonConfig,
  PageItem,
  PageList,
  PostArchive,
  PostItem,
  PostListByCategory,
  PostListByTag,
  PostNext,
  PostPageList,
  PostPrev,
  PostRecent,
  SysConfig,
  SysConfigItem,
  TagItem,
  TagList,
  TagTest,
  TagTest2,
  YmlConfig
} from './tag'
import { glob } from 'glob'
import { compileAndLoadCode } from '../../utils/compileAndLoadCode'

export async function initView(app: NestExpressApplication): Promise<void> {
  const sysConfigService = app.get(SysConfigService)
  const configService = app.get(ConfigService)
  const theme = sysConfigService.getSysConfig('theme')
  const cwd = configService.getItem(CWD) as string

  const viewsPath = join(cwd, 'themes', theme, 'views')
  const assetsPath = join(cwd, 'themes', theme, 'assets')
  const env: nunjucks.Environment = nunjucks.configure(viewsPath, {
    autoescape: true,
    watch: true,
    noCache: process.env.NODE_ENV === 'dev',
    express: app
  })

  await initTmpExtend(env, app)

  app.useStaticAssets(assetsPath, { prefix: '/assets/' })
  app.setBaseViewsDir(viewsPath)
  app.engine('njk', env.render)
  app.setViewEngine('njk')

  // set renderString to app
  app.set('viewInstance', env)
}

async function initTmpExtend(env: nunjucks.Environment, app: NestExpressApplication) {
  // const sysConfigService = app.get(SysConfigService)
  // const sysConfig = await sysConfigService.getSysConfig()
  // add global variables and function
  // ! Already injected through middleware
  // env.addGlobal('sysConfig', sysConfig)
  env.addGlobal('dateFormat', dateFormat)
  env.addGlobal('moment', moment)
  env.addGlobal('_', _)
  env.addGlobal('getColor', getColor)
  // Add helper function

  // filter
  env.addFilter('shorten', shorten)
  env.addFilter('console', Console)
  env.addFilter('date', date)
  env.addFilter('symbolsCount', symbolsCount)
  env.addFilter('stripHtml', stripHtml)
  env.addFilter('titleToUrl', titleToUrl)

  // tags
  env.addExtension('TagTest', new TagTest(app))
  env.addExtension('TagTest2', new TagTest2(app))
  // sysConfig tags
  env.addExtension('SysConfig', new SysConfig(app))
  env.addExtension('SysConfigItem', new SysConfigItem(app))
  // page tags
  env.addExtension('PageList', new PageList(app))
  env.addExtension('PageItem', new PageItem(app))
  // category tags
  env.addExtension('CategoryList', new CategoryList(app))
  env.addExtension('CategoryItem', new CategoryItem(app))
  // tag tags
  env.addExtension('TagList', new TagList(app))
  env.addExtension('TagItem', new TagItem(app))
  // json tags
  env.addExtension('JsonConfig', new JsonConfig(app))
  // yml tags
  env.addExtension('YmlConfig', new YmlConfig(app))

  // post tags
  env.addExtension('PostPageList', new PostPageList(app))
  env.addExtension('PostItem', new PostItem(app))
  env.addExtension('PostRecent', new PostRecent(app))
  env.addExtension('PostArchive', new PostArchive(app))
  env.addExtension('PostListByCategory', new PostListByCategory(app))
  env.addExtension('PostListByTag', new PostListByTag(app))
  env.addExtension('PostPrev', new PostPrev(app))
  env.addExtension('PostNext', new PostNext(app))

  // Dynamically get user-defined filters, functions, tags and load them to the system
  // use glob patterns get file paths\
  const configService = app.get(ConfigService)
  const cwd = configService.getItem(CWD) as string
  const userFilterPath = join(cwd, 'extend/filter', '**', '*.ts')
  const userFunctionPath = join(cwd, 'extend/function', '**', '*.ts')
  const userTagPath = join(cwd, 'extend/tag', '**', '*.ts')

  const jsonUserFilterList: string[] = await glob(userFilterPath.replace(/\\/g, '/'), {
    ignore: ['node_modules/**', '**/*.d.ts']
  })

  for (const path of jsonUserFilterList) {
    const { name, command } = await compileAndLoadCode(path)
    console.log(name, command)
    env.addFilter(name, command)
  }

  const jsonUserFunctionList: string[] = await glob(userFunctionPath.replace(/\\/g, '/'), {
    ignore: ['node_modules/**', '**/*.d.ts']
  })

  for (const path of jsonUserFunctionList) {
    const { name, command } = await compileAndLoadCode(path)
    console.log(name, command)
    env.addGlobal(name, command)
  }

  const jsonUserTagList: string[] = await glob(userTagPath.replace(/\\/g, '/'), {
    ignore: ['node_modules/**', '**/*.d.ts']
  })
  for (const path of jsonUserTagList) {
    const { name, Command } = await compileAndLoadCode(path)
    console.log(name, Command)
    env.addExtension(name, new Command(app))
  }
}
