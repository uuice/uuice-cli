import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { AuthorService } from '../../core/service'
import { AUTHOR } from '../../../types'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { LowdbUndefinedInterceptor } from '../interceptor/lowdb-undefined.interceptor'

@ApiTags('author')
@UseInterceptors(LowdbUndefinedInterceptor)
@Controller('author')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Get('queryList')
  @ApiOperation({
    summary: 'Get all the author',
    description: ''
  })
  queryList(): AUTHOR[] {
    return this.authorService.getAuthorList()
  }

  @Get('query/id/:id')
  @ApiOperation({
    summary: 'Get author by id',
    description: ''
  })
  queryById(@Param('id') id: string): AUTHOR | undefined {
    return this.authorService.getAuthorById(id)
  }

  @Get('query/title/:title')
  @ApiOperation({
    summary: 'Get author by title',
    description: ''
  })
  queryByTitle(@Param('title') title: string): AUTHOR | undefined {
    return this.authorService.getAuthorByTitle(title)
  }

  @Get('query/url/:url')
  @ApiOperation({
    summary: 'Get author by url',
    description: ''
  })
  queryByUrl(@Param('url') url: string): AUTHOR | undefined {
    return this.authorService.getAuthorByUrl(url)
  }
}
