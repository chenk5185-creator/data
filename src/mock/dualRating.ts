import dayjs from 'dayjs';
import type {
  DailyUserRating,
  DailyAIEvaluation,
  CrossAnalysisRow,
  EvaluatorVersion,
  ABTestData,
  DislikeConversation,
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
  let cumulativeDislike = 5000; // 初始累计点踩数

  return dates.map((date) => {
    const activeUsers = randomInRange(500, 100);
    const insightUsers = randomInRange(Math.floor(activeUsers * 0.6), 50);
    const totalRatedUsers = randomInRange(Math.floor(insightUsers * 0.7), 30);
    const totalConversations = randomInRange(3000, 500);

    const rating5 = randomInRange(Math.floor(totalRatedUsers * 0.35), 20);
    const rating4 = randomInRange(Math.floor(totalRatedUsers * 0.25), 15);
    const rating3 = randomInRange(Math.floor(totalRatedUsers * 0.15), 10);
    const rating2 = randomInRange(Math.floor(totalRatedUsers * 0.1), 5);
    const rating1 = randomInRange(Math.floor(totalRatedUsers * 0.05), 3);
    const unrated = insightUsers - totalRatedUsers;

    // 点踩数据：点踩率约0.5%
    const dislikeCount = randomInRange(Math.floor(totalConversations * 0.005), 5);
    const dislikeRate = Number(((dislikeCount / totalConversations) * 100).toFixed(2));
    cumulativeDislike += dislikeCount;

    return {
      date,
      fiveStarCount: rating5,
      fourFiveStarCount: rating5 + rating4,
      totalRatedUsers,
      insightUsers,
      activeUsers,
      totalConversations,
      distribution: {
        rating1,
        rating2,
        rating3,
        rating4,
        rating5,
        unrated: Math.max(0, unrated),
      },
      dislikeCount,
      dislikeRate,
      cumulativeDislikeCount: cumulativeDislike,
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
export const generateABTestData = (date: string, aCumulativeDislike: number = 2500, bCumulativeDislike: number = 2800): ABTestData => {
  // A版 - 心理咨询风格
  const aActiveUsers = randomInRange(250, 50);
  const aInsightUsers = randomInRange(Math.floor(aActiveUsers * 0.62), 25);
  const aTotalRated = randomInRange(Math.floor(aInsightUsers * 0.72), 15);
  const aRating5 = randomInRange(Math.floor(aTotalRated * 0.38), 10);
  const aRating4 = randomInRange(Math.floor(aTotalRated * 0.26), 8);
  const aTotalConversations = randomInRange(1500, 250);
  const aDislikeCount = randomInRange(Math.floor(aTotalConversations * 0.004), 3); // A版点踩率略低
  const aDislikeRate = Number(((aDislikeCount / aTotalConversations) * 100).toFixed(2));

  // B版 - 教练技术风格
  const bActiveUsers = randomInRange(250, 50);
  const bInsightUsers = randomInRange(Math.floor(bActiveUsers * 0.58), 25);
  const bTotalRated = randomInRange(Math.floor(bInsightUsers * 0.68), 15);
  const bRating5 = randomInRange(Math.floor(bTotalRated * 0.32), 10);
  const bRating4 = randomInRange(Math.floor(bTotalRated * 0.24), 8);
  const bTotalConversations = randomInRange(1500, 250);
  const bDislikeCount = randomInRange(Math.floor(bTotalConversations * 0.006), 3); // B版点踩率略高
  const bDislikeRate = Number(((bDislikeCount / bTotalConversations) * 100).toFixed(2));

  return {
    versionA: {
      userRating: {
        date,
        fiveStarCount: aRating5,
        fourFiveStarCount: aRating5 + aRating4,
        totalRatedUsers: aTotalRated,
        insightUsers: aInsightUsers,
        activeUsers: aActiveUsers,
        totalConversations: aTotalConversations,
        distribution: {
          rating5: aRating5,
          rating4: aRating4,
          rating3: randomInRange(Math.floor(aTotalRated * 0.15), 5),
          rating2: randomInRange(Math.floor(aTotalRated * 0.08), 3),
          rating1: randomInRange(Math.floor(aTotalRated * 0.03), 2),
          unrated: Math.max(0, aInsightUsers - aTotalRated),
        },
        dislikeCount: aDislikeCount,
        dislikeRate: aDislikeRate,
        cumulativeDislikeCount: aCumulativeDislike + aDislikeCount,
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
        totalConversations: bTotalConversations,
        distribution: {
          rating5: bRating5,
          rating4: bRating4,
          rating3: randomInRange(Math.floor(bTotalRated * 0.18), 5),
          rating2: randomInRange(Math.floor(bTotalRated * 0.12), 3),
          rating1: randomInRange(Math.floor(bTotalRated * 0.06), 2),
          unrated: Math.max(0, bInsightUsers - bTotalRated),
        },
        dislikeCount: bDislikeCount,
        dislikeRate: bDislikeRate,
        cumulativeDislikeCount: bCumulativeDislike + bDislikeCount,
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
  let aCumulative = 2500;
  let bCumulative = 2800;
  return dates.map((date) => {
    const data = generateABTestData(date, aCumulative, bCumulative);
    aCumulative = data.versionA.userRating.cumulativeDislikeCount;
    bCumulative = data.versionB.userRating.cumulativeDislikeCount;
    return data;
  });
};

// 示例点踩对话数据
export const sampleDislikeConversations: DislikeConversation[] = [
  {
    topicId: '12345',
    dislikeTime: '2025-01-13 14:30',
    topic: '关于孩子学习问题',
    messages: [
      { role: 'user', content: '我儿子最近不爱学习了' },
      { role: 'ai', content: '这很正常，青春期的孩子都会有这样的阶段' },
      { role: 'user', content: '但我很担心他成绩下降' },
      { role: 'ai', content: '你不用担心，成绩不重要', isDisliked: true },
      { role: 'user', content: '可是高考很重要啊' },
      { role: 'ai', content: '我理解你的担心，高考确实是一个重要的节点。我们可以一起探讨一下如何帮助孩子重新找到学习的动力...' },
    ],
  },
  {
    topicId: '12346',
    dislikeTime: '2025-01-13 11:20',
    topic: '婆媳关系问题',
    messages: [
      { role: 'user', content: '我婆婆总是干涉我们的生活' },
      { role: 'ai', content: '婆媳关系确实是很多家庭面临的挑战' },
      { role: 'user', content: '她总是说我不会带孩子' },
      { role: 'ai', content: '你应该听婆婆的，她有经验', isDisliked: true },
      { role: 'user', content: '但是我觉得她的方法太老了' },
      { role: 'ai', content: '我理解你的感受。每一代人都有自己的育儿理念，重要的是找到平衡点...' },
    ],
  },
  {
    topicId: '12347',
    dislikeTime: '2025-01-12 16:45',
    topic: '工作压力',
    messages: [
      { role: 'user', content: '最近工作压力很大，经常加班' },
      { role: 'ai', content: '工作压力大确实会影响身心健康' },
      { role: 'user', content: '我都快撑不住了' },
      { role: 'ai', content: '那你就辞职呗', isDisliked: true },
      { role: 'user', content: '但是我还有房贷要还' },
      { role: 'ai', content: '我理解你的困境。让我们一起想想，在不辞职的情况下，有哪些方法可以缓解压力...' },
    ],
  },
  {
    topicId: '12348',
    dislikeTime: '2025-01-12 09:15',
    topic: '夫妻沟通问题',
    messages: [
      { role: 'user', content: '我老公从来不听我说话' },
      { role: 'ai', content: '沟通是婚姻中非常重要的一环' },
      { role: 'user', content: '每次我想谈心，他就玩手机' },
      { role: 'ai', content: '男人都这样的，习惯就好', isDisliked: true },
      { role: 'user', content: '我觉得他不在乎我' },
      { role: 'ai', content: '你的感受很重要。也许我们可以探讨一下，如何找到一个双方都能接受的沟通方式...' },
    ],
  },
  {
    topicId: '12349',
    dislikeTime: '2025-01-11 20:30',
    topic: '亲子关系',
    messages: [
      { role: 'user', content: '我女儿说讨厌我' },
      { role: 'ai', content: '听到孩子这样说，一定很伤心' },
      { role: 'user', content: '我不知道哪里做错了' },
      { role: 'ai', content: '你肯定是哪里做得不好，孩子才会这样说', isDisliked: true },
      { role: 'user', content: '我已经很努力了' },
      { role: 'ai', content: '我能感受到你的努力和困惑。孩子说"讨厌"有时候只是一种情绪表达，让我们一起分析一下...' },
    ],
  },
];
