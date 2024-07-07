import { CategoryService } from '../../core/service'
import * as nunjucks from 'nunjucks'
import { NestExpressApplication } from '@nestjs/platform-express'

export function CategoryList(app: NestExpressApplication): void {
  // tag with endpoint test
  this.tags = ['CategoryList']
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
    const body = parser.parseUntilBlocks('endCategoryList') // eng tag
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body]) // async
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const categoryService = app.get(CategoryService)
    if (args.withPostNum) {
      context.ctx.list = categoryService.getCategoryListWidthPostNum()
    } else {
      context.ctx.list = categoryService.getCategoryList()
    }
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

export function CategoryItem(app: NestExpressApplication): void {
  // tag with endpoint test
  this.tags = ['CategoryItem']
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
    const body = parser.parseUntilBlocks('endCategoryItem') // eng tag
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body]) // async
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    if (args.id) {
      const categoryService = app.get(CategoryService)
      context.ctx.category = categoryService.getCategoryById(args.id)
      const result = new nunjucks.runtime.SafeString(body())
      return callback(null, result)
    } else if (args.title) {
      const categoryService = app.get(CategoryService)
      context.ctx.category = categoryService.getCategoryByTitle(args.title)
      const result = new nunjucks.runtime.SafeString(body())
      return callback(null, result)
    } else if (args.url) {
      const categoryService = app.get(CategoryService)
      context.ctx.category = categoryService.getCategoryByUrl(args.url)
      const result = new nunjucks.runtime.SafeString(body())
      return callback(null, result)
    } else {
      const result = new nunjucks.runtime.SafeString('')
      return callback(null, result)
    }
  }
}
