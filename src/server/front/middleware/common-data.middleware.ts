import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { SysConfigService } from '../../core/service'

@Injectable()
export class CommonDataMiddleware implements NestMiddleware {
  constructor(private sysConfigService: SysConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Adds public data to the res.locals object
    res.locals.sysConfig = this.sysConfigService.getSysConfig()
    // console.log('CommonDataMiddleware emit')
    next()
  }
}
