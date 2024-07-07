import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ApiModule } from '../api/api.module'
import PKG from '../../../package.json'

export async function initSwagger(app: NestExpressApplication) {
  const apiConfig = new DocumentBuilder()
    .setTitle('uuice')
    .setDescription('uuice`s blog api')
    .setVersion(PKG.version)
    .addTag('api')
    .build()

  const apiDocument = SwaggerModule.createDocument(app, apiConfig, {
    include: [ApiModule]
  })
  SwaggerModule.setup('doc/api', app, apiDocument)
}
