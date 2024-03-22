import { AuthenticationGateway } from '../domain/gateways';
import { AccountRepository } from '../domain/repositories';
import { Authenticate, AuthenticatedAccount } from '../domain/use-cases';

export class AuthenticateService implements Authenticate {
  constructor(
    private readonly authenticationGateway: AuthenticationGateway,
    private readonly accountRepository: AccountRepository,
  ) {}

  async authenticate(
    username: string,
    password: string,
  ): Promise<AuthenticatedAccount | null> {
    const authenticateResult = await this.authenticationGateway.authenticate(
      username,
      password,
    );
    if (!authenticateResult) {
      return null;
    }

    const account = await this.accountRepository.findByUsername(username);
    if (!account) {
      return null;
    }

    return {
      accessToken: authenticateResult.accessToken,
      account,
    };
  }
}
