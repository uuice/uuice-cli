import { AuthorService } from '../../core/service'
import * as nunjucks from 'nunjucks'
import { NestExpressApplication } from '@nestjs/platform-express'

export function AuthorList(app: NestExpressApplication): void {
  // tag with endpoint test
  this.tags = ['AuthorList']
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
    const body = parser.parseUntilBlocks('endAuthorList') // eng tag
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body]) // async
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const authorService = app.get(AuthorService)
    context.ctx.list = authorService.getAuthorList()

    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

export function AuthorItem(app: NestExpressApplication): void {
  // tag with endpoint test
  this.tags = ['AuthorItem']
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
    const body = parser.parseUntilBlocks('endAuthorItem') // eng tag
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body]) // async
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    if (args.id) {
      const authorService = app.get(AuthorService)
      context.ctx.tag = authorService.getAuthorById(args.id)
      const result = new nunjucks.runtime.SafeString(body())
      return callback(null, result)
    } else if (args.title) {
      const authorService = app.get(AuthorService)
      context.ctx.tag = authorService.getAuthorByTitle(args.title)
      const result = new nunjucks.runtime.SafeString(body())
      return callback(null, result)
    } else if (args.url) {
      const authorService = app.get(AuthorService)
      context.ctx.tag = authorService.getAuthorByUrl(args.url)
      const result = new nunjucks.runtime.SafeString(body())
      return callback(null, result)
    } else {
      const result = new nunjucks.runtime.SafeString('')
      return callback(null, result)
    }
  }
}
