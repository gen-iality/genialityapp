import * as React from 'react';
import { useMemo } from 'react';

import { Card, Badge, Space, Typography, Button } from 'antd';
import HumanGreetingVariantIcon from '@2fd/ant-design-icons/lib/HumanGreetingVariant';

export interface ParticipantRequestsCardProps {
  request: any,
  setViewModal: (x: boolean) => void,
};

const ParticipantRequestsCard = (props: ParticipantRequestsCardProps) => {
  const {
    request,
    setViewModal,
  } = props;

  const count = useMemo(() => {
    if (request && Object.keys(request).length > 0)
      return Object
        .values(request)
        .filter((request: any) => request.active != true)
        .length;
    return 0;
  }, [request]);

  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Space size='large'>
        <HumanGreetingVariantIcon style={{ fontSize: '36px' }} />

        <Typography.Text style={{ fontSize: '20px' }} strong>
          Solicitudes de participación de asistentes
        </Typography.Text>
        <Badge
          count={count}>
          <Button onClick={() => setViewModal(true)} type='primary'>
            Ver solicitudes
          </Button>
        </Badge>
      </Space>
    </Card>
  );
};

export default ParticipantRequestsCard;
