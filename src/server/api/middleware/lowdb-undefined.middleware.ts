import { Injectable, NestMiddleware, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class LowdbUndefinedMiddleware implements NestMiddleware {
  use(@Req() request: Request, @Res() response: Response, next: () => void) {
    next()
  }
}
