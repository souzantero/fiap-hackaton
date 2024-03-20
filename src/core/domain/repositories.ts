import { TimeClock, TimeClockReport, TimeClockSummary } from './entities';

export interface TimeClockRepository {
  register(timeClock: TimeClock): Promise<void>;
  summary(accountId: string): Promise<TimeClockSummary>;
  report(
    accountId: string,
    year: number,
    month: number,
  ): Promise<TimeClockReport>;
}
