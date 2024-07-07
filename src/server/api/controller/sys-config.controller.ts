import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { JSON_OBJ } from '../../../types'
import { SysConfigService } from '../../core/service'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { LowdbUndefinedInterceptor } from '../interceptor/lowdb-undefined.interceptor'

@ApiTags('sysConfig')
@UseInterceptors(LowdbUndefinedInterceptor)
@Controller('sys-config')
export class SysConfigController {
  constructor(private sysConfigService: SysConfigService) {}

  @Get('query')
  @ApiOperation({
    summary: 'Get system config',
    description: 'Get the system configuration in the root directory config.yml'
  })
  query(): JSON_OBJ {
    return this.sysConfigService.getSysConfig()
  }

  @Get('queryWithPath/:path')
  @ApiParam({
    name: 'path',
    description: 'The path of object',
    type: 'string'
  })
  @ApiOperation({
    summary: 'Get config by path',
    description:
      'Gets the value at path of object. If the resolved value is undefined, the defaultValue is returned in its place'
  })
  queryWithPath(@Param('path') path: string): string | boolean | object | undefined {
    return this.sysConfigService.getSysConfig(path)
  }
}
