/** React's libraries imports */
import { useState, useEffect, ReactElement, ReactNode } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router';

/** Antd imports */
import { Steps, Button, Alert, Form } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';

/** Components imports */
import RegisterFast from './Content/RegisterFast';
import RegistrationResult from './Content/RegistrationResult';

/** External functions imports */
import createNewUser, { CREATE_NEW_USER_SUCCESS } from './ModalsFunctions/createNewUser';

/** Helpers and utils imports */
import { OrganizationApi, PositionsApi, UsersApi } from '@helpers/request';

/** Context imports */
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { DispatchMessageService } from '@context/MessageService';
import OrganizationPropertiesForm from '@components/organization/forms/OrganizationPropertiesForm';

const { Step } = Steps;

const RegisterUserAndOrgMember = ({
  screens,
  stylePaddingMobile,
  stylePaddingDesktop,
  idOrganization,
  defaultPositionId,
  requireAutomaticLoguin,
  startingComponent,
}: any) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { helperDispatch, currentAuthScreen } = useHelper();
  const location = useLocation();

  const [current, setCurrent] = useState(0);
  const [basicDataUser, setBasicDataUser] = useState<any>({
    names: '',
    email: '',
    password: '',
    picture: '',
  });
  const [dataOrgMember, setDataOrgMember] = useState<any | undefined>(undefined);
  const [buttonStatus, setButtonStatus] = useState(true);
  const [validationGeneral, setValidationGeneral] = useState<{
    status: boolean,
    textError: string,
    isLoading: boolean,
    component?: ReactNode,
  }>({
    status: false,
    textError: '',
    isLoading: false,
    component: undefined,
  });

  const [organization, setOrganization] = useState({});
  const [existGenialialityUser, setExistGenialialityUser] = useState(false);

  const hookValidations = (status: boolean, textError: string) => {
    setValidationGeneral({
      status: status,
      textError: textError,
      isLoading: false,
    });
    setButtonStatus(status);
  };

  const formDataHandler = (e: any, fieldName: string, picture: any) => {
    const value = fieldName === 'picture' ? picture : e.target.value;

    setBasicDataUser((previous: any) => ({
      ...previous,
      [fieldName]: value,
    }));
  };

  const onSubmit = (values: any) => {
    setDataOrgMember(values);
  };

  const steps = [
    {
      title: 'First',
      content: <RegisterFast basicDataUser={basicDataUser} formDataHandler={formDataHandler} />,
      icon: <AccountOutlineIcon style={{ fontSize: '32px' }} />,
    },
    {
      title: 'Second',
      content: (
        <OrganizationPropertiesForm
          form={form}
          basicDataUser={basicDataUser}
          organization={organization}
          onSubmit={onSubmit}
          noSubmitButton
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
          requireAutomaticLoguin={requireAutomaticLoguin}
          cEvent={undefined} // NOTE: in the last this prop was undefined as th next
          dataEventUser={undefined}
        />
      ),
      icon: <ScheduleOutlined style={{ fontSize: '32px' }} />,
    },
  ];

  const handleValidateAccountGeniality = async () => {
    try {
      const validateEmail = await UsersApi.validateEmail({ email: basicDataUser.email });
      if (validateEmail?.message === 'Email valid') {
        setValidationGeneral({
          isLoading: false,
          status: false,
          textError: '',
        });
        setCurrent(current + 1);
      }
    } catch (err: any) {
      if (err?.response?.data?.errors?.email[0] === 'email ya ha sido registrado.') {
        if (isAdminPage()) {
          setCurrent(current + 1);
          setExistGenialialityUser(true);

          setValidationGeneral({
            isLoading: false,
            status: false,
            textError: 'El usuario ya existe. Debes registrar miembro a la organización',
            component: 'Registrar miembro de la organización',
          });
        } else {
          setValidationGeneral({
            isLoading: false,
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
        }
      } else if (err?.response?.data?.errors?.email[0] === 'email no es un correo válido') {
        setValidationGeneral({
          isLoading: false,
          status: true,
          textError: intl.formatMessage({
            id: 'modal.feedback.errorDNSNotFound',
            defaultMessage: 'El correo ingresado no es válido.',
          }),
        });
      } else {
        setValidationGeneral({
          isLoading: false,
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

    async function createAccount() {
      return await createNewUser(basicDataUser);
    }

    async function createOrgMember() {
      const propertiesOrgMember = { properties: { ...basicDataUser, ...dataOrgMember } };
      delete propertiesOrgMember.properties.password;
      delete propertiesOrgMember.properties.picture;

      try {
        const respUser = await OrganizationApi.saveUser(idOrganization, propertiesOrgMember);
        console.log('3. RegisterUser: has default position Id', { defaultPositionId });
        if (defaultPositionId === undefined) {
          console.error('4. This organization has no default position. Eh!');
        } else {
          await PositionsApi.Organizations.addUser(idOrganization, defaultPositionId, respUser.account_id);
        }
        if (respUser && respUser.account_id) {
          setValidationGeneral({
            status: false,
            isLoading: false,
            textError: intl.formatMessage({
              // REVISAR: No se debería llamar TextError, si el texto es una respuesta afirmativa.
              id: 'text_error.organization_successfully_registered',
              defaultMessage: 'Te has inscrito correctamente a esta organización',
            }),
          });
          setBasicDataUser({});
          setDataOrgMember(undefined);
          startingComponent();
        }
      } catch (err) {
        DispatchMessageService({
          type: 'error',
          msj: 'Ha ocurrido un error',
          action: 'show',
        });
      }
    }

    if (existGenialialityUser) {
      createOrgMember();
    } else {
      createAccount().then(({status}) => {
        if (status === CREATE_NEW_USER_SUCCESS) {
          createOrgMember();
        } else {
          setValidationGeneral({
            status: false, // REVISAR: ¿Debe ser true, para que pueda salir la alerta?
            isLoading: false,
            textError: intl.formatMessage({
              id: 'text_error.error_creating_user',
              defaultMessage: 'Hubo un error al crear el usuario, intente nuevamente',
            }),
          });
        }
      });
    }
  };

  const goToNextStep = () => {
    if (current == 0) {
      setValidationGeneral({
        ...validationGeneral,
        isLoading: true,
        status: false,
      });

      handleValidateAccountGeniality();
    } else if (current == 1) {
      form
        .validateFields()
        .then(() => {
          console.log('3. Validate Fields');
          form.submit();
          setValidationGeneral((previous) => ({
            ...previous,
            isLoading: true,
            status: false,
          }));
        })
        .catch((error) => console.log(error));
    }
  };

  const goTopreviousStep = () => {
    setCurrent(current - 1);
    setButtonStatus(false);
  };

  function validateEmail(email: string) {
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
        setButtonStatus(false);
        setValidationGeneral({
          ...validationGeneral,
          isLoading: false,
          status: false,
          textError: '',
        });
      } else {
        setValidationGeneral({
          ...validationGeneral,
          isLoading: false,
          textError: intl.formatMessage({
            id: 'feedback.title.error',
            defaultMessage: 'Complete los campos solicitados correctamente.',
          }),
          status: true,
        });
      }
    } else {
      setButtonStatus(true);
    }
  };

  const isAdminPage = () => {
    const isAdmin = location.pathname.includes('admin');

    if (isAdmin) {
      return true;
    } else return false;
  };

  useEffect(() => {
    if (dataOrgMember !== undefined) {
      handleSubmit();
    }
  }, [dataOrgMember]);

  useEffect(() => {
    OrganizationApi.getOne(idOrganization).then((response) => {
      console.log('response', response);
      setOrganization(response);
    });
  }, []);

  useEffect(() => {
    if (current == 0) {
      ValidateGeneralFields();
    }
  }, [basicDataUser, current]);

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
              goTopreviousStep();
            }}
            size="large"
            style={{ margin: '0 8px' }}
          >
            {intl.formatMessage({
              id: 'register.button.previous',
              defaultMessage: 'Anterior',
            })}
          </Button>
        )}

        {validationGeneral.isLoading ? (
          <LoadingOutlined style={{ fontSize: '28px' }} />
        ) : (
          <>
            {!validationGeneral.status && (
              <>
                {current < steps.length - 1 && (
                  <Button
                    id="btnnextRegister"
                    disabled={buttonStatus}
                    size="large"
                    type="primary"
                    onClick={goToNextStep}
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
              {validationGeneral.component && (
                <Button
                  style={{ padding: 4, color: '#333F44', fontWeight: 'bold' }}
                  onClick={() => helperDispatch({ type: 'showLogin' })} // REVISAR: Al parecer no está funcionando el dispatch
                  type="link"
                >
                  {validationGeneral.component}
                </Button>
              )}
            </>
          }
          type="error"
        />
      )}
    </div>
  );
};

export default RegisterUserAndOrgMember;
