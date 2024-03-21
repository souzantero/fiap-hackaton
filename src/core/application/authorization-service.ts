import { Account } from '../domain/entities';
import { AuthorizationGateway } from '../domain/gateways';
import { AccountRepository } from '../domain/repositories';
import { Authorize } from '../domain/use-cases';

export class AuthorizationService implements Authorize {
  constructor(
    private readonly authorizationGateway: AuthorizationGateway,
    private readonly accountRepository: AccountRepository,
  ) {}

  async authorize(accessToken: string): Promise<Account | null> {
    const result = await this.authorizationGateway.authorize(accessToken);
    if (!result) {
      return null;
    }

    return this.accountRepository.findByUsername(result.username);
  }
}
