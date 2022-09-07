import { useState } from 'react';
import { Avatar, Badge, Card, Row, Space, Typography } from 'antd';
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
  isCms = false,
}: AccessTypeCardInterface) => {
  return (
    <Card
      bodyStyle={{ paddingTop: '0px' }}
      headStyle={{ border: 'none' }}
      title={
        <Avatar
          style={{
            color: itemSelected === index ? '#2593FC' : '#FFFFFF',
            backgroundColor: itemSelected === index ? '#2593FC' + '4D' : '#C4C4C4',
          }}
          size={'large'}
          shape='square'
          icon={icon}
        />
      }
      extra={<Badge style={{ backgroundColor: '#2593FC' }} count={itemSelected === index ? 'Activado' : 0}></Badge>}
      style={{
        height: '100%',
        minHeight: '350px',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#FFFFFF',
        borderColor: itemSelected === index ? '#2593FC' : '#F0F0F0',
      }}
      onClick={() => callBackSelectedItem(index)}>
      <Space style={{ width: '100%', height: '100%', userSelect: 'none' }} direction='vertical'>
        <Typography.Text strong style={{ fontSize: '16px' }}>
          {title}
        </Typography.Text>
        <Typography.Paragraph>{description}</Typography.Paragraph>
        <div>{extra(callBackSelectedItem)}</div>
        <Row justify='end' align='bottom' style={{ position: 'absolute', bottom: '15px', right: '24px' }}>
          <Space style={{ fontSize: '22px' }}>{infoIcon.map((item) => item)}</Space>
        </Row>
      </Space>
    </Card>
  );
};

export default AccessTypeCard;
