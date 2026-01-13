import dayjs from 'dayjs';
import type {
  DailyUserRating,
  DailyAIEvaluation,
  CrossAnalysisRow,
  EvaluatorVersion,
  ABTestData,
} from '../types';

// 生成随机数，带波动
const randomInRange = (base: number, variance: number): number => {
  return Math.round(base + (Math.random() - 0.5) * 2 * variance);
};

const randomFloat = (base: number, variance: number): number => {
  return Math.round((base + (Math.random() - 0.5) * 2 * variance) * 10) / 10;
};

// 生成过去N天的日期数组
const generateDates = (days: number): string[] => {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
  }
  return dates;
};

// 生成用户评分数据
export const generateUserRatingData = (days: number = 30): DailyUserRating[] => {
  const dates = generateDates(days);
  return dates.map((date) => {
    const activeUsers = randomInRange(500, 100);
    const insightUsers = randomInRange(Math.floor(activeUsers * 0.6), 50);
    const totalRatedUsers = randomInRange(Math.floor(insightUsers * 0.7), 30);

    const rating5 = randomInRange(Math.floor(totalRatedUsers * 0.35), 20);
    const rating4 = randomInRange(Math.floor(totalRatedUsers * 0.25), 15);
    const rating3 = randomInRange(Math.floor(totalRatedUsers * 0.15), 10);
    const rating2 = randomInRange(Math.floor(totalRatedUsers * 0.1), 5);
    const rating1 = randomInRange(Math.floor(totalRatedUsers * 0.05), 3);
    const unrated = insightUsers - totalRatedUsers;

    return {
      date,
      fiveStarCount: rating5,
      fourFiveStarCount: rating5 + rating4,
      totalRatedUsers,
      insightUsers,
      activeUsers,
      distribution: {
        rating1,
        rating2,
        rating3,
        rating4,
        rating5,
        unrated: Math.max(0, unrated),
      },
    };
  });
};

// 生成AI评估数据
export const generateAIEvaluationData = (days: number = 30): DailyAIEvaluation[] => {
  const dates = generateDates(days);
  return dates.map((date) => ({
    date,
    empathyScore: randomFloat(75, 8),
    positiveAttentionScore: randomFloat(78, 7),
    allianceScore: randomFloat(72, 9),
  }));
};

// 生成交叉对照数据
export const generateCrossAnalysisData = (): CrossAnalysisRow[] => {
  return [
    { userRating: '5分', topicCount: randomInRange(150, 30), empathyAvg: randomFloat(82, 5), positiveAttentionAvg: randomFloat(85, 4), allianceAvg: randomFloat(80, 5) },
    { userRating: '4分', topicCount: randomInRange(100, 20), empathyAvg: randomFloat(76, 5), positiveAttentionAvg: randomFloat(78, 5), allianceAvg: randomFloat(74, 5) },
    { userRating: '3分', topicCount: randomInRange(60, 15), empathyAvg: randomFloat(68, 6), positiveAttentionAvg: randomFloat(70, 6), allianceAvg: randomFloat(66, 6) },
    { userRating: '2分', topicCount: randomInRange(30, 10), empathyAvg: randomFloat(58, 7), positiveAttentionAvg: randomFloat(60, 7), allianceAvg: randomFloat(55, 7) },
    { userRating: '1分', topicCount: randomInRange(15, 5), empathyAvg: randomFloat(45, 8), positiveAttentionAvg: randomFloat(48, 8), allianceAvg: randomFloat(42, 8) },
    { userRating: '未评分', topicCount: randomInRange(80, 20), empathyAvg: randomFloat(70, 6), positiveAttentionAvg: randomFloat(72, 6), allianceAvg: randomFloat(68, 6) },
  ];
};

// 评估器版本信息
export const evaluatorVersion: EvaluatorVersion = {
  version: 'v1.2.0',
  lastUpdate: '2025-01-10',
  changelog: [
    {
      version: 'v1.2.0',
      date: '2025-01-10',
      changes: ['优化共情维度评分标准', '调整咨访同盟权重'],
    },
    {
      version: 'v1.1.0',
      date: '2024-12-20',
      changes: ['新增对沉默回应的评估', '修正积极关注评分偏差'],
    },
    {
      version: 'v1.0.0',
      date: '2024-12-01',
      changes: ['初始版本发布'],
    },
  ],
};

// 生成AB测试数据（A版略优于B版）
export const generateABTestData = (date: string): ABTestData => {
  // A版 - 心理咨询风格
  const aActiveUsers = randomInRange(250, 50);
  const aInsightUsers = randomInRange(Math.floor(aActiveUsers * 0.62), 25);
  const aTotalRated = randomInRange(Math.floor(aInsightUsers * 0.72), 15);
  const aRating5 = randomInRange(Math.floor(aTotalRated * 0.38), 10);
  const aRating4 = randomInRange(Math.floor(aTotalRated * 0.26), 8);

  // B版 - 教练技术风格
  const bActiveUsers = randomInRange(250, 50);
  const bInsightUsers = randomInRange(Math.floor(bActiveUsers * 0.58), 25);
  const bTotalRated = randomInRange(Math.floor(bInsightUsers * 0.68), 15);
  const bRating5 = randomInRange(Math.floor(bTotalRated * 0.32), 10);
  const bRating4 = randomInRange(Math.floor(bTotalRated * 0.24), 8);

  return {
    versionA: {
      userRating: {
        date,
        fiveStarCount: aRating5,
        fourFiveStarCount: aRating5 + aRating4,
        totalRatedUsers: aTotalRated,
        insightUsers: aInsightUsers,
        activeUsers: aActiveUsers,
        distribution: {
          rating5: aRating5,
          rating4: aRating4,
          rating3: randomInRange(Math.floor(aTotalRated * 0.15), 5),
          rating2: randomInRange(Math.floor(aTotalRated * 0.08), 3),
          rating1: randomInRange(Math.floor(aTotalRated * 0.03), 2),
          unrated: Math.max(0, aInsightUsers - aTotalRated),
        },
      },
      aiEvaluation: {
        date,
        empathyScore: randomFloat(77, 5),
        positiveAttentionScore: randomFloat(80, 4),
        allianceScore: randomFloat(74, 5),
      },
      crossAnalysis: generateCrossAnalysisData(),
    },
    versionB: {
      userRating: {
        date,
        fiveStarCount: bRating5,
        fourFiveStarCount: bRating5 + bRating4,
        totalRatedUsers: bTotalRated,
        insightUsers: bInsightUsers,
        activeUsers: bActiveUsers,
        distribution: {
          rating5: bRating5,
          rating4: bRating4,
          rating3: randomInRange(Math.floor(bTotalRated * 0.18), 5),
          rating2: randomInRange(Math.floor(bTotalRated * 0.12), 3),
          rating1: randomInRange(Math.floor(bTotalRated * 0.06), 2),
          unrated: Math.max(0, bInsightUsers - bTotalRated),
        },
      },
      aiEvaluation: {
        date,
        empathyScore: randomFloat(73, 5),
        positiveAttentionScore: randomFloat(76, 4),
        allianceScore: randomFloat(70, 5),
      },
      crossAnalysis: generateCrossAnalysisData(),
    },
  };
};

// 生成30天AB测试趋势数据
export const generateABTrendData = (days: number = 30) => {
  const dates = generateDates(days);
  return dates.map((date) => generateABTestData(date));
};
