import * as nunjucks from 'nunjucks'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SysConfigService } from '../../core/service'

export function SysConfig(app: NestExpressApplication): void {
  this.tags = ['SysConfig']
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
    const body = parser.parseUntilBlocks('endSysConfig') // eng tag
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body]) // async
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const sysConfigService = app.get(SysConfigService)
    context.ctx.list = await sysConfigService.getSysConfig()
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

export function SysConfigItem(app: NestExpressApplication): void {
  this.tags = ['SysConfigItem']
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
    // const body = parser.parseUntilBlocks('endSysConfigItem') // eng tag
    // parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args) // async
  }
  this.run = async function (context: any, args: any, callback: any) {
    const sysConfigService = app.get(SysConfigService)
    const result = new nunjucks.runtime.SafeString(await sysConfigService.getSysConfig(args.path))
    return callback(null, result)
  }
}
