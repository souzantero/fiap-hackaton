import { PrismaClient } from '@prisma/client';
import {
  TimeClock,
  TimeClockSummary,
  TimeClockReport,
} from '../../../core/domain/entities';
import { TimeClockRepository } from '../../../core/domain/repositories';

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
    const totalHoursWorked = timeClocks.reduce((acc, timeClock, index) => {
      if (index % 2 === 0) {
        const inTime = timeClock.timestamp;
        const outTime = timeClocks[index + 1].timestamp;
        const diff = outTime.getTime() - inTime.getTime();
        return acc + diff;
      }
      return acc;
    }, 0);

    // convert result to TimeClockSummary
    return {
      date: new Date().toISOString().split('T')[0],
      entries: timeClocks.map((timeClock) => ({
        accountId: timeClock.accountId,
        timestamp: timeClock.timestamp,
        type: timeClock.type as any,
      })),
      totalHoursWorked: new Date(totalHoursWorked).toISOString().substr(11, 8),
    };
  }

  async report(
    accountId: string,
    year: number,
    month: number,
  ): Promise<TimeClockReport> {
    const timeClocks = await this.prisma.timeClock.findMany({
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

    const records: TimeClockReport['records'] = [];
    let currentDay = '';
    let currentDayTimeClocks: TimeClock[] = [];
    for (const timeClock of timeClocks) {
      const day = timeClock.timestamp.toISOString().split('T')[0];
      if (currentDay !== day) {
        if (currentDayTimeClocks.length > 0) {
          records.push({
            date: currentDay,
            entries: currentDayTimeClocks,
            totalHoursWorked: new Date(
              currentDayTimeClocks.reduce((acc, timeClock, index) => {
                if (index % 2 === 0) {
                  const inTime = timeClock.timestamp;
                  const outTime = currentDayTimeClocks[index + 1].timestamp;
                  const diff = outTime.getTime() - inTime.getTime();
                  return acc + diff;
                }
                return acc;
              }, 0),
            )
              .toISOString()
              .substr(11, 8),
          });
        }
        currentDay = day;
        currentDayTimeClocks = [];
      }
      currentDayTimeClocks.push({
        accountId: timeClock.accountId,
        timestamp: timeClock.timestamp,
        type: timeClock.type as any,
      });
    }
    if (currentDayTimeClocks.length > 0) {
      records.push({
        date: currentDay,
        entries: currentDayTimeClocks,
        totalHoursWorked: new Date(
          currentDayTimeClocks.reduce((acc, timeClock, index) => {
            if (index % 2 === 0) {
              const inTime = timeClock.timestamp;
              const outTime = currentDayTimeClocks[index + 1].timestamp;
              const diff = outTime.getTime() - inTime.getTime();
              return acc + diff;
            }
            return acc;
          }, 0),
        )
          .toISOString()
          .substr(11, 8),
      });
    }

    return {
      accountId,
      year,
      month,
      records,
    };
  }
}
