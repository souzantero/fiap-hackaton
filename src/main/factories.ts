import { AuthenticateService } from '../core/application/authenticate-service';
import { AuthorizationService } from '../core/application/authorization-service';
import { RegisterTimeClockService } from '../core/application/register-time-clock-service';
import { ReportTimeClockService } from '../core/application/report-time-clock-service';
import {
  Authenticate,
  Authorize,
  RegisterTimeClock,
  ReportTimeClock,
  SummaryTimeClock,
} from '../core/domain/use-cases';
import {
  AccountRepository,
  TimeClockRepository,
} from '../core/domain/repositories';
import {
  AuthenticationGateway,
  AuthorizationGateway,
  MessengerGateway,
} from '../core/domain/gateways';
import { HttpController } from '../core/presentation/http';
import { LogHttpControllerDecorator } from '../core/presentation/log-http-controller-decorator';
import { AuthorizationHttpMiddleware } from '../core/presentation/authorization-http-middleware';
import { RegisterTimeClockHttpController } from '../core/presentation/register-time-clock-http-controller';
import { SummaryTimeClockHttpController } from '../core/presentation/summary-time-clock-http-controller';
import { ReportTimeClockHttpController } from '../core/presentation/report-time-clock-http-controller';
import { AuthenticationHttpController } from '../core/presentation/authentication-http-controller';
import { PrismaDatabase } from './databases/prisma/prisma-database';
import { TimeClockPrismaDatabase } from './databases/prisma/time-clock-prisma-database';
import { AccountPrismaDatabase } from './databases/prisma/account-prisma-database';
import { CognitoAdapter } from './adapters/aws/cognito-adapter';
import { environment } from './environment';
import { SESAdapter } from './adapters/aws/ses-adapter';

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
export const makeAuthenticationGateway = (): AuthenticationGateway =>
  new CognitoAdapter(
    environment.cognitoClientId,
    environment.cognitoClientSecret,
  );
export const makeMessengerGateway = (): MessengerGateway =>
  new SESAdapter(environment.sesSource);

// USE CASES
export const makeAuthorize = (): Authorize =>
  new AuthorizationService(makeAuthorizationGateway(), makeAccountRepository());
export const makeAuthenticate = (): Authenticate =>
  new AuthenticateService(makeAuthenticationGateway(), makeAccountRepository());
export const makeRegisterTimeClock = (): RegisterTimeClock =>
  new RegisterTimeClockService(makeTimeClockRepository());
export const makeSummaryTimeClock = (): SummaryTimeClock =>
  makeTimeClockRepository();
export const makeReportTimeClock = (): ReportTimeClock =>
  new ReportTimeClockService(
    makeTimeClockRepository(),
    makeAccountRepository(),
    makeMessengerGateway(),
  );

// MIDDLEWARES
export const makeAuthorizationHttpMiddleware =
  (): AuthorizationHttpMiddleware => {
    return new AuthorizationHttpMiddleware(makeAuthorize());
  };

// CONTROLLERS
export const makeLogHttpControllerDecorator = <T>(
  httpController: HttpController<T>,
): LogHttpControllerDecorator<T> =>
  new LogHttpControllerDecorator(httpController);
export const makeRegisterTimeClockHttpController = () =>
  makeLogHttpControllerDecorator(
    new RegisterTimeClockHttpController(makeRegisterTimeClock()),
  );
export const makeSummaryTimeClockHttpController = () =>
  makeLogHttpControllerDecorator(
    new SummaryTimeClockHttpController(makeSummaryTimeClock()),
  );
export const makeReportTimeClockHttpController = () =>
  makeLogHttpControllerDecorator(
    new ReportTimeClockHttpController(makeReportTimeClock()),
  );
export const makeAuthenticationHttpController = () =>
  makeLogHttpControllerDecorator(
    new AuthenticationHttpController(makeAuthenticate()),
  );
