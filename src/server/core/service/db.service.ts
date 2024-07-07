import { Injectable } from '@nestjs/common'
import { ConfigService, DB_PATH } from './config.service'

import { JSONFile } from '../../../lowdb/node'
import { LowWithLodash } from '../../../lowdb'

@Injectable()
export class DbService {
  private db: any

  constructor(private configService: ConfigService) {}

  getInstance() {
    return this.db.chain
  }

  async initDb() {
    const adapter = new JSONFile(this.configService.getItem(DB_PATH) as string)
    this.db = new LowWithLodash(adapter, {})
    await this.db.read()
  }

  async reload() {
    const adapter = new JSONFile(this.configService.getItem(DB_PATH) as string)
    this.db = new LowWithLodash(adapter, {})
    await this.db.read()
  }
}
