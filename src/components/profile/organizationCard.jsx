import { EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Space, Typography, Grid } from 'antd';
import React from 'react';

const { useBreakpoint } = Grid;

const OrganizationCard = (props) => {
  const screens = useBreakpoint();

  const adminOrganization = () => {
    window.location.href = `${window.location.origin}/admin/organization/${props.data.id}/events`;
  };

  const landingOrganization = () => {
    window.location.href = `${window.location.origin}/organization/${props.data.id}/events`;
  };

  const actionAdmin = screens.xs ? (
    <SettingOutlined key='admin' onClick={() => adminOrganization()} />
  ) : (
    <span onClick={() => adminOrganization()} key='admin'>
      Administrar
    </span>
  );
  const actionview = screens.xs ? (
    <EyeOutlined onClick={() => landingOrganization()} key='view' />
  ) : (
    <span onClick={() => landingOrganization()} key='view'>
      Visitar
    </span>
  );

  return (
    <Card
      actions={[actionAdmin, actionview]}
      style={{ borderRadius: '10px' }}
      bodyStyle={{ minHeight: '200px', textAlign: 'center' }}>
      <Space size={6} direction='vertical' style={{ textAlign: 'center', width: '100%' }}>
        <Avatar
          size={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100, xxl: 100 }}
          src={props.data?.styles?.event_image || 'http://via.placeholder.com/500/50D3C9/FFFFFF?text=Image'}
        />
        <Typography.Text style={{ fontSize: '14px', width: '130px' }}>{props.data?.name}</Typography.Text>
      </Space>
    </Card>
  );
};

export default OrganizationCard;
