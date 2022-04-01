import { Card, Badge, Space, Typography, Button } from 'antd';
import HumanGreetingVariantIcon from '@2fd/ant-design-icons/lib/HumanGreetingVariant';

const CardParticipantRequests = (props: any) => {
  const { request, setViewModal } = props;

  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Space size='large'>
        <HumanGreetingVariantIcon style={{ fontSize: '36px' }} />

        <Typography.Text style={{ fontSize: '20px' }} strong>
          Solicitudes de participación de asistentes
        </Typography.Text>
        <Badge
          count={
            request && Object.keys(request).length > 0
              ? Object.values(request).filter((request: any) => request.active != true).length
              : 0
          }>
          <Button onClick={() => setViewModal(true)} type='primary'>
            Ver solicitudes
          </Button>
        </Badge>
      </Space>
    </Card>
  );
};

export default CardParticipantRequests;
