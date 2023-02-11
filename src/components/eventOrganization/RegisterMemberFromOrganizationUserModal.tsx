import { FunctionComponent, useEffect, useState } from 'react';

import { Modal, Form, Input, Button, Card, Alert, Select } from 'antd';

import { WarningOutlined } from '@ant-design/icons';
import { OrganizationApi } from '@helpers/request';
import countryOptions from './listOptions/countryOptions';
import cityOptions from './listOptions/cityOptions';
import professionalProfilOptions from './listOptions/professionalProfileOptions';
import indicativeCountryOptions from './listOptions/indicativeCountryOptions';
import mainSpecialistOptions from './listOptions/mainSpecialistOptions';

type FormOrganizationUser = {
  name: string;
  email: string;
};

export interface Props {
  orgMember?: any;
  user?: any;
  visible?: boolean;
  organization: any;
  setVisible: (x: boolean) => void;
  onRegister?: (orgUserData: any) => void;
}

const RegisterMemberFromOrganizationUserModal: FunctionComponent<Props> = (props) => {
  const { organization, orgMember, user, visible, onRegister, setVisible } = props;

  const [form] = Form.useForm<FormOrganizationUser>();

  const closeModal = () => {
    setVisible(false);
  };

  const onFormSubmit = async (values: FormOrganizationUser) => {
    if (!organization?._id) {
      Modal.error({
        title: 'No ha cargado la organización',
        content: 'No se ha cargado la información de la organización aún',
        icon: <WarningOutlined />,
        onOk: () => setVisible(false),
      });
      return;
    }

    let data: any = {};

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
      setVisible(false);
    });
  };

  if (orgMember) {
    return (
      <Modal
        visible={visible}
        title='Usuario ya inscrito'
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        El usuario ya está inscrito como miembro
      </Modal>
    );
  }

  return (
    <>
      <Modal
        visible={visible}
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

              <Form.Item
                label='Indicativo'
                name='indicative'
                rules={[{ required: true, message: 'Falta el indicativo' }]}
              >
                <Select options={indicativeCountryOptions}></Select>
              </Form.Item>

              <Form.Item
                label='Numero de contacto'
                name='number_cel'
                rules={[{ required: true, message: 'Falta el numero de contacto' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label='País' name='country' rules={[{ required: true, message: 'Falta el país' }]}>
                <Select options={countryOptions}></Select>
              </Form.Item>

              <Form.Item label='Ciudad' name='city' rules={[{ required: true, message: 'Falta la ciudad' }]}>
                <Select options={cityOptions}></Select>
              </Form.Item>

              <Form.Item
                label='Perfil profesional'
                name='professional_profile'
                rules={[{ required: true, message: 'Falta el perfil pofesional' }]}
              >
                <Select options={professionalProfilOptions}></Select>
              </Form.Item>

              <Form.Item
                label='Especialidad'
                name='speciality'
                rules={[{ required: true, message: 'Falta la especialidad' }]}
              >
                <Select options={mainSpecialistOptions}></Select>
              </Form.Item>

              <Form.Item
                label='Cédula'
                name='identification_card'
                rules={[{ required: true, message: 'Falta el número de identificación' }]}
              >
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
