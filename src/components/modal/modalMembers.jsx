import { useState } from 'react';
import { OrganizationApi, PositionsApi, UsersApi } from '@helpers/request';
import FormComponent from '../events/registrationForm/form';
import { Alert, Button, Grid, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '@context/MessageService';
import { useIntl } from 'react-intl';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import RegisterUserAndOrgMember from '@components/authentication/RegisterUserAndOrgMember';

const { confirm } = Modal;
const { useBreakpoint } = Grid;

const stylePaddingDesktop = {
  paddingLeft: '30px',
  paddingRight: '30px',
  textAlign: 'center',
};
const stylePaddingMobile = {
  paddingLeft: '10px',
  paddingRight: '10px',
  textAlign: 'center',
};

function ModalMembers(props) {
  const organizationId = props.organizationId;
  const userId = props.value._id;
  const intl = useIntl();
  const screens = useBreakpoint();

  const { handleChangeTypeModal, typeModal, helperDispatch, currentAuthScreen, controllerLoginVisible } = useHelper();

  const [loadingregister, setLoadingregister] = useState(false);
  const [existGenialialityUser, setExistGenialialityUser] = useState(true);
  const [makeUserRegister, setMakeUserRegister] = useState(false);

  const options = [
    {
      type: 'danger',
      text: 'Eliminar/Borrar',
      icon: <DeleteOutlined />,
      action: () => deleteUser(props.value),
    },
  ];

  async function deleteUser(user) {
    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        DispatchMessageService({
          type: 'loading',
          key: 'loading',
          msj: ' Por favor espere mientras se borra la información...',
          action: 'show',
        });
        const onHandlerRemove = async () => {
          try {
            await OrganizationApi.deleteUser(organizationId, user._id);
            props.closeOrOpenModalMembers();
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'success',
              msj: 'Se eliminó la información correctamente!',
              action: 'show',
            });
            props.startingComponent();
          } catch (e) {
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'error',
              msj: 'Hubo un error al eliminar',
              action: 'show',
            });
          }
        };
        onHandlerRemove();
      },
    });
    /* try {
      await OrganizationApi.deleteUser(organizationId, user._id);
      props.closeOrOpenModalMembers();
      message.success('Eliminado correctamente');
      props.startingComponent();
    } catch (e) {
      message.error('Hubo un error al eliminar');
    } */
  }

  async function validateGenialityUser(values) {
    console.log('1. values', values);
    console.log('1. values.email', values.email);

    const genialityUserRequest = await UsersApi.findByEmail(values.email);
    console.log('genialityUserRequest', genialityUserRequest)
    const [genialityUser] = genialityUserRequest;
    console.log('genialityUser', genialityUser)

    if (!genialityUser) {
      console.log('1. El usuario no existe, se debe crear el usuario en geniality');
      setExistGenialialityUser(false);
    } else {
      setExistGenialialityUser(true);
      enrollOrgMember(values);
    }
  }

  async function enrollOrgMember(values) {
    setLoadingregister(true);

    let resp;

    if (props.editMember) {
      values.rol_id = values.role
      resp = await OrganizationApi.editUser(organizationId, userId, values);
      if (values.position_id) {
        await PositionsApi.Organizations.addUser(organizationId, values.position_id, resp.account_id);
      }
    } else {
      const body = { properties: values, rol_id: values.role };
      resp = await OrganizationApi.saveUser(organizationId, body);
      if (values.position_id) {
        await PositionsApi.Organizations.addUser(organizationId, values.position_id, resp.account_id);
      }
    }

    if (resp._id) {
      DispatchMessageService({
        type: 'success',
        msj: `Usuario ${props.editMember ? 'editado ' : 'agregado'} correctamente`,
        action: 'show',
      });
      props.setIsLoading(true);
      props.closeOrOpenModalMembers();
      props.startingComponent();
    } else {
      DispatchMessageService({
        type: 'error',
        msj: `No fue posible ${props.editMember ? 'editar ' : 'agregar'} el Usuario`,
        action: 'show',
      });
    }
  }

  return (
    <>
      <Modal closable footer={false} visible onCancel={() => props.closeOrOpenModalMembers()}>
        <div
          style={{
            paddingLeft: '0px',
            paddingRight: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
            marginTop: '30px',
          }}
        >
          {makeUserRegister ? (
            <RegisterUserAndOrgMember
              screens={screens}
              stylePaddingMobile={stylePaddingMobile}
              stylePaddingDesktop={stylePaddingDesktop}
              idOrganization={organizationId} // New!
              defaultPositionId={controllerLoginVisible.defaultPositionId} // New!
              requireAutomaticLoguin={false}
            />
          ) : (
            <FormComponent
              conditionalsOther={[]}
              initialOtherValue={props.value}
              eventUserOther={{}}
              fields={props.extraFields}
              organization
              options={options}
              callback={validateGenialityUser}
              loadingregister={loadingregister}
              editUser={props.editMember}
            />
          )}

          {!existGenialialityUser && (
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
                  {'Usuario no está registrado en Geniality'}
                  <Button
                    style={{ fontWeight: 'bold', marginLeft: '2rem' }}
                    onClick={() => {
                      console.log('Se registra el usuario');
                      setMakeUserRegister(true);
                      setExistGenialialityUser(true);
                    }}
                    type="primary"
                  >
                    Registrar Usuario
                  </Button>
                </>
              }
              type="error"
            />
          )}
        </div>
      </Modal>
    </>
  );
}

export default ModalMembers;
