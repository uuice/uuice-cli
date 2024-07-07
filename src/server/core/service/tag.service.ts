import { Injectable } from '@nestjs/common'
import { TAG, TAG_WITH_POST_NUM } from '../../../types'
import { DbService } from './db.service'

@Injectable()
export class TagService {
  constructor(private dbService: DbService) {}

  getTagList(): TAG[] {
    return this.dbService.getInstance().get('tags').value() || []
  }

  getTagById(id: string): TAG | undefined {
    return this.dbService
      .getInstance()
      .get('tags')
      .find({
        id
      })
      .value()
  }

  getTagByTitle(title: string): TAG | undefined {
    return this.dbService
      .getInstance()
      .get('tags')
      .find({
        title
      })
      .value()
  }

  getTagByUrl(url: string): TAG | undefined {
    return this.dbService
      .getInstance()
      .get('tags')
      .find({
        url
      })
      .value()
  }

  getTagListWidthPostNum(): TAG_WITH_POST_NUM[] {
    const list = this.dbService.getInstance().get('tags').value() || []
    return list.map((item: TAG) => {
      const postTagList =
        this.dbService
          .getInstance()
          .get('postTags')
          .filter({
            tagId: item.id
          })
          .value() || []
      return {
        ...item,
        postNum: postTagList.length
      }
    })
  }
}
