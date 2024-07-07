import { ARTICLE } from './article'

export interface PAGE extends ARTICLE {}

export type LIST_PAGE_ITEM = Omit<PAGE, 'content' | 'mdContent' | 'toc'>
