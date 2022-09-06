import { SmileOutlined } from '@ant-design/icons';
import { Avatar, Card, Row, Space, Typography } from 'antd';
import { ReactNode } from 'react';

interface AccessTypeCardTyped {
  icon: ReactNode;
  title: string;
  description?: string;
  extra?: ReactNode;
  infoIcon: ReactNode[];
}

const AccessTypeCard = ({ icon, title, description = '', extra, infoIcon = [] }: AccessTypeCardTyped) => {
  return (
    <Card style={{ borderRadius: '8px' }}>
      <Space style={{ width: '100%' }} direction='vertical'>
        <Avatar size={'large'} shape='square' icon={icon} />
        <Typography.Text strong style={{ fontSize: '14px' }}>
          {title}
        </Typography.Text>
        <Typography.Paragraph>{description}</Typography.Paragraph>
        <div>{extra}</div>
        <Row justify='end'>
          <Space>
            {infoIcon.map((item) => {
              item;
            })}
          </Space>
        </Row>
      </Space>
    </Card>
  );
};

export default AccessTypeCard;
