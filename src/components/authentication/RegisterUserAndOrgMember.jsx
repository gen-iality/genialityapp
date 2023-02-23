/** React's libraries imports */
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

/** Antd imports */
import { Steps, Button, Alert, Form } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';

/** Components imports */
import RegisterFast from './Content/RegisterFast';
import RegistrationResult from './Content/RegistrationResult';
import FormComponent from '../events/registrationForm/form';

/** External functions imports */
import createNewUser from './ModalsFunctions/createNewUser';

/** Helpers and utils imports */
import { OrganizationApi, UsersApi } from '@helpers/request';

/** Context imports */
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { useEventContext } from '@context/eventContext';
import { DispatchMessageService } from '@context/MessageService';
import OrganizationPropertiesForm from '@components/organization/forms/OrganizationPropertiesForm';

const { Step } = Steps;

const RegisterUserAndOrgMember = ({
  screens,
  stylePaddingMobile,
  stylePaddingDesktop,
  idOrganization,
  defaultPositionId,
}) => {
  console.log('idOrganization', idOrganization);
  const intl = useIntl();
  const [form] = Form.useForm();
  const { helperDispatch, currentAuthScreen } = useHelper();

  const [current, setCurrent] = useState(0);
  const [basicDataUser, setbasicDataUser] = useState({
    names: '',
    email: '',
    password: '',
    picture: '',
  });
  const [dataOrgMember, setDataOrgMember] = useState({});
  const [buttonStatus, setbuttonStatus] = useState(true);
  const [validationGeneral, setValidationGeneral] = useState({
    status: false,
    textError: '',
    loading: false,
  });
  const [validateOrgMember, setValidateOrgMember] = useState({
    status: false,
    textError: '',
    statusFields: false,
  });
  const [organization, setOrganization] = useState({});

  useEffect(() => {
    async function getOrganization() {
      const response = await OrganizationApi.getOne(idOrganization);
      console.log('response', response);
      setOrganization(response);
    }
    getOrganization();
  }, []);

  useEffect(() => {
    if (validateOrgMember.statusFields) {
      setValidationGeneral({
        ...validationGeneral,
        loading: true,
        status: false,
      });
      handleSubmit();
    }
  }, [validateOrgMember.statusFields]);

  useEffect(() => {
    if (current == 0) {
      ValidateGeneralFields();
    }
  }, [basicDataUser, dataOrgMember, current]);

  useEffect(() => {
    if (currentAuthScreen === 'login') setCurrent(0);

    return () => {
      setCurrent(0);
    };
  }, [currentAuthScreen]);

  const hookValidations = (status, textError) => {
    setValidationGeneral({
      status: status,
      textError: textError,
      loading: false,
    });
    setbuttonStatus(status);
  };

  const HandleHookForm = (e, FieldName, picture) => {
    const value = FieldName === 'picture' ? picture : e.target.value;

    const setter = current === 0 ? setbasicDataUser : setDataOrgMember;
    setbasicDataUser((previous) => ({ ...previous, [FieldName]: value }));
  };

  const onSubmit = (values) => {
    setDataOrgMember(values);
    handleSubmit();
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
        <>
          <OrganizationPropertiesForm
            form={form}
            basicDataUser={basicDataUser}
            orgMember={dataOrgMember}
            onProperyChange={(propertyName, propertyValue) => {
              setDataOrgMember((previous) => ({ ...previous, [propertyName]: propertyValue }))
              }}
            organization={organization}
            onSubmit={onSubmit}
            noSubmitButton={true}
          />
          {/*  {console.log('basicDataUser', basicDataUser)}
          {console.log('dataOrgMember', dataOrgMember)}
          {console.log('organization', organization)}
          {console.log('organization.user_properties', organization.user_properties)}
          <FormComponent
            hookValidations={hookValidations}
            dataOrgMember={dataOrgMember}
            basicDataUser={basicDataUser}
            HandleHookForm={HandleHookForm}
            validateOrgMember={validateOrgMember}
            setValidateOrgMember={setValidateOrgMember}
            organization={organization}
            initialOtherValue={{}}
            conditionalsOther={[]}
            fields={organization.user_properties}
          /> */}
        </>
      ),
      icon: <TicketConfirmationOutlineIcon style={{ fontSize: '32px' }} />,
    },
    {
      title: 'Last',
      content: <RegistrationResult validationGeneral={validationGeneral} basicDataUser={basicDataUser} />,
      icon: <ScheduleOutlined style={{ fontSize: '32px' }} />,
    },
  ];

  const handleValidateAccountGeniality = async () => {
    try {
      const validateEmail = await UsersApi.validateEmail({ email: basicDataUser.email });
      console.log(validateEmail, 'validateEmail');
      if (validateEmail?.message === 'Email valid') {
        setValidationGeneral({
          loading: false,
          status: false,
          textError: '',
        });
        setCurrent(current + 1);
      }
    } catch (err) {
      if (err?.response?.data?.errors?.email[0] === 'email ya ha sido registrado.') {
        setValidationGeneral({
          loading: false,
          status: true,
          textError: intl.formatMessage({
            id: 'modal.feedback.title.error',
            defaultMessage: 'Correo electrónico ya en uso, inicie sesión si desea continuar con este correo.',
          }),
          component: intl.formatMessage({
            id: 'modal.feedback.title.errorlink',
            defaultMessage: 'inicia sesión',
          }),
        });
      } else if (err?.response?.data?.errors?.email[0] === 'email no es un correo válido') {
        setValidationGeneral({
          loading: false,
          status: true,
          textError: intl.formatMessage({
            id: 'modal.feedback.errorDNSNotFound',
            defaultMessage: 'El correo ingresado no es válido.',
          }),
        });
      } else {
        setValidationGeneral({
          loading: false,
          status: true,
          textError: intl.formatMessage({
            id: 'modal.feedback.errorGeneralInternal',
            defaultMessage: 'Se ha presentado un error interno. Por favor intenta de nuevo',
          }),
        });
      }
    }
  };

  const handleSubmit = () => {
    setCurrent(current + 1);
    const SaveGenialityUser = new Promise((resolve, reject) => {
      async function CreateAccount() {
        const resp = await createNewUser(basicDataUser);
        resolve(resp);
      }

      CreateAccount();
    });

    async function createOrgMember() {
      /* const clonBasicDataUser = { ...basicDataUser };
      delete clonBasicDataUser.password;
      delete clonBasicDataUser.picture;

      const dataUser = {
        ...clonBasicDataUser,
        ...dataOrgMember,
      };

      const propertiesOrgMember = { properties: { ...dataUser } }; */

      ////////////////////////////////

      const propertiesOrgMember = { properties: { ...basicDataUser, ...dataOrgMember } };
      delete propertiesOrgMember.password;
      delete propertiesOrgMember.picture;

      console.log('propertiesOrgMember', propertiesOrgMember);
      console.log('Organization', organization);

      try {
        const respUser = await OrganizationApi.saveUser(idOrganization, propertiesOrgMember);
        if (respUser && respUser.account_id) {
          setValidationGeneral({
            status: false,
            loading: false,
            textError: intl.formatMessage({
              // REVISAR: No se debería llamar TextError, si el texto es una respuesta afirmativa.
              id: 'text_error.organization_successfully_registered',
              defaultMessage: 'Te has inscrito correctamente a esta organización',
            }),
          });
          setbasicDataUser({});
          setDataOrgMember({});
        }
      } catch (err) {
        DispatchMessageService({
          type: 'error',
          msj: 'Ha ocurrido un error',
          action: 'show',
        });
      }
    }

    SaveGenialityUser.then((resp) => {
      if (resp) {
        createOrgMember();
      } else {
        setValidationGeneral({
          status: false, // REVISAR: ¿Debe ser true, para que pueda salir la alerta?
          loading: false,
          textError: intl.formatMessage({
            id: 'text_error.error_creating_user',
            defaultMessage: 'Hubo un error al crear el usuario, intente nuevamente',
          }),
        });
      }
    });
  };

  const next = () => {
    if (current == 0) {
      setValidationGeneral({
        ...validationGeneral,
        loading: true,
        status: false,
      });

      handleValidateAccountGeniality();
    } else if (current == 1) {
      form.submit();
      handleSubmit();
      setValidateOrgMember({
        status: true,
        textError: '',
      });

    }
  };

  const prev = () => {
    setCurrent(current - 1);
    setbuttonStatus(false);
  };

  function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const ValidateGeneralFields = () => {
    if (basicDataUser.email && basicDataUser.password && basicDataUser.names) {
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

  return (
    <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
    {console.log('dataOrgMember', dataOrgMember)}
    {console.log('basicDataUser', basicDataUser)}
      {console.log('buttonStatus', buttonStatus)}
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
            style={{ margin: '0 8px' }}
          >
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
                    }}
                  >
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
                  onClick={() => helperDispatch({ type: 'showLogin' })} // REVISAR: Al parecer no está funcionando el dispatch
                  type='link'
                >
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

export default RegisterUserAndOrgMember;
