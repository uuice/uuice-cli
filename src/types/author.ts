import { ARTICLE } from './article'
export interface AUTHOR extends Omit<ARTICLE, 'authorId'> {
  isDefault: boolean
}
