import { Injectable } from '@nestjs/common'
import { DbService } from './db.service'
import { JSON_OBJ } from '../../../types'

@Injectable()
export class JsonService {
  constructor(private dbService: DbService) {}

  /**
   * alias is the json file name
   * @param alias
   */
  getJsonByAlias(alias: string): JSON_OBJ | undefined {
    return this.dbService.getInstance().get(`${alias}Config`).value()
  }
}
