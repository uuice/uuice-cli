import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { PostService } from '../../core/service'
import {
  ARCHIVES_DATE_YEAR,
  ARCHIVES_DATE_YEAR_MONTH,
  LIST_POST_ITEM,
  POST,
  POST_PAGE_QUERY
} from '../../../types'
import { LowdbUndefinedInterceptor } from '../interceptor/lowdb-undefined.interceptor'
import { isNumber } from 'lodash'

@ApiTags('post')
@UseInterceptors(LowdbUndefinedInterceptor)
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('queryListByRecent/:num')
  @ApiOperation({
    summary: 'Get the latest N records',
    description: ''
  })
  queryListByRecent(@Param('num') num: number): LIST_POST_ITEM[] {
    return this.postService.getRecentPosts(num)
  }

  @Get('archivesByDateYear')
  @ApiOperation({
    summary: 'Articles are archived through the years',
    description: ''
  })
  archivesByDateYear(): ARCHIVES_DATE_YEAR {
    return this.postService.getArchivesByDateYear()
  }

  @Get('archivesByDateYearAndMonth')
  @ApiOperation({
    summary: 'Articles are archived through the years and months',
    description: ''
  })
  archivesByDateYearAndMonth(): ARCHIVES_DATE_YEAR_MONTH {
    return this.postService.getArchivesByDateYearAndMonth()
  }

  @Get('archivesByCategory')
  @ApiOperation({
    summary: 'Articles are archived by categories',
    description: ''
  })
  archivesByCategory(): ARCHIVES_DATE_YEAR {
    return this.postService.getArchivesByCategory()
  }

  @Get('archivesByTag')
  @ApiOperation({
    summary: 'Articles are archived by tags',
    description: ''
  })
  archivesByTag(): ARCHIVES_DATE_YEAR {
    return this.postService.getArchivesByTag()
  }

  @Get('query/id/:id')
  @ApiOperation({
    summary: 'Get post by id',
    description: ''
  })
  queryById(@Param('id') id: string): POST | undefined {
    return this.postService.getPostById(id)
  }

  @Get('query/title/:title')
  @ApiOperation({
    summary: 'Get post by title',
    description: ''
  })
  queryByTitle(@Param('title') title: string): POST | undefined {
    return this.postService.getPostByTitle(title)
  }

  @Get('query/url/:url')
  @ApiOperation({
    summary: 'Get post by url',
    description: ''
  })
  queryByUrl(@Param('url') url: string): POST | undefined {
    return this.postService.getPostByUrl(url)
  }

  @Get('queryByAlias/:alias')
  @ApiOperation({
    summary: 'Get post by alias',
    description: ''
  })
  queryByAlias(@Param('alias') alias: string): POST | undefined {
    return this.postService.getPostByAlias(alias)
  }

  @Get('pageQuery')
  @ApiOperation({
    summary: "Gets the paging query for post without 'content' | 'mdContent' | 'toc'",
    description: ''
  })
  @ApiQuery({
    name: 'pageIndex',
    description: 'Current page index',
    type: 'number'
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'per page size',
    type: 'number',
    required: false
  })
  pageQuery(@Query() query: { pageIndex: number; pageSize?: number }): POST_PAGE_QUERY {
    const parsedPage = isNumber(query.pageIndex) ? query.pageIndex : parseInt(query.pageIndex, 10)
    const parsedPageSize = isNumber(query.pageSize) ? query.pageSize : parseInt(query.pageSize, 10)
    return this.postService.getPageQuery(parsedPage, parsedPageSize || 10)
  }

  @Get('prevPost')
  @ApiOperation({
    summary: 'Get the previous post',
    description: ''
  })
  @ApiQuery({
    name: 'postId',
    description: 'The current post id',
    type: 'string'
  })
  prevPost(@Query() query: { postId: string }): LIST_POST_ITEM | undefined {
    return this.postService.getPrevPostByPostId(query.postId)
  }

  @Get('nextPost')
  @ApiOperation({
    summary: 'Get the next post',
    description: ''
  })
  @ApiQuery({
    name: 'postId',
    description: 'The current post id',
    type: 'string'
  })
  nextPost(@Query() query: { postId: string }): LIST_POST_ITEM | undefined {
    return this.postService.getNextPostByPostId(query.postId)
  }
}
