import { Injectable } from '@nestjs/common'
import { DbService } from './db.service'
import { omit } from 'lodash'
import { AUTHOR } from '../../../types'

@Injectable()
export class AuthorService {
  constructor(private dbService: DbService) {}

  getAuthorList(): AUTHOR[] {
    return (
      this.dbService
        .getInstance()
        .get('authors')
        .map((item: AUTHOR) => omit(item, ['content', 'mdContent', 'toc']))
        // .sortBy('created_timestamp')
        .orderBy('created_timestamp', 'desc')
        .value() || []
    )
  }

  getAuthorById(id: string): AUTHOR | undefined {
    return this.dbService
      .getInstance()
      .get('authors')
      .find({
        id
      })
      .value()
  }

  getAuthorByTitle(title: string): AUTHOR | undefined {
    return this.dbService
      .getInstance()
      .get('authors')
      .find({
        title
      })
      .value()
  }

  getAuthorByAlias(alias: string): AUTHOR | undefined {
    return this.dbService
      .getInstance()
      .get('authors')
      .find({
        alias
      })
      .value()
  }

  getAuthorByUrl(url: string): AUTHOR | undefined {
    return this.dbService
      .getInstance()
      .get('authors')
      .find({
        url
      })
      .value()
  }
}
