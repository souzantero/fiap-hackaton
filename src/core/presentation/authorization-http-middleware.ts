import { Authorize } from '../domain/use-cases';
import {
  ForbiddenError,
  HttpMiddleware,
  HttpMiddlewareRequest,
  HttpResponse,
  InternalServerError,
} from './http';

export type AuthorizationHttpMiddlewareResponse = {
  accountId: string;
};

export class AuthorizationHttpMiddleware
  implements HttpMiddleware<AuthorizationHttpMiddlewareResponse>
{
  constructor(private readonly authorize: Authorize) {}

  async handle(
    request: HttpMiddlewareRequest,
  ): Promise<HttpResponse<AuthorizationHttpMiddlewareResponse>> {
    const { accessToken } = request;
    if (!accessToken) {
      return HttpResponse.error(new ForbiddenError('Missing authorization'));
    }

    try {
      const account = await this.authorize.authorize(accessToken);
      if (!account) {
        return HttpResponse.error(new ForbiddenError('Invalid authorization'));
      }

      const accountId = account.id;
      return HttpResponse.ok({ accountId });
    } catch (error) {
      return HttpResponse.error(new InternalServerError(error));
    }
  }
}
