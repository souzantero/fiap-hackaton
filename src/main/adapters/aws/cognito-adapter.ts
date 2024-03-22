import * as AWS from 'aws-sdk';
import {
  AuthenticateResult,
  AuthenticationGateway,
  AuthorizationGateway,
  AuthorizeResult,
} from '../../../core/domain/gateways';
import { CryptoAdapter } from '../crypto-adapter';

export class CognitoAdapter
  implements AuthenticationGateway, AuthorizationGateway
{
  private readonly cognito = new AWS.CognitoIdentityServiceProvider();
  private readonly cryptoAdapter: CryptoAdapter;

  constructor(
    private readonly cognitoClientId: string,
    private readonly cognitoClientSecret: string,
  ) {
    this.cryptoAdapter = new CryptoAdapter(this.cognitoClientSecret);
  }

  async authenticate(
    username: string,
    password: string,
  ): Promise<AuthenticateResult | null> {
    const secretHash = await this.cryptoAdapter.hash(
      username + this.cognitoClientId,
    );
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.cognitoClientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };

    try {
      const response = await this.cognito.initiateAuth(params).promise();
      if (!response.AuthenticationResult?.AccessToken) {
        return null;
      }

      return { accessToken: response.AuthenticationResult.AccessToken };
    } catch (error) {
      return null;
    }
  }

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
