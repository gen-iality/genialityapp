import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';
import { ScheduleOutlined } from '@ant-design/icons';
import { Button, Grid, Space, Steps } from 'antd';
import { useState } from 'react';

const stylePaddingMobile = {
  paddingLeft: '10px',
  paddingRight: '10px',
  textAlign: 'center',
};

const stylePaddingDesktop = {
  paddingLeft: '30px',
  paddingRight: '30px',
  textAlign: 'center',
};

const steps = [
  {
    title: 'First',
    icon: <AccountOutlineIcon style={{ fontSize: '32px' }} />,
  },
  {
    title: 'Second',
    icon: <TicketConfirmationOutlineIcon style={{ fontSize: '32px' }} />,
  },
  {
    title: 'Last',
    icon: <ScheduleOutlined style={{ fontSize: '32px' }} />,
  },
];

export const UserOrganizationForm = () => {
  const screens = Grid.useBreakpoint();
  const [current, setCurrent] = useState(0);

  const onLastStep = () => {
    setCurrent(current > 0 ? current - 1 : current);
  };

  const onNextStep = () => {
    setCurrent(current < steps.length - 1 ? current + 1 : current);
  };
  return (
    <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
      <Steps current={current} responsive={false}>
        {steps.map((item) => (
          <Steps.Step key={item.title} icon={item.icon} />
        ))}
      </Steps>

      <Space>
        <Button onClick={onLastStep}>Atras</Button>
        <Button onClick={onNextStep}>Siguiente</Button>
      </Space>
    </div>
  );
};
