import { TimeClockReport } from '../domain/entities';
import { ReportTimeClock } from '../domain/use-cases';
import {
  BadRequestError,
  HttpController,
  HttpControllerRequest,
  HttpResponse,
  InternalServerError,
} from './http';

export class ReportTimeClockHttpController
  implements HttpController<TimeClockReport>
{
  constructor(private readonly reportTimeClock: ReportTimeClock) {}
  async handle(
    request: HttpControllerRequest,
  ): Promise<HttpResponse<TimeClockReport>> {
    if (!request.query.month || !request.query.year) {
      return HttpResponse.error(
        new BadRequestError('Month and year are required'),
      );
    }

    const month = Number(request.query.month);
    const year = Number(request.query.year);
    if (isNaN(month) || isNaN(year)) {
      return HttpResponse.error(
        new BadRequestError('Month and year must be a number'),
      );
    }

    try {
      const report = await this.reportTimeClock.report(
        request.accountId,
        year,
        month,
      );
      return HttpResponse.ok(report);
    } catch (error) {
      return HttpResponse.error(new InternalServerError(error));
    }
  }
}
