import { useMemo } from 'react';
import { Card, Row, Col, Table } from 'antd';
import { useDate } from '../../context/DateContext';
import { StatCard, TrendChart } from '../../components';
import { generateUserUsageData } from '../../mock';

const UserData = () => {
  const { selectedDate } = useDate();

  const allData = useMemo(() => generateUserUsageData(30), []);

  const currentData = useMemo(() => {
    const dateStr = selectedDate.format('YYYY-MM-DD');
    return allData.find((d) => d.date === dateStr) || allData[allData.length - 1];
  }, [allData, selectedDate]);

  const dates = allData.map((d) => d.date);

  return (
    <div>
      {/* 1. 用户规模 */}
      <Card title="1. 用户规模" style={{ marginBottom: 24 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <StatCard title="累计注册用户数" value={currentData.totalUsers} suffix="人" />
          </Col>
          <Col span={8}>
            <StatCard title="今日新增用户数" value={currentData.newUsers} suffix="人" />
          </Col>
          <Col span={8}>
            <StatCard
              title="今日活跃用户数（DAU）"
              value={currentData.activeUsers}
              suffix="人"
              tooltip="今日至少发起过1次对话的用户"
            />
          </Col>
        </Row>
        <TrendChart
          title="趋势图（过去30天）"
          dates={dates}
          series={[
            { name: '新增用户', data: allData.map((d) => d.newUsers), color: '#1890ff' },
            { name: '活跃用户', data: allData.map((d) => d.activeUsers), color: '#52c41a' },
          ]}
          yAxisLabel="人数"
        />
      </Card>

      {/* 2. 对话规模 */}
      <Card title="2. 对话规模" style={{ marginBottom: 24 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <StatCard
              title="今日总对话数"
              value={currentData.totalConversations}
              suffix="轮"
              tooltip="一问一答=1轮"
            />
          </Col>
          <Col span={12}>
            <StatCard
              title="历史总对话数（累计）"
              value={currentData.historicalConversations}
              suffix="轮"
            />
          </Col>
        </Row>
        <TrendChart
          title="趋势图（过去30天）"
          dates={dates}
          series={[
            { name: '每日对话数', data: allData.map((d) => d.totalConversations), color: '#722ed1' },
          ]}
          yAxisLabel="轮数"
          showLegend={false}
        />
      </Card>

      {/* 3. 功能使用 */}
      <Card title="3. 功能使用" style={{ marginBottom: 24 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <StatCard title="今日发起对话用户数" value={currentData.conversationUsers} suffix="人" />
          </Col>
          <Col span={12}>
            <StatCard title="今日生成洞察用户数" value={currentData.insightUsers} suffix="人" />
          </Col>
        </Row>
        <TrendChart
          title="各功能使用趋势图"
          dates={dates}
          series={[
            { name: '对话用户', data: allData.map((d) => d.conversationUsers), color: '#1890ff' },
            { name: '洞察用户', data: allData.map((d) => d.insightUsers), color: '#fa8c16' },
          ]}
          yAxisLabel="人数"
        />
      </Card>

      {/* 4. 使用深度 */}
      <Card title="4. 使用深度" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <StatCard
              title="平均每用户对话轮数"
              value={currentData.avgConversationsPerUser}
              precision={1}
              suffix="轮"
            />
          </Col>
          <Col span={8}>
            <StatCard
              title="平均每用户话题数"
              value={currentData.avgTopicsPerUser}
              precision={1}
              suffix="个"
            />
          </Col>
          <Col span={8}>
            <StatCard
              title="平均每话题对话轮数"
              value={currentData.avgConversationsPerTopic}
              precision={1}
              suffix="轮"
            />
          </Col>
        </Row>
      </Card>

      {/* 5. 用户留存 */}
      <Card title="5. 用户留存">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <StatCard title="次日留存率" value={currentData.retention1Day} precision={1} suffix="%" />
          </Col>
          <Col span={8}>
            <StatCard title="7日留存率" value={currentData.retention7Day} precision={1} suffix="%" />
          </Col>
          <Col span={8}>
            <StatCard title="30日留存率" value={currentData.retention30Day} precision={1} suffix="%" />
          </Col>
        </Row>
        <TrendChart
          title="留存曲线图"
          dates={dates}
          series={[
            { name: '次日留存', data: allData.map((d) => d.retention1Day), color: '#1890ff' },
            { name: '7日留存', data: allData.map((d) => d.retention7Day), color: '#52c41a' },
            { name: '30日留存', data: allData.map((d) => d.retention30Day), color: '#722ed1' },
          ]}
          yAxisLabel="留存率(%)"
        />
      </Card>
    </div>
  );
};

export default UserData;
