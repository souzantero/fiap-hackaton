import serverless from 'serverless-http';
import { App } from './app';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

const app = App.create();

export const api = async (event: APIGatewayProxyEvent, context: Context) => {
  return serverless(app.express)(event, context);
};
