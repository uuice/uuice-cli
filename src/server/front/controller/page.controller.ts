import { Controller, Get, NotFoundException, Param, Render } from '@nestjs/common'
import { PageService, SysConfigService } from '../../core/service'
import { mixedDataView, ViewData } from '../../core/helper/viewData'

@Controller('page')
export class PageController {
  constructor(
    private readonly pageService: PageService,
    private readonly sysConfigService: SysConfigService
  ) {}

  @Get(':url')
  @Render('page')
  async index(@Param('url') url: string) {
    const viewData = new ViewData()

    const page = this.pageService.getPageByUrl(url)
    if (!page) {
      throw new NotFoundException('Page not found')
    }
    viewData.assign('pageType', 'Page')
    viewData.assign('page', page)
    viewData.assign('sysConfig', this.sysConfigService.getSysConfig())
    return mixedDataView(viewData).assign()
  }
}
