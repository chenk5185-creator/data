import { Card, Statistic, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: ReactNode;
  precision?: number;
  tooltip?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  valueStyle?: React.CSSProperties;
}

const StatCard = ({
  title,
  value,
  suffix,
  prefix,
  precision,
  tooltip,
  trend,
  valueStyle,
}: StatCardProps) => {
  const titleContent = (
    <span>
      {title}
      {tooltip && (
        <Tooltip title={tooltip}>
          <InfoCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: 12 }} />
        </Tooltip>
      )}
    </span>
  );

  return (
    <Card size="small" style={{ height: '100%' }}>
      <Statistic
        title={titleContent}
        value={value}
        suffix={suffix}
        prefix={prefix}
        precision={precision}
        valueStyle={valueStyle}
      />
      {trend && (
        <div style={{ marginTop: 4, fontSize: 12, color: trend.isUp ? '#52c41a' : '#ff4d4f' }}>
          {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
        </div>
      )}
    </Card>
  );
};

export default StatCard;
