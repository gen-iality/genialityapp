import React from 'react';
import { Steps, Button, message, Form } from 'antd';
import RegisterFast from './Content/RegisterFast';
import RegistrationResult from './Content/RegistrationResult';
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';
import { ScheduleOutlined } from '@ant-design/icons';
import FormComponent from '../events/registrationForm/form';

const { Step } = Steps;

const RegisterUserAndEventUser = ({ screens, stylePaddingMobile, stylePaddingDesktop }) => {
  const [current, setCurrent] = React.useState(0);

  const steps = [
    {
      title: 'First',
      content: <RegisterFast />,
      icon: <AccountOutlineIcon />,
    },
    {
      title: 'Second',
      content: <FormComponent />,
      icon: <TicketConfirmationOutlineIcon />,
    },
    {
      title: 'Last',
      content: <RegistrationResult />,
      icon: <ScheduleOutlined />,
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>
      <div style={{ marginTop: '30px' }}>{steps[current].content}</div>
      <div style={{ marginTop: '30px' }}>
        {current > 0 && (
          <Button size='large' style={{ margin: '0 8px' }} onClick={() => prev()}>
            Anterior
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button size='large' type='primary' onClick={() => next()}>
            Siguiente
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button size='large' type='primary' onClick={() => message.success('Processing complete!')}>
            Finalizar
          </Button>
        )}
      </div>
    </div>
  );
};

export default RegisterUserAndEventUser;
