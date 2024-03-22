import { TimeClockReport } from '../domain/entities';
import { MessengerGateway } from '../domain/gateways';
import { AccountRepository, TimeClockRepository } from '../domain/repositories';
import { ReportTimeClock } from '../domain/use-cases';

export class ReportTimeClockService implements ReportTimeClock {
  constructor(
    private readonly timeClockRepository: TimeClockRepository,
    private readonly accountRepository: AccountRepository,
    private readonly messengerGateway: MessengerGateway,
  ) {}

  async report(
    accountId: string,
    year: number,
    month: number,
  ): Promise<TimeClockReport> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const report = await this.timeClockRepository.report(
      accountId,
      year,
      month,
    );

    const title = `Time Clock Report - ${year}/${month}`;
    const message = JSON.stringify(report, null, 2);

    await this.messengerGateway.sendMessage(account.email, title, message);

    return report;
  }
}
