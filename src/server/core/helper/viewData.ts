export class ViewData {
  private readonly viewData = {}

  constructor() {
    this.viewData = {}
  }

  /**
   *
   * @param name
   * @param value
   */
  assign(name?: string | undefined | object, value?: object | string | number | undefined) {
    if (name === undefined) {
      return this.viewData
    } else if (value === undefined) {
      if (typeof name === 'string') {
        return this.viewData[name]
      } else {
        for (const key in name) {
          this.viewData[key] = name[key]
        }
      }
    } else {
      if (typeof name === 'string') {
        this.viewData[name] = value
      }
    }
  }
}

export const mixedDataView = (viewData: ViewData): ViewData => {
  const pageType = viewData.assign('pageType')
  const pageIndex = viewData.assign('pageIndex')
  const typeObj = {
    isCurrent: true,
    isIndex: pageType === 'Index',
    isIndexFirstPage: pageType === 'Index' && pageIndex === 1,
    isPost: pageType === 'Post',
    isPage: pageType === 'Page',
    isTag: pageType === 'Tag',
    isCategory: pageType === 'Category',
    isArchive: pageType === 'Archive',
    isLink: pageType === 'Link'
  }
  viewData.assign(typeObj)
  return viewData
}
