;
import { Card, Badge, Space, Typography, Button } from 'antd';
import HumanGreetingVariantIcon from '@2fd/ant-design-icons/lib/HumanGreetingVariant';

const CardParticipantRequests = () => {
  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Space size='large'>
        <Badge count={1}>
          <HumanGreetingVariantIcon style={{ fontSize: '36px' }} />
        </Badge>
        <Typography.Text style={{ fontSize: '20px' }} strong>
          Solicitudes de participación de asistentes
        </Typography.Text>
        <Button type='primary'>Ver solicitudes</Button>
      </Space>
    </Card>
  );
};

export default CardParticipantRequests;
