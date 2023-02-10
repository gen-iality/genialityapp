import { FunctionComponent, useEffect, useState } from 'react';

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
  console.log('props', props);

  const [isModalOpened, setIsModalOpened] = useState(visible);

  const [form] = Form.useForm<FormOrganizationUser>();

  useEffect(() => {
    if (visible && !isModalOpened) {
      setIsModalOpened(true);
    }
  }, [visible]);

  const closeModal = () => {
    setIsModalOpened(false);
  };

  const onFormSubmit = async (values: FormOrganizationUser) => {
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

    console.log('1. user', user);

    if (user) {
      data = {
        properties: {
          names: user.names,
          email: user.email,
        },
      };
      console.log('Register Organization User from current user');
    } else {
      const { name, email } = values;
      data = {
        properties: {
          names: name,
          email: email,
        },
      };
      console.log('Register Organization User', data);
    }

    OrganizationApi.saveUser(organization._id, data).finally(() => {
      if (onRegister) {
        onRegister(data);
      }
      setIsModalOpened(false);
    });
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
    <>
      {console.log('render isModalOpened', isModalOpened)}
      {console.log('render user', user)}

      <Modal
        visible={isModalOpened}
        title='Registrarse como miembro de esta organización'
        okText='Inscribirse'
        onOk={() => form.submit()}
        onCancel={closeModal}
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
    </>
  );
};

export default RegisterMemberFromOrganizationUserModal;
