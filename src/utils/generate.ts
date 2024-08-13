import { glob } from 'glob'
import { CATEGORY, JSON_OBJ, PAGE, POST, POST_CATEGORY, POST_TAG, TAG } from '../types'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import matter from 'gray-matter'
import { join, parse } from 'node:path'
import { markdownToHtml, markdownToToc } from './markdown'
import * as yaml from 'js-yaml'
import { generateUUID } from './uuid'
import moment from 'moment'
import { titleToUrl } from './titleToUrl'
import md5 from 'md5'

export const generate = async (
  postDirPath: string,
  pageDirPath: string,
  jsonDirPath: string,
  ymlDirPath: string,
  systemConfigPath: string,
  dataBasePath: string,
  cacheDirPath: string
) => {
  // Determine whether cacheDirPath exists, and create it if it does not
  if (!(await isExists(cacheDirPath))) {
    await mkdir(cacheDirPath, { recursive: true })
  }

  const postPattern = join(postDirPath, '**', '*.md')
  const postList = await generatePosts(postPattern, cacheDirPath)

  const pagePattern = join(pageDirPath, '**', '*.md')
  const pageList = await generatePages(pagePattern, cacheDirPath)

  const jsonPattern = join(jsonDirPath, '**', '*.json')
  const jsonList = await generateJsons(jsonPattern)

  const ymlPattern = join(ymlDirPath, '**', '*.yml')
  const ymlList = await generateYmls(ymlPattern)

  const systemConfig = await generateSystemConfig(systemConfigPath)
  const categoryTag = await generateCategoriesTags(postList, pageList)

  const data = {
    posts: postList,
    pages: pageList,
    ...jsonList,
    ...ymlList,
    systemConfig,
    tags: categoryTag.tags,
    categories: categoryTag.categories,
    postCategories: categoryTag.postCategories,
    postTags: categoryTag.postTags
  }

  // write to database file
  await writeFile(dataBasePath, JSON.stringify(data, null, 2), 'utf8')
}

async function generatePages(path: string, cacheDirPath: string): Promise<PAGE[]> {
  return await getFileJsonList(path, cacheDirPath)
}

async function generatePosts(path: string, cacheDirPath: string): Promise<POST[]> {
  return await getFileJsonList(path, cacheDirPath)
}

async function generateJsons(path: string): Promise<JSON_OBJ> {
  const jsonFileList: string[] = await glob(path.replace(/\\/g, '/'), { ignore: 'node_modules/**' })
  const result: {
    [key: string]: any
  } = {}

  for (const jsonFile of jsonFileList) {
    const fileName = parse(jsonFile).name
    const content = await readFile(jsonFile, 'utf-8')
    result[fileName + 'Config'] = JSON.parse(content.toString())
  }

  return result
}

async function generateYmls(path: string): Promise<JSON_OBJ> {
  const ymlFileList: string[] = await glob(path.replace(/\\/g, '/'), { ignore: 'node_modules/**' })
  const result: {
    [key: string]: any
  } = {}

  for (const jsonFile of ymlFileList) {
    const fileName = parse(jsonFile).name
    result[fileName + 'YmlConfig'] = yaml.load(await readFile(jsonFile, 'utf8')) as JSON_OBJ
  }

  return result
}

