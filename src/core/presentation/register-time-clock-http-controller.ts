import { TimeClock } from '../domain/entities';
import { RegisterTimeClock } from '../domain/use-cases';
import {
  HttpController,
  HttpControllerRequest,
  HttpResponse,
  InternalServerError,
} from './http';

export class RegisterTimeClockHttpController
  implements HttpController<TimeClock>
{
  constructor(private readonly registerTimeClock: RegisterTimeClock) {}
  async handle(
    request: HttpControllerRequest,
  ): Promise<HttpResponse<TimeClock>> {
    try {
      const timeClock = await this.registerTimeClock.register(
        request.accountId,
      );
      return HttpResponse.created(timeClock);
    } catch (error) {
      return HttpResponse.error(new InternalServerError(error));
    }
  }
}
