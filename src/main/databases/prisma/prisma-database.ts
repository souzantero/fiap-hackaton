import { PrismaClient } from '@prisma/client';

export class PrismaDatabase {
  constructor(private readonly prisma: PrismaClient = new PrismaClient()) {}

  get client(): PrismaClient {
    return this.prisma;
  }

  connect(): Promise<void> {
    return this.prisma.$connect();
  }

  disconnect(): Promise<void> {
    return this.prisma.$disconnect();
  }

  async drop(): Promise<void> {
    await Promise.all([
      this.prisma.timeClock.deleteMany(),
      this.prisma.account.deleteMany(),
    ]);
  }
}