async function getFileJsonList(path: string, cacheDirPath: string): Promise<PAGE[] | POST[]> {
  const mdFileList: string[] = await glob(path.replace(/\\/g, '/'), { ignore: 'node_modules/**' })
  const promiseList: Promise<string>[] = []
  mdFileList.forEach((file: string) => {
    const promise = readFile(file, 'utf-8')
    promiseList.push(promise)
  })

  const pageList = await Promise.all(promiseList)

  const result: POST[] | PAGE[] = []
  for (const page of pageList) {
    // Calculate MD5 to determine whether the cache exists
    // get md5 hash
    const fileMd5 = md5(page)
    // if the cache exists, then use it
    const fileCachePath = join(cacheDirPath, fileMd5)
    if (await isExists(fileCachePath)) {
      const content = await readFile(fileCachePath, 'utf-8')
      const data = JSON.parse(content.toString())
      result.push(data)
    } else {
      const json = matter(page, { excerpt: true, excerpt_separator: '<!-- more -->' })
      const contentToc = await getContentToc(json.content)
      const excerpt = json.data.excerpt || (await markdownToHtml(json.excerpt)) || ''
      const data = {
        ...json.data,
        id: json.data.id ? json.data.id.toString() : '',
        title: json.data.title || '',
        alias: json.data.alias || '',
        cover: json.data.cover || '',
        created_time: json.data.created_time || json.data.date || '',
        updated_time: json.data.updated_time || json.data.updated || '',
        categories: json.data.categories || [],
        tags: json.data.tags || [],
        excerpt: json.data.excerpt || excerpt,
        published: json.data.published || '',
        content: contentToc.content || '',
        mdContent: json.content || '',
        toc: contentToc.toc || '',
        url: titleToUrl(json.data.alias || json.data.title || ''),
        created_timestamp:
          json.data.created_time || json.data.date
            ? moment(json.data.created_time || json.data.date).valueOf()
            : 0,
        updated_timestamp:
          json.data.updated_time || json.data.updated
            ? moment(json.data.updated_time || json.data.updated).valueOf()
            : 0,
        symbolsCount: getWordCount(contentToc.content || '')
      }
      result.push(data)
      // write cache data
      await writeFile(fileCachePath, JSON.stringify(data, null, 2), 'utf8')
    }
  }
  return result
}

async function getContentToc(content: string): Promise<{ content: string; toc: string }> {
  return {
    content: await markdownToHtml(content),
    toc: await markdownToToc(content)
  }
}

async function generateSystemConfig(path: string): Promise<JSON_OBJ> {
  // Get document, or throw exception on error
  return yaml.load(await readFile(path, 'utf8')) as JSON_OBJ
}

async function generateCategoriesTags(
  posts: POST[],
  pages?: PAGE[]
): Promise<{
  tags: TAG[]
  categories: CATEGORY[]
  postCategories: POST_CATEGORY[]
  postTags: POST_TAG[]
}> {
  const tags: TAG[] = []
  const categories: CATEGORY[] = []
  const postCategories: POST_CATEGORY[] = []
  const postTags: POST_TAG[] = []

  // !pages 需不需要支持 tag 和 category 暂时不需要， 后续再定
  // !Do pages need to support tag and category?
  // !No for now.
  // !We will decide later
  posts.forEach((post) => {
    if (post.tags && post.tags.length) {
      post.tags.forEach((tag) => {
        const index = tags.findIndex((t) => t.title === tag)
        if (index !== -1) {
          postTags.push({
            postId: post.id,
            tagId: tags[index].id,
            id: generateUUID(post.id + tags[index].id)
          })
        } else {
          const id = generateUUID(tag)
          tags.push({
            id,
            title: tag,
            description: tag,
            url: titleToUrl(tag || '')
          })
          postTags.push({
            postId: post.id,
            tagId: id,
            id: generateUUID(post.id + id)
          })
        }
      })
    }
    if (post.categories && post.categories.length) {
      post.categories.forEach((category) => {
        const index = categories.findIndex((t) => t.title === category)
        if (index !== -1) {
          postCategories.push({
            postId: post.id,
            categoryId: categories[index].id,
            id: generateUUID(post.id + categories[index].id)
          })
        } else {
          const id = generateUUID(category)
          categories.push({
            id,
            title: category,
            description: category,
            url: titleToUrl(category || '')
          })
          postCategories.push({
            postId: post.id,
            categoryId: id,
            id: generateUUID(post.id + id)
          })
        }
      })
    }
  })
  return {
    tags,
    categories,
    postCategories,
    postTags
  }
}

// eslint-disable-next-line no-unused-vars
function symbolsCount(input: string): number {
  if (!input) {
    return 0
  }

  return input?.trim()?.match(/\S/g)?.length || 0
}

/**
 * Counts the number of words in a given text, excluding whitespace, invisible characters, and HTML tags.
 * @param text - The input text to be analyzed.
 * @returns The number of words in the cleaned text.
 */
function getWordCount(text: string): number {
  // Remove HTML tags
  const strippedText = text.replace(/<[^>]+>/g, '')

  // Remove whitespace and invisible characters
  const cleanedText = strippedText.replace(
    /[\s\u200b-\u200f\u2028-\u202f\u205f-\u206f\ufeff]+/g,
    ''
  )
  // Count the number of characters in the cleaned text
  return cleanedText.length
}

async function isExists(path: string) {
  try {
    await stat(path)
    return true
  } catch (err) {
    return false
  }
}
