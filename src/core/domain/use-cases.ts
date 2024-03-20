import {
  Account,
  TimeClock,
  TimeClockReport,
  TimeClockSummary,
} from './entities';

export interface Authorize {
  authorize(accessToken: string): Promise<Account | null>;
}

export interface RegisterTimeClock {
  register(accountId: string): Promise<TimeClock>;
}

export interface SummaryTimeClock {
  summary(accountId: string): Promise<TimeClockSummary>;
}

export interface ReportTimeClock {
  report(
    accountId: string,
    year: number,
    month: number,
  ): Promise<TimeClockReport>;
}
