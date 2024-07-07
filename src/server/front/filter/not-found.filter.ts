import { Catch, ExceptionFilter, NotFoundException } from '@nestjs/common'

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: any) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    response.status(200).render('404')
  }
}
