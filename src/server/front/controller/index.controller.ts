import { Controller, Get, Param, ParseIntPipe, Render } from '@nestjs/common'
import { PostService, SysConfigService } from '../../core/service'
import { mixedDataView, ViewData } from '../../core/helper/viewData'

@Controller('')
export class IndexController {
  constructor(
    private readonly postService: PostService,
    private readonly sysConfigService: SysConfigService
  ) {}

  @Get('')
  @Render('index')
  index() {
    const viewData = new ViewData()
    viewData.assign('pageType', 'Index')
    const pageQueryList = this.postService.getPageQuery(1, 10)
    viewData.assign(pageQueryList)
    viewData.assign('sysConfig', this.sysConfigService.getSysConfig())
    return mixedDataView(viewData).assign()
  }

  @Get('page/:pageIndex')
  @Render('index')
  indexWidthPageIndex(@Param('pageIndex', ParseIntPipe) pageIndex: number) {
    const viewData = new ViewData()
    viewData.assign('pageType', 'Index')
    const pageQueryList = this.postService.getPageQuery(pageIndex, 10)
    viewData.assign(pageQueryList)
    viewData.assign('sysConfig', this.sysConfigService.getSysConfig())
    return mixedDataView(viewData).assign()
  }
}
