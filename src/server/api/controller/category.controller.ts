import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CATEGORY, CATEGORY_WITH_POST_NUM } from '../../../types'
import { CategoryService } from '../../core/service'
import { LowdbUndefinedInterceptor } from '../interceptor/lowdb-undefined.interceptor'

@ApiTags('category')
@UseInterceptors(LowdbUndefinedInterceptor)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('queryList')
  @ApiOperation({
    summary: 'Get all the categories',
    description: ''
  })
  queryList(): CATEGORY[] {
    return this.categoryService.getCategoryList()
  }

  @Get('queryListWithPostNum')
  @ApiOperation({
    summary: 'Get all categories and count the number of articles in each category',
    description: ''
  })
  queryListWithPostNum(): CATEGORY_WITH_POST_NUM[] {
    return this.categoryService.getCategoryListWidthPostNum()
  }

  @Get('query/id/:id')
  @ApiOperation({
    summary: 'Get category by id',
    description: ''
  })
  queryById(@Param('id') id: string): CATEGORY | undefined {
    return this.categoryService.getCategoryById(id)
  }

  @Get('query/title/:title')
  @ApiOperation({
    summary: 'Get category by title',
    description: ''
  })
  queryByTitle(@Param('title') title: string): CATEGORY | undefined {
    return this.categoryService.getCategoryByTitle(title)
  }

  @Get('query/url/:url')
  @ApiOperation({
    summary: 'Get category by url',
    description: ''
  })
  queryByUrl(@Param('url') url: string): CATEGORY | undefined {
    return this.categoryService.getCategoryByUrl(url)
  }
}
