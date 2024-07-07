import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { JSON_OBJ } from '../../../types'
import { JsonService } from '../../core/service'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { LowdbUndefinedInterceptor } from '../interceptor/lowdb-undefined.interceptor'

@ApiTags('json')
@UseInterceptors(LowdbUndefinedInterceptor)
@Controller('json')
export class JsonController {
  constructor(private jsonService: JsonService) {}

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
    return this.jsonService.getJsonByAlias(alias)
  }
}
