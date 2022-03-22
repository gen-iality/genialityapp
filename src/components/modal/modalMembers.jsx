import { useState } from 'react';
import { OrganizationApi } from '../../helpers/request';
import FormComponent from '../events/registrationForm/form';
import { Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '../../context/MessageService';

const { confirm } = Modal;

function ModalMembers(props) {
  const organizationId = props.organizationId;
  const userId = props.value._id;
  const [loadingregister, setLoadingregister] = useState(false);

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
          msj: ' Por favor espere miestras se borra la información...',
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

  async function saveUser(values) {
    setLoadingregister(true);
    let resp;

    const body = { properties: values };
    if (props.editMember) {
      resp = await OrganizationApi.editUser(organizationId, userId, values);
    } else {
      resp = await OrganizationApi.saveUser(organizationId, body);
    }

    if (resp._id) {
      DispatchMessageService({
        type: 'success',
        msj: `Usuario ${props.editMember ? 'editado ' : 'agregado'} correctamente`,
        action: 'show',
      });
      props.startingComponent();
      props.closeOrOpenModalMembers();
    } else {
      DispatchMessageService({
        type: 'error',
        msj: `No fue posible ${props.editMember ? 'editar ' : 'agregar'} el Usuario`,
        action: 'show',
      });
    }
  }

  return (
    <Modal closable footer={false} visible={true} onCancel={() => props.closeOrOpenModalMembers()}>
      <div
        style={{
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingTop: '0px',
          paddingBottom: '0px',
          marginTop: '30px',
        }}>
        <FormComponent
          conditionalsOther={[]}
          initialOtherValue={props.value}
          eventUserOther={{}}
          fields={props.extraFields}
          organization={true}
          options={options}
          callback={saveUser}
          loadingregister={loadingregister}
        />
      </div>
    </Modal>
  );
}

export default ModalMembers;
