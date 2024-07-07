import { PAGE } from './page'
import { ARTICLE } from './article'

export interface POST extends ARTICLE {}

export type LIST_POST_ITEM = Omit<POST, 'content' | 'mdContent' | 'toc'>

export type ARCHIVES_DATE_YEAR = { [date: string]: LIST_POST_ITEM[] }[]

export type ARCHIVES_DATE_YEAR_MONTH = { [date: string]: ARCHIVES_DATE_YEAR }[]

export type POST_PAGE_QUERY = {
  pageIndex: number
  pageCount: number
  prevPageIndex: number
  nextPageIndex: number
  pageSize: number
  postList: Omit<PAGE, 'content' | 'mdContent' | 'toc'>[]
}
