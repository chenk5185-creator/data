import { Card, Collapse } from 'antd';
import UserRating from './components/UserRating';
import AIEvaluation from './components/AIEvaluation';
import CrossAnalysis from './components/CrossAnalysis';
import ABSummary from './components/ABSummary';
import VersionDetail from './components/VersionDetail';

const DualRating = () => {
  const collapseItems = [
    {
      key: 'versionA',
      label: 'A版详细数据（心理咨询风格）',
      children: <VersionDetail version="A" />,
    },
    {
      key: 'versionB',
      label: 'B版详细数据（教练技术风格）',
      children: <VersionDetail version="B" />,
    },
  ];

  return (
    <div>
      {/* 第一部分：双重评分总览（全部用户） */}
      <Card title="第一部分：双重评分总览（全部用户）" style={{ marginBottom: 24 }}>
        <UserRating />
        <AIEvaluation />
        <CrossAnalysis />
      </Card>

      {/* 第二部分：AB版本对比 */}
      <Card title="第二部分：AB版本对比">
        <p style={{ marginBottom: 16, color: '#666' }}>
          说明：用户按ID单双号固定分配，A版=心理咨询风格，B版=教练技术风格
        </p>
        <ABSummary />
        <Collapse items={collapseItems} style={{ marginTop: 16 }} />
      </Card>
    </div>
  );
};

export default DualRating;
