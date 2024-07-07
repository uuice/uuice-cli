import { Controller, Get, NotFoundException, Param, Render } from '@nestjs/common'
import { mixedDataView, ViewData } from '../../core/helper/viewData'
import { PostService, SysConfigService } from '../../core/service'

@Controller('archives')
export class ArchiveController {
  constructor(
    private readonly sysConfigService: SysConfigService,
    private readonly postService: PostService
  ) {}

  @Get('')
  @Render('archive')
  index() {
    // default month
    const viewData = new ViewData()
    viewData.assign('pageType', 'Archive')
    viewData.assign('type', 'year')
    viewData.assign('sysConfig', this.sysConfigService.getSysConfig())
    return mixedDataView(viewData).assign()
  }

  @Get(':url')
  @Render('post')
  type(@Param('url') url: string) {
    const viewData = new ViewData()
    viewData.assign('pageType', 'Post')
    viewData.assign('url', url)
    const post = this.postService.getPostByUrl(url)
    if (!post) {
      throw new NotFoundException('Post not found')
    }
    const prevPost = this.postService.getPrevPostByPostId(post.id)
    const nextPost = this.postService.getNextPostByPostId(post.id)
    viewData.assign('post', post)
    viewData.assign('prevPost', prevPost)
    viewData.assign('nextPost', nextPost)
    viewData.assign('sysConfig', this.sysConfigService.getSysConfig())
    return mixedDataView(viewData).assign()
  }
}
