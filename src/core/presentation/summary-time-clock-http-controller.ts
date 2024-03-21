import { TimeClockSummary } from '../domain/entities';
import { SummaryTimeClock } from '../domain/use-cases';
import {
  HttpController,
  HttpControllerRequest,
  HttpResponse,
  InternalServerError,
} from './http';

export class SummaryTimeClockHttpController
  implements HttpController<TimeClockSummary>
{
  constructor(private readonly summaryTimeClock: SummaryTimeClock) {}
  async handle(
    request: HttpControllerRequest,
  ): Promise<HttpResponse<TimeClockSummary>> {
    try {
      const summary = await this.summaryTimeClock.summary(request.accountId);
      return HttpResponse.ok(summary);
    } catch (error) {
      return HttpResponse.error(new InternalServerError(error));
    }
  }
}
