import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { resolve } from 'node:path'
import { readFile, stat } from 'node:fs/promises'
import { fileTypeFromFile } from 'file-type'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TemplateStaticMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const template = 'default'
    const rule = new RegExp(`^/template/${template}`)
    if (rule.test(req.baseUrl)) {
      const filePath = resolve(
        this.configService.get('TEMP_VIEW_PATH'),
        req.baseUrl.replace('/template/', '')
      )
      const isExist = await stat(filePath)
      if (isExist) {
        const _stat = await stat(filePath)
        let mime = 'text/plain'
        const fileType = await fileTypeFromFile(filePath)
        if (fileType && fileType.mime) {
          mime = fileType.mime
        } else {
          const ext = req.baseUrl.split('.').pop()
          switch (ext) {
            case 'css':
              mime = 'text/css'
              break
            case 'html':
              mime = 'text/html'
              break
            case 'xml':
              mime = 'text/xml'
              break
            case 'json':
              mime = 'text/json'
              break
            case 'js':
              mime = 'text/javascript'
              break
          }
        }

        res.writeHead(req.header('If-Modified-Since') === _stat.mtime.toUTCString() ? 304 : 200, {
          'Content-Type': mime,
          'Content-Length': _stat.size,
          'Last-Modified': _stat.mtime.toUTCString(),
          // 'Cache-Control': `max-age=${config.tempMaxAge | 0},public,immutable`
          'Cache-Control': `max-age=${this.configService.get('TEMP_MAX_AGE') | 0},no-cache`
        })
        if (req.header('If-Modified-Since') !== _stat.mtime.toUTCString()) {
          const data = await readFile(filePath, 'binary')
          res.write(data, 'binary')
        }
        res.end()
      } else {
        throw new NotFoundException()
      }
    } else {
      next()
    }
  }
}
