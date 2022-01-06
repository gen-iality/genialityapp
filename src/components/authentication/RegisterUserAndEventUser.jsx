import React, { useState } from 'react';
import { Steps, Button, message } from 'antd';
import RegisterFast from './Content/RegisterFast';
import RegistrationResult from './Content/RegistrationResult';
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';
import { ScheduleOutlined } from '@ant-design/icons';
import FormComponent from '../events/registrationForm/form';
import { useEffect } from 'react';
import { SearchUserbyEmail } from 'helpers/request';
import { LoadingOutlined } from '@ant-design/icons';
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
  const [validationGeneral, setValidationGeneral] = useState({
    status: false,
    textError: '',
    loading: false,
  });

  const HandleHookForm = (e, FieldName, picture) => {
    let value = '';
    if (FieldName === 'picture') {
      value = picture;
    } else {
      value = e.target.value;
    }

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

  const handleValidateAccountEvius = () => {
    SearchUserbyEmail(basicDataUser.email).then((resp) => {
      console.log('resp', resp);
      if (resp.length > 0) {
        setValidationGeneral({
          loading: false,
          status: true,
          textError: 'El correo ya esta registrado, inicia sesión',
        });
      } else {
        setValidationGeneral({
          loading: false,
          status: false,
          textError: '',
        });
        setCurrent(current + 1);
      }
    });
  };

  const next = () => {
    setValidationGeneral({
      ...validationGeneral,
      loading: true,
    });
    handleValidateAccountEvius();
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  useEffect(() => {
    if (basicDataUser.email && basicDataUser.password && basicDataUser.names) {
      console.log('validar email', validateEmail(basicDataUser.email));

      if (
        validateEmail(basicDataUser.email) &&
        basicDataUser.password.length >= 6 &&
        basicDataUser.password.length <= 18
      ) {
        setbuttonStatus(false);
        setValidationGeneral({
          ...validationGeneral,
          loading: false,
          status: false,
          textError: '',
        });
      } else {
        setValidationGeneral({
          ...validationGeneral,
          loading: false,
          textError: 'LLenar todos los campos correctamente',
          status: true,
        });
      }
    } else {
      setbuttonStatus(true);
    }

    // console.log('basicDataUser', basicDataUser);
    // console.log('dataEventUser', dataEventUser);

    // console.log('completo', {
    //   ...basicDataUser,
    //   ...dataEventUser,
    // });
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

        {validationGeneral.loading ? (
          <LoadingOutlined style={{ fontSize: '17px' }} />
        ) : (
          <>
            {!validationGeneral.status && (
              <>
                {current < steps.length - 1 && (
                  <Button disabled={buttonStatus} size='large' type='primary' onClick={() => next()}>
                    Siguiente
                  </Button>
                )}
              </>
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
          </>
        )}
      </div>

      {validationGeneral.status && <h1>{validationGeneral.textError}</h1>}
    </div>
  );
};

export default RegisterUserAndEventUser;
