export type Account = {
  id: string;
  email: string;
  username: string;
};

export type TimeClock = {
  accountId: string;
  timestamp: Date;
  type: TimeClockType;
};

export enum TimeClockType {
  IN = 'IN',
  OUT = 'OUT',
}

export type TimeClockSummary = {
  date: string;
  entries: TimeClock[];
  totalHoursWorked: string;
};

export type TimeClockReport = {
  accountId: string;
  year: number;
  month: number;
  records: TimeClockSummary[];
};
