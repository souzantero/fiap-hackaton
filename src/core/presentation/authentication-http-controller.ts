import { Authenticate, AuthenticatedAccount } from '../domain/use-cases';
import {
  BadRequestError,
  HttpController,
  HttpControllerRequest,
  HttpResponse,
  InternalServerError,
  UnauthorizedError,
} from './http';

export class AuthenticationHttpController
  implements HttpController<AuthenticatedAccount>
{
  constructor(private readonly authenticate: Authenticate) {}

  async handle(
    request: HttpControllerRequest,
  ): Promise<HttpResponse<AuthenticatedAccount>> {
    const { username, password } = request.body;

    if (!username || !password) {
      return HttpResponse.error(
        new BadRequestError('Missing username or password'),
      );
    }

    try {
      const authenticatedAccount = await this.authenticate.authenticate(
        username,
        password,
      );
      if (!authenticatedAccount) {
        return HttpResponse.error(new UnauthorizedError('Invalid credentials'));
      }

      return HttpResponse.ok(authenticatedAccount);
    } catch (error) {
      return HttpResponse.error(new InternalServerError(error));
    }
  }
}
