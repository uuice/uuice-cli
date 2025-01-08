import { Controller, Get, NotFoundException, Param, Render } from '@nestjs/common'
import { mixedDataView, ViewData } from '../../core/helper/viewData'
import { AuthorService, SysConfigService } from '../../core/service'

@Controller('author')
export class AuthorController {
  constructor(
    private readonly sysConfigService: SysConfigService,
    private readonly authorService: AuthorService
  ) {}

  @Get(':url')
  @Render('author')
  index(@Param('url') url: string) {
    // default month
    const viewData = new ViewData()
    viewData.assign('pageType', 'Author')
    viewData.assign('url', url)
    const post = this.authorService.getAuthorByUrl(url)
    if (!post) {
      throw new NotFoundException('Author not found')
    }
    viewData.assign('pageType', 'Author')
    viewData.assign('sysConfig', this.sysConfigService.getSysConfig())
    return mixedDataView(viewData).assign()
  }
}
