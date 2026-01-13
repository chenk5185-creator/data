import { useMemo } from 'react';
import { Card, Table } from 'antd';
import { generateCrossAnalysisData } from '../../../mock';

const CrossAnalysis = () => {
  const data = useMemo(() => generateCrossAnalysisData(), []);

  const columns = [
    {
      title: '用户评分',
      dataIndex: 'userRating',
      key: 'userRating',
      width: 100,
    },
    {
      title: '话题数',
      dataIndex: 'topicCount',
      key: 'topicCount',
      width: 100,
    },
    {
      title: 'AI-共情均分',
      dataIndex: 'empathyAvg',
      key: 'empathyAvg',
      width: 120,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: 'AI-积极关注均分',
      dataIndex: 'positiveAttentionAvg',
      key: 'positiveAttentionAvg',
      width: 140,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: 'AI-咨访同盟均分',
      dataIndex: 'allianceAvg',
      key: 'allianceAvg',
      width: 140,
      render: (value: number) => value.toFixed(1),
    },
  ];

  const dataWithKey = data.map((item, index) => ({ ...item, key: index }));

  return (
    <div>
      <h3 className="section-title">1.3 交叉对照</h3>

      <Card size="small" title="用户评分 vs AI评估对照表（每日）">
        <Table
          columns={columns}
          dataSource={dataWithKey}
          pagination={false}
          size="small"
          bordered
        />
      </Card>
    </div>
  );
};

export default CrossAnalysis;
