export type EnvironmentName = 'development' | 'production';

export interface Environment {
  readonly name: EnvironmentName;
  readonly port: number;
  readonly databaseUrl: string;
  readonly cognitoClientId: string;
  readonly cognitoClientSecret: string;
}

if (process.env.NODE_ENV) {
  if (
    process.env.NODE_ENV !== 'development' &&
    process.env.NODE_ENV !== 'production'
  ) {
    throw new Error('NODE_ENV must be "development" or "production"');
  }
}

if (process.env.PORT) {
  const port = Number(process.env.PORT);
  if (Number.isNaN(port)) {
    throw new Error('PORT must be a number');
  }
}

export const environment: Environment = {
  name: (process.env.NODE_ENV as EnvironmentName) || 'development',
  port: Number(process.env.PORT) ?? 3000,
  databaseUrl: process.env.DATABASE_URL ?? '',
  cognitoClientId: process.env.AWS_COGNITO_CLIENT_ID ?? '',
  cognitoClientSecret: process.env.AWS_COGNITO_CLIENT_SECRET ?? '',
};
