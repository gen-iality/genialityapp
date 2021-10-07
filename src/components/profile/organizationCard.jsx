import { EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Space, Typography, Grid } from 'antd';
import React from 'react';

const { useBreakpoint } = Grid;

const OrganizationCard = (props) => {
  const screens = useBreakpoint();

  const actionAdmin = screens.xs  ? (<SettingOutlined key='admin' />)  : <span key='admin'>Administrar</span>
  const actionview = screens.xs  ? (<EyeOutlined key='view' />)  : <span key='view'>Visitar</span>

  return (
    <Card
      actions={[actionAdmin, actionview ]}
      style={{ borderRadius: '10px' }}>
      <Space size={5} direction='vertical' style={{ textAlign: 'center', width: '100%' }}>
        <Avatar size={{ xs: 100, sm: 100, md: 60, lg: 80, xl: 100, xxl: 100 }} src={'https://i.pravatar.cc/200'} />
        <Typography.Text style={{ fontSize: '14px', width: '120px' }}>Nombre de la organizacion</Typography.Text>
      </Space>
    </Card>
  );
};

export default OrganizationCard;
