import dayjs from 'dayjs';
import type { UserUsageData } from '../types';

const randomInRange = (base: number, variance: number): number => {
  return Math.round(base + (Math.random() - 0.5) * 2 * variance);
};

const randomFloat = (base: number, variance: number): number => {
  return Math.round((base + (Math.random() - 0.5) * 2 * variance) * 10) / 10;
};

const generateDates = (days: number): string[] => {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
  }
  return dates;
};

export const generateUserUsageData = (days: number = 30): UserUsageData[] => {
  const dates = generateDates(days);
  let cumulativeUsers = 15000;
  let historicalConversations = 500000;

  return dates.map((date, index) => {
    const newUsers = randomInRange(80, 30);
    cumulativeUsers += newUsers;

    const activeUsers = randomInRange(500, 100);
    const dailyConversations = randomInRange(3000, 500);
    historicalConversations += dailyConversations;

    const conversationUsers = randomInRange(Math.floor(activeUsers * 0.85), 30);
    const insightUsers = randomInRange(Math.floor(activeUsers * 0.6), 40);

    // 留存率随时间略有波动
    const baseRetention1 = 45 + Math.sin(index / 5) * 5;
    const baseRetention7 = 25 + Math.sin(index / 7) * 3;
    const baseRetention30 = 12 + Math.sin(index / 10) * 2;

    return {
      date,
      totalUsers: cumulativeUsers,
      newUsers,
      activeUsers,
      totalConversations: dailyConversations,
      historicalConversations,
      conversationUsers,
      insightUsers,
      avgConversationsPerUser: randomFloat(6.5, 1.5),
      avgTopicsPerUser: randomFloat(2.3, 0.5),
      avgConversationsPerTopic: randomFloat(2.8, 0.6),
      retention1Day: randomFloat(baseRetention1, 5),
      retention7Day: randomFloat(baseRetention7, 3),
      retention30Day: randomFloat(baseRetention30, 2),
    };
  });
};
