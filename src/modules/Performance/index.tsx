import { useMemo } from 'react';
import { Card, Row, Col, Table, Tag, Descriptions } from 'antd';
import { StatCard, TrendChart } from '../../components';
import { generatePerformanceData, generateHourlyData, generateAlertStatus } from '../../mock';

const Performance = () => {
  const allData = useMemo(() => generatePerformanceData(12), []);
  const latestData = allData[allData.length - 1];
  const hourlyData = useMemo(() => generateHourlyData(), []);
  const alertStatus = useMemo(() => generateAlertStatus(), []);

  const months = allData.map((d) => d.month);

  const getStatusTag = (status: 'normal' | 'warning' | 'critical') => {
    const config = {
      normal: { color: 'success', text: '🟢 正常' },
      warning: { color: 'warning', text: '🟡 异常' },
      critical: { color: 'error', text: '🔴 严重' },
    };
    return <Tag color={config[status].color}>{config[status].text}</Tag>;
  };

  const alertColumns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '告警类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: 'warning' | 'critical') =>
        type === 'critical' ? <Tag color="error">🔴 严重</Tag> : <Tag color="warning">🟡 异常</Tag>,
    },
    {
      title: '详情',
      dataIndex: 'message',
      key: 'message',
    },
  ];

  const successRate = latestData.totalConversations > 0
    ? ((latestData.successCount / latestData.totalConversations) * 100).toFixed(2)
    : '0';

  const failureRate = latestData.totalConversations > 0
    ? ((latestData.failureCount / latestData.totalConversations) * 100).toFixed(2)
    : '0';

  return (
    <div>
      {/* 1. 基础设施稳定性 */}
      <Card title="1. 基础设施稳定性（基于上月）" style={{ marginBottom: 24 }}>
        <Card size="small" title="系统可用性" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <StatCard
                title="上月可用率"
                value={latestData.availability}
                precision={2}
                suffix="%"
                valueStyle={{ color: latestData.availability >= 99 ? '#52c41a' : '#ff4d4f' }}
              />
            </Col>
            <Col span={12}>
              <StatCard title="不可用时长" value={latestData.downtime} suffix="分钟" />
            </Col>
          </Row>
          <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
            <div>数据来源：阿里云监控后台</div>
            <div>说明：系统可用率 = 系统正常运行时长 ÷ 总时长</div>
          </div>
        </Card>
        <TrendChart
          title="过去12个月的系统可用率"
          dates={months}
          series={[
            { name: '系统可用率', data: allData.map((d) => d.availability), color: '#52c41a' },
          ]}
          yAxisLabel="可用率(%)"
          showLegend={false}
        />
      </Card>

      {/* 2. 核心功能可靠性 */}
      <Card title="2. 核心功能可靠性（基于上月）" style={{ marginBottom: 24 }}>
        <Card size="small" title="回复生成情况" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <StatCard title="总对话数" value={latestData.totalConversations} suffix="轮" />
            </Col>
            <Col span={8}>
              <StatCard
                title="生成成功"
                value={`${latestData.successCount} (${successRate}%)`}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={8}>
              <StatCard
                title="生成失败"
                value={`${latestData.failureCount} (${failureRate}%)`}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Col>
          </Row>
          <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
            <div>说明：</div>
            <div>生成失败定义：用户发送消息后30秒内未收到回复</div>
            <div>失败率 = 生成失败轮数 ÷ 总对话轮数</div>
          </div>
        </Card>
        <TrendChart
          title="过去12个月的回复生成成功率和失败率"
          dates={months}
          series={[
            {
              name: '成功率',
              data: allData.map((d) =>
                d.totalConversations > 0
                  ? Number(((d.successCount / d.totalConversations) * 100).toFixed(2))
                  : 0
              ),
              color: '#52c41a',
            },
            {
              name: '失败率',
              data: allData.map((d) =>
                d.totalConversations > 0
                  ? Number(((d.failureCount / d.totalConversations) * 100).toFixed(2))
                  : 0
              ),
              color: '#ff4d4f',
            },
          ]}
          yAxisLabel="百分比(%)"
        />
      </Card>

      {/* 3. 告警面板（实时监控） */}
      <Card title="3. 告警面板（实时监控）">
        <Card size="small" title="当前状态（每小时更新）" style={{ marginBottom: 16 }}>
          <Descriptions column={3} size="small">
            <Descriptions.Item label="系统状态">
              {getStatusTag(alertStatus.status)}
            </Descriptions.Item>
            <Descriptions.Item label="最近1小时回复失败率">
              <span style={{ color: alertStatus.failureRate > 1 ? '#ff4d4f' : '#52c41a' }}>
                {alertStatus.failureRate.toFixed(2)}%
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="最近1小时系统可用率">
              <span style={{ color: alertStatus.availability < 99 ? '#ff4d4f' : '#52c41a' }}>
                {alertStatus.availability.toFixed(2)}%
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card size="small" title="过去24小时趋势" style={{ marginBottom: 16 }}>
          <TrendChart
            dates={hourlyData.map((d) => d.time)}
            series={[
              { name: '回复失败率', data: hourlyData.map((d) => d.failureRate), color: '#ff4d4f' },
              { name: '系统可用率', data: hourlyData.map((d) => d.availability), color: '#52c41a' },
            ]}
            yAxisLabel="百分比(%)"
            height={250}
          />
        </Card>

        <Card size="small" title="告警记录（过去7天）" style={{ marginBottom: 16 }}>
          <Table
            columns={alertColumns}
            dataSource={alertStatus.alerts.map((alert, index) => ({ ...alert, key: index }))}
            pagination={false}
            size="small"
          />
        </Card>

        <Card size="small" title="告警规则">
          <Row gutter={24}>
            <Col span={12}>
              <Descriptions column={1} size="small" bordered title="回复生成失败率">
                <Descriptions.Item label="> 1%">
                  <Tag color="warning">🟡 异常</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="> 3%">
                  <Tag color="error">🔴 严重</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <Descriptions column={1} size="small" bordered title="系统可用率">
                <Descriptions.Item label="< 99%">
                  <Tag color="warning">🟡 异常</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="< 95%">
                  <Tag color="error">🔴 严重</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </Card>
    </div>
  );
};

export default Performance;
