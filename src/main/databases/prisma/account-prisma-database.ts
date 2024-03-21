import { PrismaClient } from '@prisma/client';

import { Account } from '../../../core/domain/entities';
import { AccountRepository } from '../../../core/domain/repositories';

export class AccountPrismaDatabase implements AccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUsername(username: string): Promise<Account | null> {
    const account = await this.prisma.account.findFirst({
      where: {
        username,
        deletedAt: null,
      },
    });

    if (!account) {
      return null;
    }

    return {
      id: account.id,
      username: account.username,
      email: account.email,
    };
  }
}
