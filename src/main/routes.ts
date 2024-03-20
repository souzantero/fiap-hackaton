import { Router } from 'express';
import { adaptRoute } from './adapters/express-adapter';
import { authorization } from './middlewares';
import { makeRegisterTimeClockHttpController } from './factories';

export const routes = (router: Router) => {
  router.post(
    '/time-clock/register',
    authorization,
    adaptRoute(makeRegisterTimeClockHttpController()),
  );
};
