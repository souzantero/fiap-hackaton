import {
  HttpController,
  HttpControllerRequest,
  HttpResponse,
  HttpStatus,
} from './http';

export class LogHttpControllerDecorator<T> implements HttpController<T> {
  constructor(private readonly httpController: HttpController<T>) {}

  async handle(request: HttpControllerRequest): Promise<HttpResponse<T>> {
    const httpResponse = await this.httpController.handle(request);
    if (httpResponse.status === HttpStatus.InternalServer) {
      console.error(httpResponse.body);
    }

    return httpResponse;
  }
}
