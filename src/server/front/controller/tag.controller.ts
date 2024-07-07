import { Controller, Get, NotFoundException, Param, Render, Res } from '@nestjs/common'
import { mixedDataView, ViewData } from '../../core/helper/viewData'
import { SysConfigService, TagService } from '../../core/service'
import { Response } from 'express'

@Controller('tags')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly sysConfigService: SysConfigService
  ) {}

  @Get(':url')
  @Render('tag')
  index(@Param('url') url: string, @Res() res: Response) {
    const viewData = new ViewData()
    viewData.assign('pageType', 'Tag')
    viewData.assign('url', url)
    const tag = this.tagService.getTagByUrl(url)

    if (!tag) {
      throw new NotFoundException('Tag not found')
    }

    viewData.assign('tag', tag)
    viewData.assign(res.locals)
    viewData.assign('sysConfig', this.sysConfigService.getSysConfig())
    return mixedDataView(viewData).assign()
  }
}
