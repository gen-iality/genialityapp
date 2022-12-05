import { Card, Statistic } from 'antd';
import { valueType } from 'antd/lib/statistic/utils';
import React from 'react';

interface CardStatistic {
  title: React.ReactNode | string;
  value: valueType;
  suffix?: React.ReactNode;
  precision?: number;
}

const CardStatistic = ({ title, value, suffix, precision }: CardStatistic) => {
  return (
    <Card bodyStyle={{ padding: '10px' }} style={{ height: '100%' }}>
      <Statistic
        groupSeparator=''
        decimalSeparator=','
        valueStyle={{ fontSize: '18px' }}
        title={title}
        value={value}
        suffix={suffix}
        precision={precision}
      />
    </Card>
  );
};

export default CardStatistic;
