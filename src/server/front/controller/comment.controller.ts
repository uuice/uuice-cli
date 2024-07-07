import { Controller, Get } from '@nestjs/common'

@Controller('comment')
export class CommentController {
  @Get('')
  index() {
    // default month
    return 'comment index'
  }
}
