import dayjs from 'dayjs';
import type { PerformanceData, AlertStatus, AlertRecord } from '../types';

const randomFloat = (base: number, variance: number): number => {
  return Math.round((base + (Math.random() - 0.5) * 2 * variance) * 100) / 100;
};

const randomInRange = (base: number, variance: number): number => {
  return Math.round(base + (Math.random() - 0.5) * 2 * variance);
};

// 生成过去N个月的月份数组
const generateMonths = (months: number): string[] => {
  const result: string[] = [];
  for (let i = months - 1; i >= 0; i--) {
    result.push(dayjs().subtract(i, 'month').format('YYYY-MM'));
  }
  return result;
};

export const generatePerformanceData = (months: number = 12): PerformanceData[] => {
  const monthList = generateMonths(months);

  return monthList.map((month) => {
    const availability = randomFloat(99.5, 0.4);
    const totalMinutes = 30 * 24 * 60; // 一个月的分钟数
    const downtime = Math.round((100 - availability) / 100 * totalMinutes);

    const totalConversations = randomInRange(90000, 15000);
    const failureRate = randomFloat(0.5, 0.3);
    const failureCount = Math.round(totalConversations * failureRate / 100);
    const successCount = totalConversations - failureCount;

    return {
      month,
      availability,
      downtime,
      totalConversations,
      successCount,
      failureCount,
    };
  });
};

// 生成过去24小时的小时级数据
export const generateHourlyData = () => {
  const hours: { time: string; failureRate: number; availability: number }[] = [];
  for (let i = 23; i >= 0; i--) {
    const time = dayjs().subtract(i, 'hour').format('HH:00');
    hours.push({
      time,
      failureRate: randomFloat(0.3, 0.25),
      availability: randomFloat(99.8, 0.15),
    });
  }
  return hours;
};

// 生成告警记录
export const generateAlertRecords = (): AlertRecord[] => {
  const alerts: AlertRecord[] = [];
  const now = dayjs();

  // 模拟过去7天的告警
  const alertTypes: Array<{ type: 'warning' | 'critical'; message: string }> = [
    { type: 'critical', message: '回复失败率达3.2%' },
    { type: 'warning', message: '回复失败率达1.5%' },
    { type: 'critical', message: '系统不可用（服务器重启）' },
    { type: 'warning', message: '回复失败率达1.2%' },
    { type: 'warning', message: '系统可用率降至98.5%' },
  ];

  alertTypes.forEach((alert, index) => {
    const hoursAgo = randomInRange(index * 30 + 10, 10);
    alerts.push({
      time: now.subtract(hoursAgo, 'hour').format('YYYY-MM-DD HH:00'),
      type: alert.type,
      message: alert.message,
    });
  });

  return alerts.sort((a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf());
};

// 当前告警状态
export const generateAlertStatus = (): AlertStatus => {
  const failureRate = randomFloat(0.3, 0.2);
  const availability = randomFloat(99.8, 0.15);

  let status: 'normal' | 'warning' | 'critical' = 'normal';
  if (failureRate > 3 || availability < 95) {
    status = 'critical';
  } else if (failureRate > 1 || availability < 99) {
    status = 'warning';
  }

  return {
    status,
    failureRate,
    availability,
    alerts: generateAlertRecords(),
  };
};
