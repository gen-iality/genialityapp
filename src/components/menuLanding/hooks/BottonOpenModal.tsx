import { EditOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, Switch, Select } from 'antd';
import { useState } from 'react';
import { MenuLandingProps } from '../interfaces/menuLandingProps';

export default function BottonOpenModal(props: MenuLandingProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const iconList = [
    { value: 'EditOutlined', label: 'Editar' },
    { value: 'DeleteOutlined', label: 'Eliminar' },
    { value: 'SearchOutlined', label: 'Buscar' },
  ];

  const openModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type='primary' size='small' onClick={openModal} icon={<EditOutlined />} />
      <Modal title='Editar' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item label='Nombre' name='name'>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='Iconos' name='icon'>
            <Select defaultValue='Eliminar' style={{ width: 120 }} options={iconList} />
          </Form.Item>
          <Form.Item label='Habilitado' name='enabled' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
