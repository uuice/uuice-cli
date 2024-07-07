import * as nunjucks from 'nunjucks'
import { NestExpressApplication } from '@nestjs/platform-express'

export function TagTest2(app: NestExpressApplication): void {
  // tag without test
  this.tags = ['TagTest2']
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
    // const body = parser.parseUntilBlocks('endTagTest2') // eng tag
    // parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args) // async
  }
  this.run = async function (context: any, args: any, callback: any) {
    // const logger = new Logger('TagTest2')
    // logger.error('test')
    // logger.warn('test')
    // logger.debug('debug', {
    //   a: 'a'
    // })
    // console.log(args, /args/)
    const result = new nunjucks.runtime.SafeString('TagTest2')
    return callback(null, result)
  }
}
