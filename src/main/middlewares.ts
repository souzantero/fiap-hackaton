import { adaptMiddleware } from './adapters/express-adapter';
import { makeAuthorizationHttpMiddleware } from './factories';

export const authorization = adaptMiddleware(makeAuthorizationHttpMiddleware());
