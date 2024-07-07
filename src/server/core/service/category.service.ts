import { Injectable } from '@nestjs/common'
import { DbService } from './db.service'
import { CATEGORY, CATEGORY_WITH_POST_NUM } from '../../../types'

@Injectable()
export class CategoryService {
  constructor(private dbService: DbService) {}

  getCategoryList(): CATEGORY[] {
    return this.dbService.getInstance().get('categories').value() || []
  }

  getCategoryById(id: string): CATEGORY | undefined {
    return this.dbService
      .getInstance()
      .get('categories')
      .find({
        id
      })
      .value()
  }

  getCategoryByTitle(title: string): CATEGORY | undefined {
    return this.dbService
      .getInstance()
      .get('categories')
      .find({
        title
      })
      .value()
  }

  getCategoryByUrl(url: string): CATEGORY | undefined {
    return this.dbService
      .getInstance()
      .get('categories')
      .find({
        url
      })
      .value()
  }

  getCategoryListWidthPostNum(): CATEGORY_WITH_POST_NUM[] {
    const list = this.dbService.getInstance().get('categories').value() || []
    return list.map((item: CATEGORY) => {
      const postCategoryList =
        this.dbService
          .getInstance()
          .get('postCategories')
          .filter({
            categoryId: item.id
          })
          .value() || []
      return {
        ...item,
        postNum: postCategoryList.length
      }
    })
  }
}
