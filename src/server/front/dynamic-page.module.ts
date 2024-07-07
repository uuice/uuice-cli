import {
  Controller,
  DynamicModule,
  Get,
  Module,
  ModuleMetadata,
  Provider,
  Render
} from '@nestjs/common'
import { ConfigService, DbService, PageService, SysConfigService } from '../core/service'
import { CoreModule } from '../core/core.module'
import { mixedDataView, ViewData } from '../core/helper/viewData'
import { LIST_PAGE_ITEM } from '../../types'

function createPageController(alias: string) {
  @Controller(alias)
  class PageController {
    constructor(
      private readonly pageService: PageService,
      private readonly sysConfigService: SysConfigService
    ) {}

    @Get('')
    @Render('page')
    async getPage() {
      const viewData = new ViewData()

      const page = this.pageService.getPageByAlias(alias)
      viewData.assign('pageType', 'Page')
      viewData.assign('page', page)
      viewData.assign('sysConfig', this.sysConfigService.getSysConfig())
      return mixedDataView(viewData).assign()
    }
  }

  return PageController
}

@Module({
  imports: [CoreModule]
})
export class DynamicPageModule {
  constructor() {}

  static async forRoot(): Promise<DynamicModule> {
    const providers: Provider[] = []
    const controllers: ModuleMetadata['controllers'] = []
    const configService = new ConfigService()
    const dbService = new DbService(configService)
    await dbService.initDb()
    const pageService = new PageService(dbService)
    const pages = pageService.getPageList()
    pages.forEach((page: LIST_PAGE_ITEM) => {
      controllers.push(createPageController(page.url as string))
    })
    return {
      module: DynamicPageModule,
      controllers,
      providers
    }
  }
}
