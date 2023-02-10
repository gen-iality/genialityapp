import { FunctionComponent, useState } from 'react';

import { Modal, Form, Input, Button, Card, Alert } from 'antd';

import { WarningOutlined } from '@ant-design/icons';
import { OrganizationApi } from '@helpers/request';

type FormOrganizationUser = {
  name: string;
  email: string;
};

export interface RegisterMemberFromOrganizationUserModalProps {
  orgMember?: any;
  user?: any;
  visible?: boolean;
  organization: any;
  onRegister?: (orgUserData: any) => void;
}

const RegisterMemberFromOrganizationUserModal: FunctionComponent<RegisterMemberFromOrganizationUserModalProps> = (
  props,
) => {
  const { organization, orgMember, user, visible, onRegister } = props;

  const [isModalOpened, setIsModalOpened] = useState(visible);

  const [form] = Form.useForm<FormOrganizationUser>();

  const onFormSubmit = (values: FormOrganizationUser) => {
    if (!organization?._id) {
      Modal.error({
        title: 'No ha cargado la organización',
        content: 'No se ha cargado la información de la organización aún',
        icon: <WarningOutlined />,
        onOk: () => setIsModalOpened(false),
      });
      return;
    }

    let data: any = {};

    if (user) {
      // Take data from the user, I think
      // some data are: user.names, user.email
      data = {
        // ...
      }; // TODO: fill that data for the organization user
      console.log('Register Organization User from current user');
    } else {
      // Take data from the form
      const { name, email } = values;
      // TODO: do the register
      data = {}; // TODO: fill that data for the organization user
      console.log('Register Organization User', data);
    }

    if (onRegister) {
      onRegister(data);
    }

    // OrganizationApi.saveUser(organization._id, data)
    //   .finally(() => {
    //     setIsModalOpened(false)
    //   })
  };

  if (orgMember) {
    return (
      <Modal
        visible={isModalOpened}
        title='Usuario ya inscrito'
        onOk={() => setIsModalOpened(false)}
        onCancel={() => setIsModalOpened(false)}
      >
        El usuario ya está inscrito como miembro
      </Modal>
    );
  }

  return (
    <Modal
      visible={isModalOpened}
      title='Registrarse como miembro de esta organización'
      okText='Inscribirse'
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFormSubmit}>
        {user ? (
          <Alert message='No se requieren más datos' />
        ) : (
          <>
            <Form.Item label='Nombre' name='name' rules={[{ required: true, message: 'Falta el nombre' }]}>
              <Input />
            </Form.Item>

            <Form.Item label='Correo' name='email' rules={[{ required: true, message: 'Falta el correo' }]}>
              <Input />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default RegisterMemberFromOrganizationUserModal;
