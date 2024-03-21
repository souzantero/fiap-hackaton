import { PrismaClient } from '@prisma/client';

export class PrismaDatabase {
  private static instance: PrismaDatabase;

  private constructor(
    private readonly prisma: PrismaClient = new PrismaClient(),
  ) {}

  static getInstance(): PrismaDatabase {
    if (!PrismaDatabase.instance) {
      PrismaDatabase.instance = new PrismaDatabase();
    }

    return PrismaDatabase.instance;
  }

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
