import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { TagService } from '../../core/service'
import { TAG } from '../../../types'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { LowdbUndefinedInterceptor } from '../interceptor/lowdb-undefined.interceptor'

@ApiTags('tag')
@UseInterceptors(LowdbUndefinedInterceptor)
@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get('queryList')
  @ApiOperation({
    summary: 'Get all the tags',
    description: ''
  })
  queryList(): TAG[] {
    return this.tagService.getTagList()
  }

  @Get('queryListWithPostNum')
  @ApiOperation({
    summary: 'Get all tags and count the number of articles in each tag',
    description: ''
  })
  queryListWithPostNum(): TAG[] {
    return this.tagService.getTagListWidthPostNum()
  }

  @Get('query/id/:id')
  @ApiOperation({
    summary: 'Get tag by id',
    description: ''
  })
  queryById(@Param('id') id: string): TAG | undefined {
    return this.tagService.getTagById(id)
  }

  @Get('query/title/:title')
  @ApiOperation({
    summary: 'Get tag by title',
    description: ''
  })
  queryByTitle(@Param('title') title: string): TAG | undefined {
    return this.tagService.getTagByTitle(title)
  }

  @Get('query/url/:url')
  @ApiOperation({
    summary: 'Get tag by url',
    description: ''
  })
  queryByUrl(@Param('url') url: string): TAG | undefined {
    return this.tagService.getTagByUrl(url)
  }
}
