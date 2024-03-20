import { RegisterTimeClockService } from '../core/application/register-time-clock-service';
import {
  Authorize,
  RegisterTimeClock,
  ReportTimeClock,
  SummaryTimeClock,
} from '../core/domain/use-cases';
import { TimeClockRepository } from '../core/domain/repositories';
import { AuthorizationHttpMiddleware } from '../core/presentation/authorization-http-middleware';
import { RegisterTimeClockHttpController } from '../core/presentation/http-controller';
import { PrismaDatabase } from './databases/prisma/prisma-database';
import { TimeClockPrismaDatabase } from './databases/prisma/time-clock-prisma-database';

const prismaDatabase = new PrismaDatabase();

export const makeTimeClockRepository = (): TimeClockRepository =>
  new TimeClockPrismaDatabase(prismaDatabase.client);
export const makeAuthorize = (): Authorize => {
  return {
    async authorize(accessToken) {
      return {
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_password',
      };
    },
  };
};

export const makeRegisterTimeClock = (): RegisterTimeClock =>
  new RegisterTimeClockService(makeTimeClockRepository());
export const makeSummaryTimeClock = (): SummaryTimeClock =>
  makeTimeClockRepository();
export const makeReportTimeClock = (): ReportTimeClock =>
  makeTimeClockRepository();
export const makeRegisterTimeClockHttpController =
  (): RegisterTimeClockHttpController =>
    new RegisterTimeClockHttpController(makeRegisterTimeClock());
export const makeAuthorizationHttpMiddleware =
  (): AuthorizationHttpMiddleware => {
    return new AuthorizationHttpMiddleware(makeAuthorize());
  };
