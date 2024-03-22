import {
  Account,
  TimeClock,
  TimeClockReport,
  TimeClockSummary,
} from './entities';

export interface AccountRepository {
  findById(id: string): Promise<Account | null>;
  findByUsername(username: string): Promise<Account | null>;
}

export interface TimeClockRepository {
  register(timeClock: TimeClock): Promise<void>;
  summary(accountId: string): Promise<TimeClockSummary>;
  report(
    accountId: string,
    year: number,
    month: number,
  ): Promise<TimeClockReport>;
}
