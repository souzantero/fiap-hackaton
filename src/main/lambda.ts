import serverless from 'serverless-http';
import { App } from './app';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

export const api = async (event: APIGatewayProxyEvent, context: Context) => {
  const app = App.create();
  return serverless(app.express)(event, context);
};
