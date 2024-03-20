import { TimeClock, TimeClockType } from '../domain/entities';
import { TimeClockRepository } from '../domain/repositories';
import { RegisterTimeClock } from '../domain/use-cases';

export class RegisterTimeClockService implements RegisterTimeClock {
  constructor(private readonly timeClockRepository: TimeClockRepository) {}

  async register(accountId: string): Promise<TimeClock> {
    const summary = await this.timeClockRepository.summary(accountId);
    const lastEntry =
      summary.entries.length > 0
        ? summary.entries[summary.entries.length - 1]
        : null;
    const timestamp = new Date();
    let type = TimeClockType.IN;
    if (lastEntry && lastEntry.type === TimeClockType.IN) {
      type = TimeClockType.OUT;
    }

    const timeClock = {
      accountId,
      timestamp,
      type,
    };

    await this.timeClockRepository.register(timeClock);

    return timeClock;
  }
}
