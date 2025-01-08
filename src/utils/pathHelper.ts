import { join } from 'node:path'
export type PATH_OBJECT = {
  sourcePath: string
  systemConfigPath: string
  dataBasePath: string
  pageDirPath: string
  postDirPath: string
  jsonDirPath: string
  ymlDirPath: string
  authorDirPath: string
  cacheDirPath: string
  pageTemplatePath: string
  postTemplatePath: string
  authorTemplatePath: string
  pageTemplatePathDefault: string
  postTemplatePathDefault: string
  authorTemplatePathDefault: string
}

export const getPathByCwd = (cwd = process.cwd()): PATH_OBJECT => {
  const sourcePath = join(cwd, 'source')
  return {
    sourcePath: join(cwd, 'source'),
    systemConfigPath: join(cwd, 'config.yml'),
    dataBasePath: join(cwd, 'data.json'),
    pageDirPath: join(sourcePath, '_pages'),
    postDirPath: join(sourcePath, '_posts'),
    jsonDirPath: join(sourcePath, '_jsons'),
    ymlDirPath: join(sourcePath, '_ymls'),
    authorDirPath: join(sourcePath, '_authors'),

    cacheDirPath: join(cwd, '.cache'),

    pageTemplatePath: join(cwd, 'templates', 'page.njk'),
    postTemplatePath: join(cwd, 'templates', 'post.njk'),
    authorTemplatePath: join(cwd, 'templates', 'author.njk'),

    pageTemplatePathDefault: join(__dirname, '../templates', 'page.njk'),
    postTemplatePathDefault: join(__dirname, '../templates', 'post.njk'),
    authorTemplatePathDefault: join(__dirname, '../templates', 'author.njk')
  }
}
