import { Controller, Get, Header, Req, Res } from '@nestjs/common'
import { PostService, SysConfigService } from '../../core/service'
import { Request, Response } from 'express'
import { LIST_POST_ITEM } from '../../../types'
import moment from 'moment'
import xml2js from 'xml2js'

@Controller('rss.xml')
export class RssController {
  constructor(
    private readonly sysConfigService: SysConfigService,
    private readonly postService: PostService
  ) {}

  @Get('')
  @Header('Content-Type', 'application/xml')
  @Header('Cache-Control', 'no-cache')
  index(@Req() req: Request, @Res() res: Response) {
    const sysConfig = this.sysConfigService.getSysConfig()
    const postList = this.postService.getPostList()

    const jsonRss = {
      rss: {
        $: {
          version: '2.0'
        },
        channel: {
          title: sysConfig.title,
          link: req.get('host'),
          description: sysConfig.description,
          item: (postList || []).map((post: LIST_POST_ITEM) => {
            return {
              title: '<![CDATA[' + post.title + ']]',
              link: sysConfig.url + '/archives/' + post.url,
              description: '<![CDATA[' + (post.excerpt || post.title) + ']]',
              guid: '/archives/' + post.url,
              pubDate: moment(post.created_time as string).format('ddd, DD MMM YYYY HH:mm:ss [GMT]')
            }
          })
        }
      }
    }

    const builder = new xml2js.Builder()
    const xml = builder.buildObject(jsonRss)
    return res.send(xml)
  }
}
