import { Card, Statistic } from 'antd';
import { valueType } from 'antd/lib/statistic/utils';
import React from 'react';

interface CardStatistic {
  title: React.ReactNode | string;
  value: valueType;
  suffix?: React.ReactNode;
}

const CardStatistic = ({ title, value, suffix }: CardStatistic) => {
  return (
    <Card bodyStyle={{ padding: '10px' }} style={{ height: '100%' }}>
      <Statistic
        groupSeparator=''
        decimalSeparator=','
        valueStyle={{ fontSize: '18px' }}
        title={title}
        value={value}
        suffix={suffix}
      />
    </Card>
  );
};

export default CardStatistic;
