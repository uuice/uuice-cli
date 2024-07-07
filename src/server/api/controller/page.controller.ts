import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PageService } from '../../core/service'
import { LIST_PAGE_ITEM, PAGE } from '../../../types'
import { LowdbUndefinedInterceptor } from '../interceptor/lowdb-undefined.interceptor'

@ApiTags('page')
@UseInterceptors(LowdbUndefinedInterceptor)
@Controller('page')
export class PageController {
  constructor(private pageService: PageService) {}

  @Get('queryList')
  @ApiOperation({
    summary: "Get the page list without 'content' | 'mdContent' | 'toc'",
    description: ''
  })
  queryList(): LIST_PAGE_ITEM[] {
    return this.pageService.getPageList()
  }

  @Get('query/alias/:alias')
  @ApiOperation({
    summary: 'Get page by alias',
    description: ''
  })
  queryByAlias(@Param('alias') alias: string): PAGE | undefined {
    return this.pageService.getPageByAlias(alias)
  }

  @Get('query/id/:id')
  @ApiOperation({
    summary: 'Get page by title',
    description: ''
  })
  queryById(@Param('id') id: string): PAGE | undefined {
    return this.pageService.getPageById(id)
  }

  @Get('query/title/:title')
  @ApiOperation({
    summary: 'Get page by id or title',
    description: ''
  })
  queryByTitle(@Param('title') title: string): PAGE | undefined {
    return this.pageService.getPageByTitle(title)
  }

  @Get('query/url/:url')
  @ApiOperation({
    summary: 'Get page by url',
    description: ''
  })
  queryByUrl(@Param('url') url: string): PAGE | undefined {
    return this.pageService.getPageByUrl(url)
  }
}
