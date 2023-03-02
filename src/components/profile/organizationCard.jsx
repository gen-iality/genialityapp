import { useState, useEffect } from 'react';
import { EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Space, Typography, Grid, Skeleton } from 'antd';
import { OrganizationFuction } from '@helpers/request';
import { truncate } from 'lodash-es';
const { useBreakpoint } = Grid;

const OrganizationCard = (props) => {
  const screens = useBreakpoint();
  const [eventsLength, setEventsLength] = useState(0);

  const adminOrganization = () => {
    window.location.href = `${window.location.origin}/admin/organization/${props.data.id}/events`;
  };

  const landingOrganization = () => {
    window.location.href = `${window.location.origin}/organization/${props.data.id}/events`;
  };

  const actionAdmin = screens.xs ? (
    <SettingOutlined key="admin" onClick={() => adminOrganization()} />
  ) : (
    <span onClick={() => adminOrganization()} key="admin">
      Administrar
    </span>
  );
  const actionview = screens.xs ? (
    <EyeOutlined onClick={() => landingOrganization()} key="view" />
  ) : (
    <span onClick={() => landingOrganization()} key="view">
      Visitar
    </span>
  );

  const fetchItem = async () => {
    const events = await OrganizationFuction.getEventsNextByOrg(props.data.id);
    const eventsLength = events.length;
    setEventsLength(eventsLength);
  };

  useEffect(() => {
    fetchItem();
  }, []);

  return (
    <Card
      actions={[actionAdmin, actionview]}
      style={{ borderRadius: '10px' }}
      bodyStyle={{ minHeight: '200px', textAlign: 'center' }}
    >
      <Space size={8} direction="vertical" style={{ textAlign: 'center', width: '100%' }}>
        {props.data ? (
          <Avatar
            size={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100, xxl: 100 }}
            src={props.data?.styles?.event_image || 'https://via.placeholder.com/500.png/50D3C9/FFFFFF?text=Image'}
          />
        ) : (
          <Skeleton.Avatar active size={100} shape="circle" />
        )}
        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: '14px', lineHeight: '1.15rem' }}>
          {props.data?.name}
        </Typography.Paragraph>
        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: '14px', lineHeight: '1.15rem' }}>
          Cursos: {eventsLength}
        </Typography.Paragraph>
      </Space>
    </Card>
  );
};

export default OrganizationCard;
