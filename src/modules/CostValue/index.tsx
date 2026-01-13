import { useMemo } from 'react';
import { Card, Row, Col, Progress, Descriptions } from 'antd';
import { StatCard, TrendChart } from '../../components';
import { generateCostData, getCumulativeSocialValue } from '../../mock';

const CostValue = () => {
  const allData = useMemo(() => generateCostData(12), []);
  const latestData = allData[allData.length - 1];
  const cumulative = useMemo(() => getCumulativeSocialValue(allData), [allData]);

  const months = allData.map((d) => d.month);
  const targetCost = 10; // 目标人年成本
  const achievementRate = Math.min(100, Math.round((targetCost / latestData.costPerUserYear) * 100));

  return (
    <div>
      {/* 1. 北极星指标 */}
      <Card title="1. 北极星指标（基于上月）" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={12}>
            <Card size="small" title="人年服务成本">
              <Row gutter={16}>
                <Col span={12}>
                  <StatCard
                    title="当前人年成本"
                    value={latestData.costPerUserYear}
                    precision={2}
                    suffix="元/人年"
                    valueStyle={{ color: latestData.costPerUserYear <= targetCost ? '#52c41a' : '#ff4d4f' }}
                  />
                </Col>
                <Col span={12}>
                  <StatCard title="目标" value={targetCost} suffix="元/人年" />
                </Col>
              </Row>
              <div style={{ marginTop: 16 }}>
                <span>达成率：</span>
                <Progress
                  percent={achievementRate}
                  status={achievementRate >= 100 ? 'success' : 'active'}
                  style={{ width: '80%' }}
                />
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="边际成本结构">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="可变成本">
                  {latestData.variableCost.toFixed(2)} 元/月
                  <span style={{ color: '#666', marginLeft: 8 }}>(API调用，随用户规模线性增长)</span>
                </Descriptions.Item>
                <Descriptions.Item label="固定成本">
                  {latestData.fixedCost.toFixed(2)} 元/月
                  <span style={{ color: '#666', marginLeft: 8 }}>(服务器、存储，规模越大分摊越低)</span>
                </Descriptions.Item>
              </Descriptions>
              <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
                <div>计算说明：</div>
                <div>人年成本 = (上月总成本 ÷ 上月活跃用户数) × 12</div>
                <div>上月活跃用户 = 上月至少发起过1次对话的用户</div>
              </div>
            </Card>
          </Col>
        </Row>
        <TrendChart
          title="过去12个月的人年成本变化"
          dates={months}
          series={[
            { name: '人年成本', data: allData.map((d) => d.costPerUserYear), color: '#1890ff' },
          ]}
          yAxisLabel="元/人年"
          showLegend={false}
        />
      </Card>

      {/* 2. 成本结构拆解 */}
      <Card title="2. 成本结构拆解（基于上月）" style={{ marginBottom: 24 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <StatCard title="上月总成本" value={latestData.totalCost} precision={2} suffix="元" />
          </Col>
          <Col span={8}>
            <StatCard title="上月活跃用户" value={latestData.activeUsers} suffix="人" />
          </Col>
          <Col span={8}>
            <StatCard title="人月成本" value={latestData.costPerActiveUser} precision={2} suffix="元/人月" />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Card size="small" title={`可变成本 (${((latestData.variableCost / latestData.totalCost) * 100).toFixed(0)}%)`}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="API调用">
                  {(latestData.apiCost.chat + latestData.apiCost.insight + latestData.apiCost.evaluation + latestData.apiCost.recommendation + latestData.apiCost.promptPlatform).toFixed(2)} 元
                </Descriptions.Item>
                <Descriptions.Item label="├─ 聊天对话">{latestData.apiCost.chat.toFixed(2)} 元</Descriptions.Item>
                <Descriptions.Item label="├─ 洞察生成">{latestData.apiCost.insight.toFixed(2)} 元</Descriptions.Item>
                <Descriptions.Item label="├─ AI评估">{latestData.apiCost.evaluation.toFixed(2)} 元</Descriptions.Item>
                <Descriptions.Item label="├─ 话题推荐">{latestData.apiCost.recommendation.toFixed(2)} 元</Descriptions.Item>
                <Descriptions.Item label="└─ 提示词协作平台">{latestData.apiCost.promptPlatform.toFixed(2)} 元</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title={`固定成本 (${((latestData.fixedCost / latestData.totalCost) * 100).toFixed(0)}%)`}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="存储">
                  {(latestData.storageCost.database + latestData.storageCost.objectStorage).toFixed(2)} 元
                </Descriptions.Item>
                <Descriptions.Item label="├─ 数据库">{latestData.storageCost.database.toFixed(2)} 元</Descriptions.Item>
                <Descriptions.Item label="└─ 对象存储">{latestData.storageCost.objectStorage.toFixed(2)} 元</Descriptions.Item>
                <Descriptions.Item label="基础设施">
                  {(latestData.infrastructureCost.server + latestData.infrastructureCost.bandwidth + latestData.infrastructureCost.other).toFixed(2)} 元
                </Descriptions.Item>
                <Descriptions.Item label="├─ 服务器">{latestData.infrastructureCost.server.toFixed(2)} 元</Descriptions.Item>
                <Descriptions.Item label="├─ 带宽">{latestData.infrastructureCost.bandwidth.toFixed(2)} 元</Descriptions.Item>
                <Descriptions.Item label="└─ 其他">{latestData.infrastructureCost.other.toFixed(2)} 元</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <TrendChart
          title="过去12个月可变成本与固定成本的占比变化"
          dates={months}
          series={[
            { name: '可变成本', data: allData.map((d) => d.variableCost), color: '#1890ff' },
            { name: '固定成本', data: allData.map((d) => d.fixedCost), color: '#52c41a' },
          ]}
          yAxisLabel="元"
        />
      </Card>

      {/* 3. 服务效率指标 */}
      <Card title="3. 服务效率指标（基于上月）" style={{ marginBottom: 24 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <StatCard title="每活跃用户成本" value={latestData.costPerActiveUser} precision={2} suffix="元/人月" />
          </Col>
          <Col span={8}>
            <StatCard title="每次洞察成本" value={latestData.costPerInsight} precision={2} suffix="元/次" />
          </Col>
          <Col span={8}>
            <StatCard title="每个5分评价成本" value={latestData.costPerFiveStar} precision={2} suffix="元/个" />
          </Col>
        </Row>
        <TrendChart
          title="过去12个月各单位成本的变化"
          dates={months}
          series={[
            { name: '每活跃用户成本', data: allData.map((d) => d.costPerActiveUser), color: '#1890ff' },
            { name: '每个5分评价成本', data: allData.map((d) => d.costPerFiveStar), color: '#ff7a45' },
          ]}
          yAxisLabel="元"
        />
      </Card>

      {/* 4. 社会价值创造 */}
      <Card title="4. 社会价值创造（基于上月）">
        <p style={{ marginBottom: 16, color: '#666' }}>
          基于传统心理咨询300元/小时的市场价格
        </p>
        <Row gutter={24}>
          <Col span={12}>
            <Card size="small" title="上月数据">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="5分评价数">{latestData.fiveStarCount} 个</Descriptions.Item>
                <Descriptions.Item label="等效社会价值">
                  {(latestData.socialValue / 10000).toFixed(2)} 万元
                  <span style={{ color: '#666', marginLeft: 4 }}>({latestData.fiveStarCount} × 300元)</span>
                </Descriptions.Item>
                <Descriptions.Item label="实际成本">{latestData.totalCost.toFixed(2)} 元</Descriptions.Item>
                <Descriptions.Item label="社会价值倍数">
                  <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{latestData.socialValueMultiple} 倍</span>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="累计数据">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="累计5分评价数">{cumulative.totalFiveStars} 个</Descriptions.Item>
                <Descriptions.Item label="累计等效社会价值">
                  {(cumulative.totalSocialValue / 10000).toFixed(2)} 万元
                </Descriptions.Item>
                <Descriptions.Item label="累计实际成本">{cumulative.totalCost.toFixed(2)} 元</Descriptions.Item>
                <Descriptions.Item label="累计社会价值倍数">
                  <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{cumulative.totalMultiple} 倍</span>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
          <div>说明：</div>
          <div>每个5分评价 = 300元等效社会价值</div>
          <div>社会价值倍数 = 等效社会价值 ÷ 实际成本</div>
        </div>
        <TrendChart
          title="过去12个月的社会价值创造"
          dates={months}
          series={[
            { name: '社会价值倍数', data: allData.map((d) => d.socialValueMultiple), color: '#52c41a' },
          ]}
          yAxisLabel="倍数"
          showLegend={false}
        />
      </Card>
    </div>
  );
};

export default CostValue;
