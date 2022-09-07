import { useState } from 'react';
import { Avatar, Card, Row, Space, Typography } from 'antd';
import { AccessTypeCardInterface } from './interfaces/interfaces';

const AccessTypeCard = ({
  index,
  icon,
  title,
  description = '',
  extra = () => {},
  infoIcon = [],
  callBackSelectedItem = () => {},
  itemSelected = '',
}: AccessTypeCardInterface) => {
  return (
    <Card
      style={{ borderRadius: '8px', cursor: 'pointer', background: itemSelected === index ? '#50d3c9' : 'white' }}
      onClick={() => callBackSelectedItem(index)}>
      <Space style={{ width: '100%' }} direction='vertical'>
        <Avatar size={'large'} shape='square' icon={icon} />
        <Typography.Text strong style={{ fontSize: '14px' }}>
          {title}
        </Typography.Text>
        <Typography.Paragraph>{description}</Typography.Paragraph>
        <div>{itemSelected === index && extra(callBackSelectedItem)}</div>
        <Row justify='end'>
          <Space>{infoIcon.map((item) => item)}</Space>
        </Row>
      </Space>
    </Card>
  );
};

export default AccessTypeCard;
