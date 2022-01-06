import React, { useState } from 'react';
import { Steps, Button, message } from 'antd';
import RegisterFast from './Content/RegisterFast';
import RegistrationResult from './Content/RegistrationResult';
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';
import { ScheduleOutlined } from '@ant-design/icons';
import FormComponent from '../events/registrationForm/form';
import { useEffect } from 'react';

const { Step } = Steps;

const RegisterUserAndEventUser = ({ screens, stylePaddingMobile, stylePaddingDesktop }) => {
  const [current, setCurrent] = React.useState(0);
  const [basicDataUser, setbasicDataUser] = React.useState({
    names: '',
    email: '',
    password: '',
    picture: '',
  });
  const [dataEventUser, setdataEventUser] = useState({});
  const [buttonStatus, setbuttonStatus] = useState(true);

  const HandleHookForm = (e, FieldName, picture) => {
    let value = e.target.value;
    if (current === 0) {
      if (FieldName === 'picture') {
        setbasicDataUser({ ...basicDataUser, [FieldName]: picture });
      } else {
        setbasicDataUser({
          ...basicDataUser,
          [FieldName]: value,
        });
      }
    } else {
      setdataEventUser({
        ...dataEventUser,
        [FieldName]: value,
      });
    }
  };

  const steps = [
    {
      title: 'First',
      content: <RegisterFast basicDataUser={basicDataUser} HandleHookForm={HandleHookForm} />,
      icon: <AccountOutlineIcon style={{ fontSize: '32px' }} />,
    },
    {
      title: 'Second',
      content: (
        <FormComponent dataEventUser={dataEventUser} basicDataUser={basicDataUser} HandleHookForm={HandleHookForm} />
      ),
      icon: <TicketConfirmationOutlineIcon style={{ fontSize: '32px' }} />,
    },
    {
      title: 'Last',
      content: <RegistrationResult />,
      icon: <ScheduleOutlined style={{ fontSize: '32px' }} />,
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    if (basicDataUser.email && basicDataUser.password && basicDataUser.names) {
      setbuttonStatus(false);
    } else {
      setbuttonStatus(true);
    }
  }, [basicDataUser, dataEventUser]);

  return (
    <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} icon={item.icon} />
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
          <Button disabled={buttonStatus} size='large' type='primary' onClick={() => next()}>
            Siguiente
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            disabled={buttonStatus}
            size='large'
            type='primary'
            onClick={() => message.success('Processing complete!')}>
            Finalizar
          </Button>
        )}
      </div>
    </div>
  );
};

export default RegisterUserAndEventUser;
