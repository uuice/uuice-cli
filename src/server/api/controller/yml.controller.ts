import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { JSON_OBJ } from '../../../types'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { LowdbUndefinedInterceptor } from '../interceptor/lowdb-undefined.interceptor'
import { YmlService } from '../../core/service'

@ApiTags('yml')
@UseInterceptors(LowdbUndefinedInterceptor)
@Controller('yml')
export class YmlController {
  constructor(private ymlService: YmlService) {}

  @Get('query/:alias')
  @ApiOperation({
    summary: 'Get the json file content',
    description: ''
  })
  @ApiParam({
    name: 'alias',
    description: 'The name of json file',
    type: 'string'
  })
  query(@Param('alias') alias: string): JSON_OBJ | undefined {
    return this.ymlService.getYmlByAlias(alias)
  }
}
