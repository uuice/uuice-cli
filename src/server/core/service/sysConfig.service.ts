import { Injectable } from '@nestjs/common'
import { DbService } from './db.service'
import { get } from 'lodash'

@Injectable()
export class SysConfigService {
  constructor(private dbService: DbService) {}

  getSysConfig(path?: string) {
    const config = this.dbService.getInstance().get('systemConfig').value()
    if (!config) return ''
    return path ? get(config, path, '') : config
  }
}
