import { useState, useEffect } from 'react';
import { Steps, Button, Alert } from 'antd';
import RegisterFast from './Content/RegisterFast';
import RegistrationResult from './Content/RegistrationResult';
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';
import { ScheduleOutlined } from '@ant-design/icons';
import FormComponent from '../events/registrationForm/form';
import { UsersApi } from '../../helpers/request';
import { LoadingOutlined } from '@ant-design/icons';
import createNewUser from './ModalsFunctions/createNewUser';
import { useIntl } from 'react-intl';
import { UseEventContext } from '../../context/eventContext';
import { useHelper } from '../../context/helperContext/hooks/useHelper';
import { DispatchMessageService } from '../../context/MessageService';

const { Step } = Steps;

const RegisterUserAndEventUser = ({ screens, stylePaddingMobile, stylePaddingDesktop }: any) => {
  const intl = useIntl();
  const cEvent = UseEventContext();
  const [current, setCurrent] = useState(0);
  const [basicDataUser, setbasicDataUser] = useState({
    names: '',
    email: '',
    password: '',
    picture: '',
  });
  let { helperDispatch, currentAuthScreen } = useHelper();
  const [dataEventUser, setdataEventUser] = useState({});
  const [buttonStatus, setbuttonStatus] = useState(true);
  const [validationGeneral, setValidationGeneral] = useState<{
    status: boolean;
    textError: string;
    loading: boolean;
    component?: any;
  }>({
    status: false,
    textError: '',
    loading: false,
  });
  const [validateEventUser, setvalidateEventUser] = useState<{
    status: boolean;
    textError: string;
    statusFields: boolean;
  }>({
    status: false,
    textError: '',
    statusFields: false,
  });

  const hookValidations = (status: boolean, textError: string): any => {
    setValidationGeneral({
      status: status,
      textError: textError,
      loading: false,
    });
    setbuttonStatus(status);
  };

  const HandleHookForm = (e: React.ChangeEvent<HTMLInputElement>, FieldName: string, picture: string): void => {
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
        <FormComponent
          hookValidations={hookValidations}
          dataEventUser={dataEventUser}
          basicDataUser={basicDataUser}
          // @ts-ignore
          HandleHookForm={HandleHookForm}
          validateEventUser={validateEventUser}
          // @ts-ignore
          setvalidateEventUser={setvalidateEventUser}
        />
      ),
      icon: <TicketConfirmationOutlineIcon style={{ fontSize: '32px' }} />,
    },
    {
      title: 'Last',
      content: (
        <RegistrationResult
          validationGeneral={validationGeneral}
          basicDataUser={basicDataUser}
          dataEventUser={dataEventUser}
          cEvent={cEvent}
        />
      ),
      icon: <ScheduleOutlined style={{ fontSize: '32px' }} />,
    },
  ];

  const handleSubmit = () => {
    setCurrent(current + 1);
    if (cEvent.value?.visibility === 'ANONYMOUS') {
      setValidationGeneral({
        status: false,
        loading: false,
        textError: intl.formatMessage({
          id: 'text_error.successfully_registered',
          defaultMessage: 'Te has inscrito correctamente a este evento',
        }),
      });
      return;
    }
  };

  const next = () => {
    if (current == 0) {
      setValidationGeneral({
        loading: false,
        status: false,
        textError: '',
      });
      setCurrent(current + 1);
    } else if (current == 1) {
      setvalidateEventUser({
        status: true,
        textError: '',
        statusFields: true,
      });
    }
  };

  useEffect(() => {
    if (validateEventUser.statusFields) {
      setValidationGeneral({
        ...validationGeneral,
        loading: true,
        status: false,
      });
      handleSubmit();
    }
  }, [validateEventUser.statusFields]);

  const prev = () => {
    setCurrent(current - 1);
    setbuttonStatus(false);
  };

  function validateEmail(email: string) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const ValidateGeneralFields = () => {
    if (basicDataUser.email && basicDataUser.names) {
      if (validateEmail(basicDataUser.email)) {
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
          textError: intl.formatMessage({
            id: 'feedback.title.error',
            defaultMessage: 'Complete los campos solicitados correctamente.',
          }),
          status: true,
        });
      }
    } else {
      setbuttonStatus(true);
    }
  };
  useEffect(() => {
    if (current == 0) {
      ValidateGeneralFields();
    }
  }, [basicDataUser, dataEventUser, current]);

  useEffect(() => {
    if (currentAuthScreen === 'login') setCurrent(0);

    return () => {
      setCurrent(0);
    };
  }, [currentAuthScreen]);

  return (
    <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
      <Steps current={current} responsive={false}>
        {steps.map((item) => (
          <Step key={item.title} icon={item.icon} />
        ))}
      </Steps>
      <div style={{ marginTop: '30px' }}>{steps[current].content}</div>
      <div style={{ marginTop: '30px' }}>
        {current > 0 && current < 2 && (
          <Button
            onClick={() => {
              hookValidations(false, '');
              prev();
            }}
            size='large'
            style={{ margin: '0 8px' }}>
            {intl.formatMessage({
              id: 'register.button.previous',
              defaultMessage: 'Anterior',
            })}
          </Button>
        )}

        {validationGeneral.loading ? (
          <LoadingOutlined style={{ fontSize: '28px' }} />
        ) : (
          <>
            {!validationGeneral.status && (
              <>
                {current < steps.length - 1 && (
                  <Button
                    id='btnnextRegister'
                    disabled={buttonStatus}
                    size='large'
                    type='primary'
                    onClick={() => {
                      next();
                    }}>
                    {current > 0
                      ? intl.formatMessage({
                          id: 'register.button.finalize',
                          defaultMessage: 'Finalizar',
                        })
                      : intl.formatMessage({
                          id: 'register.button.next',
                          defaultMessage: 'Siguiente',
                        })}
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </div>

      {validationGeneral.status && (
        <Alert
          showIcon
          /* style={{ marginTop: '5px' }} */
          style={{
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            borderLeft: '5px solid #FF4E50',
            fontSize: '14px',
            textAlign: 'start',
            borderRadius: '5px',
            marginBottom: '15px',
          }}
          /* closable */
          message={
            <>
              {validationGeneral.textError}
              {validationGeneral.component ? (
                <Button
                  style={{ padding: 4, color: '#333F44', fontWeight: 'bold' }}
                  onClick={() => helperDispatch({ type: 'showLogin' })}
                  type='link'>
                  {validationGeneral.component}
                </Button>
              ) : (
                ''
              )}
            </>
          }
          type='error'
        />
      )}
    </div>
  );
};

export default RegisterUserAndEventUser;
