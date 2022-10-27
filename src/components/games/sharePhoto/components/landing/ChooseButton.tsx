import { Avatar, Button, ButtonProps, Space, Typography, Grid } from 'antd';
import { ReactNode } from 'react';

interface Props extends ButtonProps {
  icon: ReactNode;
  label: string;
}

const { useBreakpoint } = Grid;

export default function ChooseButton(props: Props) {
  const { icon, label, ...rest } = props;
  const screens = useBreakpoint();
  return (
    <Button
      style={{ height: screens.xs ? '150px' : '200px', width: screens.xs ? '100%' : '200px', margin: '0 auto' }}
      icon={
        <Space direction='vertical'>
          <Avatar size={60} icon={icon} />
          <Typography.Text>{label}</Typography.Text>
        </Space>
      }
      {...rest}
    />
  );
}
