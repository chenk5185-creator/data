// 评分分布
export interface RatingDistribution {
  rating1: number;
  rating2: number;
  rating3: number;
  rating4: number;
  rating5: number;
  unrated: number;
}

// 每日用户评分数据
export interface DailyUserRating {
  date: string;
  fiveStarCount: number;        // 5分人数
  fourFiveStarCount: number;    // 4-5分人数
  totalRatedUsers: number;      // 评分总人数
  insightUsers: number;         // 生成洞察用户数
  activeUsers: number;          // 活跃用户数
  distribution: RatingDistribution;
}

// 每日AI评估数据
export interface DailyAIEvaluation {
  date: string;
  empathyScore: number;           // 共情平均分 (0-100)
  positiveAttentionScore: number; // 积极关注平均分 (0-100)
  allianceScore: number;          // 咨访同盟平均分 (0-100)
}

// 交叉对照数据
export interface CrossAnalysisRow {
  userRating: string;
  topicCount: number;
  empathyAvg: number;
  positiveAttentionAvg: number;
  allianceAvg: number;
}

// AB测试版本数据
export interface VersionData {
  userRating: DailyUserRating;
  aiEvaluation: DailyAIEvaluation;
  crossAnalysis: CrossAnalysisRow[];
}

// AB测试对比数据
export interface ABTestData {
  versionA: VersionData;
  versionB: VersionData;
}

// 评估器版本信息
export interface EvaluatorVersion {
  version: string;
  lastUpdate: string;
  changelog: ChangelogEntry[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

// 用户使用数据模块
export interface UserUsageData {
  date: string;
  totalUsers: number;           // 累计注册用户数
  newUsers: number;             // 今日新增用户数
  activeUsers: number;          // 今日活跃用户数 (DAU)
  totalConversations: number;   // 今日总对话数
  historicalConversations: number; // 历史总对话数
  conversationUsers: number;    // 今日发起对话用户数
  insightUsers: number;         // 今日生成洞察用户数
  avgConversationsPerUser: number;    // 平均每用户对话轮数
  avgTopicsPerUser: number;           // 平均每用户话题数
  avgConversationsPerTopic: number;   // 平均每话题对话轮数
  retention1Day: number;        // 次日留存率
  retention7Day: number;        // 7日留存率
  retention30Day: number;       // 30日留存率
}

// 成本数据
export interface CostData {
  month: string;
  totalCost: number;            // 上月总成本
  activeUsers: number;          // 上月活跃用户数
  costPerUserYear: number;      // 人年成本
  variableCost: number;         // 可变成本
  fixedCost: number;            // 固定成本
  apiCost: {
    chat: number;
    insight: number;
    evaluation: number;
    recommendation: number;
    promptPlatform: number;
  };
  storageCost: {
    database: number;
    objectStorage: number;
  };
  infrastructureCost: {
    server: number;
    bandwidth: number;
    other: number;
  };
  // 服务效率
  costPerActiveUser: number;
  costPerInsight: number;
  costPerFiveStar: number;
  // 社会价值
  fiveStarCount: number;
  socialValue: number;
  socialValueMultiple: number;
}

// 技术性能数据
export interface PerformanceData {
  month: string;
  availability: number;         // 系统可用率
  downtime: number;             // 不可用时长(分钟)
  totalConversations: number;   // 总对话数
  successCount: number;         // 生成成功数
  failureCount: number;         // 生成失败数
}

// 告警记录
export interface AlertRecord {
  time: string;
  type: 'warning' | 'critical';
  message: string;
}

// 实时告警状态
export interface AlertStatus {
  status: 'normal' | 'warning' | 'critical';
  failureRate: number;
  availability: number;
  alerts: AlertRecord[];
}
