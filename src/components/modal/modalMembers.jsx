import { useState } from 'react';
import { OrganizationApi } from '../../helpers/request';
import FormComponent from '../events/registrationForm/form';
import { message, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

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
        const loading = message.open({
          key: 'loading',
          type: 'loading',
          content: <> Por favor espere miestras borra la información..</>,
        });
        const onHandlerRemove = async () => {
          try {
            await OrganizationApi.deleteUser(organizationId, user._id);
            props.closeOrOpenModalMembers();
            message.destroy(loading.key);
            message.open({
              type: 'success',
              content: <> Se eliminó la información correctamente!</>,
            });
            props.startingComponent();
          } catch (e) {
            message.destroy(loading.key);
            message.open({
              type: 'error',
              content: <>Hubo un error al eliminar</>,
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
      message.success(`Usuario ${props.editMember ? 'editado ' : 'agregado'} correctamente`);
      props.startingComponent();
      props.closeOrOpenModalMembers();
    } else {
      message.error(`No fue posible ${props.editMember ? 'editar ' : 'agregar'} el Usuario`);
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
