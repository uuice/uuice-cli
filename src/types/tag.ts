export interface TAG {
  id: string
  title: string
  description: string
  url: string
}

export type TAG_WITH_POST_NUM = TAG & {
  postNum: number
}
