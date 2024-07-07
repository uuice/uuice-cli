import { Controller, Get, Render } from '@nestjs/common'
import { mixedDataView, ViewData } from '../../core/helper/viewData'
import { SysConfigService } from '../../core/service'

@Controller('test')
export class TestController {
  constructor(private readonly sysConfigService: SysConfigService) {}

  @Get('')
  @Render('test')
  index() {
    const viewData = new ViewData()
    viewData.assign('sysConfig', this.sysConfigService.getSysConfig())
    return mixedDataView(viewData).assign()
  }
}
