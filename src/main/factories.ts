import { RegisterTimeClockService } from '../core/application/register-time-clock-service';
import {
  Authorize,
  RegisterTimeClock,
  ReportTimeClock,
  SummaryTimeClock,
} from '../core/domain/use-cases';
import {
  AccountRepository,
  TimeClockRepository,
} from '../core/domain/repositories';
import { AuthorizationHttpMiddleware } from '../core/presentation/authorization-http-middleware';
import { RegisterTimeClockHttpController } from '../core/presentation/register-time-clock-http-controller';
import { SummaryTimeClockHttpController } from '../core/presentation/summary-time-clock-http-controller';
import { AuthorizationService } from '../core/application/authorization-service';
import { ReportTimeClockHttpController } from '../core/presentation/report-time-clock-http-controller';
import { PrismaDatabase } from './databases/prisma/prisma-database';
import { TimeClockPrismaDatabase } from './databases/prisma/time-clock-prisma-database';
import { AccountPrismaDatabase } from './databases/prisma/account-prisma-database';
import { AuthorizationGateway } from 'src/core/domain/gateways';
import { CognitoAdapter } from './adapters/aws/cognito-adapter';
import { environment } from './environment';

// REPOSITORIES
export const makeTimeClockRepository = (): TimeClockRepository =>
  new TimeClockPrismaDatabase(PrismaDatabase.getInstance().client);
export const makeAccountRepository = (): AccountRepository =>
  new AccountPrismaDatabase(PrismaDatabase.getInstance().client);

// GATEWAYS
export const makeAuthorizationGateway = (): AuthorizationGateway =>
  new CognitoAdapter(
    environment.cognitoClientId,
    environment.cognitoClientSecret,
  );

// USE CASES
export const makeAuthorize = (): Authorize =>
  new AuthorizationService(makeAuthorizationGateway(), makeAccountRepository());
export const makeRegisterTimeClock = (): RegisterTimeClock =>
  new RegisterTimeClockService(makeTimeClockRepository());
export const makeSummaryTimeClock = (): SummaryTimeClock =>
  makeTimeClockRepository();
export const makeReportTimeClock = (): ReportTimeClock =>
  makeTimeClockRepository();

// MIDDLEWARES
export const makeAuthorizationHttpMiddleware =
  (): AuthorizationHttpMiddleware => {
    return new AuthorizationHttpMiddleware(makeAuthorize());
  };

// CONTROLLERS
export const makeRegisterTimeClockHttpController =
  (): RegisterTimeClockHttpController =>
    new RegisterTimeClockHttpController(makeRegisterTimeClock());
export const makeSummaryTimeClockHttpController =
  (): SummaryTimeClockHttpController =>
    new SummaryTimeClockHttpController(makeSummaryTimeClock());
export const makeReportTimeClockHttpController =
  (): ReportTimeClockHttpController =>
    new ReportTimeClockHttpController(makeReportTimeClock());
