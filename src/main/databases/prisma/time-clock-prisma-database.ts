import { PrismaClient, TimeClock as TimeClockEntity } from '@prisma/client';
import {
  TimeClock,
  TimeClockSummary,
  TimeClockReport,
} from '../../../core/domain/entities';
import { TimeClockRepository } from '../../../core/domain/repositories';

function sumTotalHoursWorked(timeClocks: TimeClockEntity[]): number {
  const sortedTimeClocks = timeClocks.sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );

  let totalHoursWorked = 0;
  let lastClockIn: Date | null = null;

  for (const timeClock of sortedTimeClocks) {
    if (timeClock.type === 'IN') {
      lastClockIn = timeClock.timestamp;
    } else if (timeClock.type === 'OUT' && lastClockIn) {
      const hoursWorked =
        (timeClock.timestamp.getTime() - lastClockIn.getTime()) /
        (1000 * 60 * 60);
      totalHoursWorked += hoursWorked;
      lastClockIn = null; // Reset for the next session
    }
  }

  return totalHoursWorked;
}

function formatTotalHoursWorked(totalHoursWorked: number): string {
  const hours = Math.floor(totalHoursWorked);
  const minutes = Math.floor((totalHoursWorked - hours) * 60);
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

export class TimeClockPrismaDatabase implements TimeClockRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async register(timeClock: TimeClock): Promise<void> {
    await this.prisma.timeClock.create({
      data: {
        accountId: timeClock.accountId,
        type: timeClock.type,
        timestamp: timeClock.timestamp,
      },
    });
  }

  async summary(accountId: string): Promise<TimeClockSummary> {
    /// find all today timeclocks for the account
    const timeClocks = await this.prisma.timeClock.findMany({
      where: {
        accountId,
        timestamp: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    // SUM all hours worked
    const totalHoursWorked = sumTotalHoursWorked(timeClocks);

    // convert result to TimeClockSummary
    return {
      date: new Date().toISOString().split('T')[0],
      entries: timeClocks.map((timeClock) => ({
        accountId: timeClock.accountId,
        timestamp: timeClock.timestamp,
        type: timeClock.type as any,
      })),
      totalHoursWorked: formatTotalHoursWorked(totalHoursWorked),
    };
  }

  async report(
    accountId: string,
    year: number,
    month: number,
  ): Promise<TimeClockReport> {
    const records = await this.prisma.timeClock.findMany({
      where: {
        accountId,
        timestamp: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    const timeClocksByDay: Record<string, TimeClockEntity[]> = {};
    for (const record of records) {
      const date = record.timestamp.toISOString().split('T')[0];
      if (!timeClocksByDay[date]) {
        timeClocksByDay[date] = [];
      }
      timeClocksByDay[date].push(record);
    }

    const timeClockSummaries = Object.entries(timeClocksByDay).map(
      ([date, timeClocks]) => {
        const totalHoursWorked = sumTotalHoursWorked(timeClocks);
        return {
          date,
          entries: timeClocks.map((timeClock) => ({
            accountId: timeClock.accountId,
            timestamp: timeClock.timestamp,
            type: timeClock.type as any,
          })),
          totalHoursWorked: formatTotalHoursWorked(totalHoursWorked),
        };
      },
    );

    return {
      accountId,
      year,
      month,
      records: timeClockSummaries,
    };
  }
}
