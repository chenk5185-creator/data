import dayjs from 'dayjs';
import type { CostData } from '../types';

const randomInRange = (base: number, variance: number): number => {
  return Math.round(base + (Math.random() - 0.5) * 2 * variance);
};

const randomFloat = (base: number, variance: number): number => {
  return Math.round((base + (Math.random() - 0.5) * 2 * variance) * 100) / 100;
};

// 生成过去N个月的月份数组
const generateMonths = (months: number): string[] => {
  const result: string[] = [];
  for (let i = months - 1; i >= 0; i--) {
    result.push(dayjs().subtract(i, 'month').format('YYYY-MM'));
  }
  return result;
};

export const generateCostData = (months: number = 12): CostData[] => {
  const monthList = generateMonths(months);

  return monthList.map((month, index) => {
    // 模拟用户增长，成本效率逐渐提升
    const baseActiveUsers = 3000 + index * 200;
    const activeUsers = randomInRange(baseActiveUsers, 200);

    // API成本 (可变成本主体)
    const chatCost = randomFloat(800 + index * 30, 100);
    const insightCost = randomFloat(300 + index * 15, 50);
    const evaluationCost = randomFloat(150 + index * 8, 30);
    const recommendationCost = randomFloat(80 + index * 5, 20);
    const promptPlatformCost = randomFloat(50 + index * 3, 15);
    const totalApiCost = chatCost + insightCost + evaluationCost + recommendationCost + promptPlatformCost;

    // 存储成本
    const databaseCost = randomFloat(200 + index * 10, 30);
    const objectStorageCost = randomFloat(100 + index * 5, 20);
    const totalStorageCost = databaseCost + objectStorageCost;

    // 基础设施成本 (固定成本)
    const serverCost = randomFloat(500, 50);
    const bandwidthCost = randomFloat(150, 30);
    const otherCost = randomFloat(50, 15);
    const totalInfraCost = serverCost + bandwidthCost + otherCost;

    const variableCost = totalApiCost;
    const fixedCost = totalStorageCost + totalInfraCost;
    const totalCost = variableCost + fixedCost;

    const costPerUserMonth = totalCost / activeUsers;
    const costPerUserYear = costPerUserMonth * 12;

    // 服务效率指标
    const insightCount = randomInRange(activeUsers * 15, 500);
    const fiveStarCount = randomInRange(Math.floor(insightCount * 0.35), 100);

    return {
      month,
      totalCost: Math.round(totalCost * 100) / 100,
      activeUsers,
      costPerUserYear: Math.round(costPerUserYear * 100) / 100,
      variableCost: Math.round(variableCost * 100) / 100,
      fixedCost: Math.round(fixedCost * 100) / 100,
      apiCost: {
        chat: chatCost,
        insight: insightCost,
        evaluation: evaluationCost,
        recommendation: recommendationCost,
        promptPlatform: promptPlatformCost,
      },
      storageCost: {
        database: databaseCost,
        objectStorage: objectStorageCost,
      },
      infrastructureCost: {
        server: serverCost,
        bandwidth: bandwidthCost,
        other: otherCost,
      },
      costPerActiveUser: Math.round(costPerUserMonth * 100) / 100,
      costPerInsight: Math.round((totalCost / insightCount) * 100) / 100,
      costPerFiveStar: Math.round((totalCost / fiveStarCount) * 100) / 100,
      fiveStarCount,
      socialValue: fiveStarCount * 300,
      socialValueMultiple: Math.round((fiveStarCount * 300 / totalCost) * 10) / 10,
    };
  });
};

// 累计数据
export const getCumulativeSocialValue = (data: CostData[]) => {
  let totalFiveStars = 0;
  let totalCost = 0;

  data.forEach((item) => {
    totalFiveStars += item.fiveStarCount;
    totalCost += item.totalCost;
  });

  return {
    totalFiveStars,
    totalSocialValue: totalFiveStars * 300,
    totalCost: Math.round(totalCost * 100) / 100,
    totalMultiple: Math.round((totalFiveStars * 300 / totalCost) * 10) / 10,
  };
};
