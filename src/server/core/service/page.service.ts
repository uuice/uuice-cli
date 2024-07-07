import { Injectable } from '@nestjs/common'
import { DbService } from './db.service'
import { LIST_PAGE_ITEM, PAGE } from '../../../types'
import { omit } from 'lodash'

@Injectable()
export class PageService {
  constructor(private dbService: DbService) {}

  getPageByAlias(alias: string): PAGE | undefined {
    return this.dbService.getInstance().get('pages').find({ alias }).value()
  }

  getPageById(id: string): PAGE | undefined {
    return this.dbService
      .getInstance()
      .get('pages')
      .find({
        id
      })
      .value()
  }

  getPageByTitle(title: string): PAGE | undefined {
    return this.dbService
      .getInstance()
      .get('pages')
      .find({
        title
      })
      .value()
  }

  getPageByUrl(url: string): PAGE | undefined {
    return this.dbService
      .getInstance()
      .get('pages')
      .find({
        url
      })
      .value()
  }

  getPageList(): LIST_PAGE_ITEM[] {
    return (
      this.dbService
        .getInstance()
        .get('pages')
        .map((item: PAGE) => omit(item, ['content', 'mdContent', 'toc']))
        .value() || []
    )
  }
}
