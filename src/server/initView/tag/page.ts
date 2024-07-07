import * as nunjucks from 'nunjucks'
import { NestExpressApplication } from '@nestjs/platform-express'
import { PageService } from '../../core/service'

export function PageList(app: NestExpressApplication): void {
  // tag with endpoint test
  this.tags = ['PageList']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    // !nunjucks has a bug, when args.children is empty
    // add an empty node to args.children
    if (!args.children.length) {
      // Handle empty arguments
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endPageList') // eng tag
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body]) // async
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const pageService = app.get(PageService)

    context.ctx.list = pageService.getPageList()
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

export function PageItem(app: NestExpressApplication): void {
  // tag with endpoint test
  this.tags = ['PageItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    // !nunjucks has a bug, when args.children is empty
    // add an empty node to args.children
    if (!args.children.length) {
      // Handle empty arguments
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endPageItem') // eng tag
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body]) // async
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    if (args.id) {
      const pageService = app.get(PageService)
      context.ctx.page = pageService.getPageById(args.id)
      const result = new nunjucks.runtime.SafeString(body())
      return callback(null, result)
    } else if (args.title) {
      const pageService = app.get(PageService)
      context.ctx.page = pageService.getPageByTitle(args.title)
      const result = new nunjucks.runtime.SafeString(body())
      return callback(null, result)
    } else if (args.url) {
      const pageService = app.get(PageService)
      context.ctx.page = pageService.getPageByUrl(args.url)
      const result = new nunjucks.runtime.SafeString(body())
      return callback(null, result)
    } else if (args.alias) {
      const pageService = app.get(PageService)
      context.ctx.page = pageService.getPageByAlias(args.alias)
      const result = new nunjucks.runtime.SafeString(body())
      return callback(null, result)
    } else {
      const result = new nunjucks.runtime.SafeString('')
      return callback(null, result)
    }
  }
}
