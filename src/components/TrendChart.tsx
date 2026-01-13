import ReactECharts from 'echarts-for-react';
import { Card } from 'antd';

interface SeriesData {
  name: string;
  data: number[];
  color?: string;
}

interface TrendChartProps {
  title?: string;
  dates: string[];
  series: SeriesData[];
  yAxisLabel?: string;
  height?: number;
  showLegend?: boolean;
}

const TrendChart = ({
  title,
  dates,
  series,
  yAxisLabel,
  height = 300,
  showLegend = true,
}: TrendChartProps) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: showLegend
      ? {
          data: series.map((s) => s.name),
          bottom: 0,
        }
      : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: showLegend ? '15%' : '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        formatter: (value: string) => {
          // 只显示日期部分 MM-DD
          return value.slice(5);
        },
      },
    },
    yAxis: {
      type: 'value',
      name: yAxisLabel,
      axisLabel: {
        formatter: yAxisLabel?.includes('%') ? '{value}%' : '{value}',
      },
    },
    series: series.map((s) => ({
      name: s.name,
      type: 'line',
      smooth: true,
      data: s.data,
      itemStyle: s.color ? { color: s.color } : undefined,
      lineStyle: s.color ? { color: s.color } : undefined,
      areaStyle: {
        opacity: 0.1,
      },
    })),
  };

  const chart = <ReactECharts option={option} style={{ height }} />;

  if (title) {
    return <Card title={title}>{chart}</Card>;
  }

  return chart;
};

export default TrendChart;
