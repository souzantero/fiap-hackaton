import * as AWS from 'aws-sdk';
import {
  AuthorizationGateway,
  AuthorizeResult,
} from '../../../core/domain/gateways';

export class CognitoAdapter implements AuthorizationGateway {
  private readonly cognito = new AWS.CognitoIdentityServiceProvider();

  constructor(
    private readonly cognitoClientId: string,
    private readonly cognitoClientSecret: string,
  ) {}

  async authorize(accessToken: string): Promise<AuthorizeResult | null> {
    const params = {
      AccessToken: accessToken,
    };

    try {
      const { Username } = await this.cognito.getUser(params).promise();
      return { username: Username };
    } catch (error) {
      return null;
    }
  }
}
