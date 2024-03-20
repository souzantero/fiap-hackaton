import { Request, Response } from 'express';
import { HttpController, HttpMiddleware } from '../../core/presentation/http';

export const adaptRoute = <T>(httpController: HttpController<T>) => {
  return async (req: any, res: Response) => {
    const httpRequest = {
      body: { ...req.body },
      params: { ...req.params },
      query: { ...req.query },
      accountId: req.accountId,
    };

    const httpResponse = await httpController.handle(httpRequest);

    if (httpResponse.status >= 200 && httpResponse.status <= 299) {
      return res.status(httpResponse.status).json(httpResponse.body);
    }

    const error = httpResponse.body as Error;
    return res.status(httpResponse.status).json({
      error: error?.message || 'Internal server error',
    });
  };
};

export const adaptMiddleware = <T>(httpMiddleware: HttpMiddleware<T>) => {
  return async (req: Request, res: Response, next: any) => {
    const authorization = req.headers['authorization'] as string;
    const accessToken = authorization?.replace('Bearer ', '');
    const httpRequest = {
      accessToken: accessToken,
    };

    const httpResponse = await httpMiddleware.handle(httpRequest);

    if (httpResponse.status === 200) {
      Object.assign(req, httpResponse.body);
      return next();
    }

    const error = httpResponse.body as Error;
    return res.status(httpResponse.status).json({
      error: error?.message || 'Internal server error',
    });
  };
};
