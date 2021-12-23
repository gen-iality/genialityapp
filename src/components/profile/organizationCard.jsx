import { EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Space, Typography, Grid, Skeleton } from 'antd';
import { truncate } from 'lodash-es';
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
      <Space size={8} direction='vertical' style={{ textAlign: 'center', width: '100%' }}>
        {props.data ? (
          <Avatar
            size={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100, xxl: 100 }}
            src={props.data?.styles?.event_image || 'http://via.placeholder.com/500/50D3C9/FFFFFF?text=Image'}
          />
        ) : (
          <Skeleton.Avatar active={true} size={100} shape='circle' />
        )}
        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: '14px', lineHeight: '1.15rem' }}>
          {props.data?.name}
        </Typography.Paragraph>
      </Space>
    </Card>
  );
};

export default OrganizationCard;
