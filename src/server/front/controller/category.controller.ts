import { Controller, Get, NotFoundException, Param, Render } from '@nestjs/common'
import { CategoryService, SysConfigService } from '../../core/service'
import { mixedDataView, ViewData } from '../../core/helper/viewData'

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly sysConfigService: SysConfigService
  ) {}

  @Get(':url')
  @Render('category')
  index(@Param('url') url: string) {
    // default month
    const viewData = new ViewData()
    viewData.assign('pageType', 'Category')
    viewData.assign('url', url)

    const category = this.categoryService.getCategoryByUrl(url)

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    viewData.assign('category', category)
    viewData.assign('sysConfig', this.sysConfigService.getSysConfig())
    return mixedDataView(viewData).assign()
  }
}
