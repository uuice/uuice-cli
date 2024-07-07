import * as nunjucks from 'nunjucks'
import { NestExpressApplication } from '@nestjs/platform-express'

export function TagTest(app: NestExpressApplication): void {
  // tag with endpoint test
  this.tags = ['TagTest']
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
    const body = parser.parseUntilBlocks('endTagTest') // eng tag
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body]) // async
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    // const configLocalService = app.get(ConfigLocalService)
    // console.log(configLocalService.getKnexConfig())
    // const userService = app.get(UserService)
    // console.log(userService)
    context.ctx.list = [
      {
        id: 1,
        city: '北京',
        parent: 0,
        spelling: 'BeiJing',
        abbr: 'BJ',
        short: 'B'
      },
      {
        id: 2,
        city: '上海',
        parent: 0,
        spelling: 'ShangHai',
        abbr: 'SH',
        short: 'S'
      },
      {
        id: 3,
        city: '天津',
        parent: 0,
        spelling: 'TianJin',
        abbr: 'TJ',
        short: 'T'
      },
      {
        id: 4,
        city: '重庆',
        parent: 0,
        spelling: 'ZhongQing',
        abbr: 'ZQ',
        short: 'Z'
      },
      {
        id: 5,
        city: '黑龙江',
        parent: 0,
        spelling: 'HeiLongJiang',
        abbr: 'HLJ',
        short: 'H'
      }
    ] // return
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
