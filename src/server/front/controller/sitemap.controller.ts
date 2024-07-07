import { Controller, Get, Header, Res } from '@nestjs/common'
import { CATEGORY, LIST_PAGE_ITEM, LIST_POST_ITEM, TAG } from '../../../types'
import {
  CategoryService,
  PageService,
  PostService,
  SysConfigService,
  TagService
} from '../../core/service'
import { Response } from 'express'
import moment from 'moment'
import xml2js from 'xml2js'
import { join } from 'node:path'

@Controller('sitemap.xml')
export class SitemapController {
  constructor(
    private readonly sysConfigService: SysConfigService,
    private readonly postService: PostService,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly pageService: PageService
  ) {}

  @Get('')
  @Header('Content-Type', 'application/xml')
  @Header('Cache-Control', 'no-cache')
  index(@Res() res: Response) {
    const sysConfig = this.sysConfigService.getSysConfig()
    const postList = this.postService.getPostList()
    const categoryList = this.categoryService.getCategoryList()
    const tagList = this.tagService.getTagList()
    const pageList = this.pageService.getPageList()

    const jsonRss = {
      urlset: {
        $: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
          'xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xsi:schemaLocation':
            'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
          'xmlns:mobile': 'http://www.google.com/schemas/sitemap-mobile/1.0',
          'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
          'xmlns:video': 'http://www.google.com/schemas/sitemap-video/1.1'
        },
        url: [
          ...postList.map((post: LIST_POST_ITEM) => {
            return {
              loc: join(sysConfig.url, 'archives', post.url as string),
              lastmod: moment(post.updated_time as string).format(),
              changefreq: 'daily',
              priority: '0.7'
            }
          }),
          ...categoryList.map((cate: CATEGORY) => {
            return {
              loc: join(sysConfig.url, 'categories', cate.title),
              lastmod: '',
              changefreq: 'daily',
              priority: '0.7'
            }
          }),

          ...tagList.map((tag: TAG) => {
            return {
              loc: join(sysConfig.url, 'tags', tag.title),
              lastmod: '',
              changefreq: 'daily',
              priority: '0.7'
            }
          }),

          ...pageList.map((page: LIST_PAGE_ITEM) => {
            return {
              loc: join(sysConfig.url, (page.alias || page.url) as string),
              lastmod: moment(page.updated_time as string).format(),
              changefreq: 'daily',
              priority: '0.7'
            }
          }),

          {
            loc: join(sysConfig.url, 'tags'),
            lastmod: '',
            changefreq: 'daily',
            priority: '0.5'
          },
          {
            loc: join(sysConfig.url, 'categories'),
            lastmod: '',
            changefreq: 'daily',
            priority: '0.5'
          },
          {
            loc: join(sysConfig.url, 'archives'),
            lastmod: '',
            changefreq: 'daily',
            priority: '0.5'
          }
        ]
      }
    }

    const builder = new xml2js.Builder()
    const xml = builder.buildObject(jsonRss)
    return res.send(xml)
  }
}
