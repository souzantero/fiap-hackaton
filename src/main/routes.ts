import { Router } from 'express';
import { adaptRoute } from './adapters/express-adapter';
import { authorization } from './middlewares';
import {
  makeAuthenticationHttpController,
  makeRegisterTimeClockHttpController,
  makeReportTimeClockHttpController,
  makeSummaryTimeClockHttpController,
} from './factories';

export const routes = (router: Router) => {
  router.post('/authenticate', adaptRoute(makeAuthenticationHttpController()));

  router.post(
    '/time-clock/register',
    authorization,
    adaptRoute(makeRegisterTimeClockHttpController()),
  );

  router.get(
    '/time-clock/summary',
    authorization,
    adaptRoute(makeSummaryTimeClockHttpController()),
  );

  router.get(
    '/time-clock/report',
    authorization,
    adaptRoute(makeReportTimeClockHttpController()),
  );
};
