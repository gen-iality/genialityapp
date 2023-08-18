import { CloseOutlined } from '@ant-design/icons';
import { Button, Drawer, DrawerProps, Grid, Space, Tooltip, Typography } from 'antd';
import React from 'react';

interface Props extends DrawerProps {
  onCloseDrawer: () => void;
}
const { useBreakpoint } = Grid;

export const UsersByCertificates = ({ onCloseDrawer, ...drawerProps }: Props) => {
  const screens = useBreakpoint();

  return (
    <Drawer
      title={
        <Space wrap size={5} style={{ marginTop: 4 }}>
          <Typography.Title level={5} style={{ marginTop: 4 }}>
            Listado de usuarios con esta
          </Typography.Title>
        </Space>
      }
      footer={false}
      width={screens.xs ? '100%' : '450px'}
      closable={false}
      onClose={onCloseDrawer}
      headerStyle={{ border: 'none', padding: 10 }}
      bodyStyle={{ padding: 5 }}
      extra={
        <Tooltip placement='bottomLeft' title='Cerrar'>
          <Button icon={<CloseOutlined style={{ fontSize: 20 }} />} onClick={onCloseDrawer} type='text' />
        </Tooltip>
      }
      {...drawerProps}></Drawer>
  );
};
