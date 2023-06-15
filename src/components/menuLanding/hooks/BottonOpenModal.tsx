import { EditOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, Switch, Select } from 'antd';
import React, { useState } from 'react';
import * as iconComponents from '@ant-design/icons'
import useMenuLanding from './useMenuLanding';
import { MenuLandingProps } from '../interfaces/menuLandingProps';

export default function BottonOpenModal(props:  MenuLandingProps) {
  const { menu, isLoading, titleheader, updateValue, submit, checkedItem } = useMenuLanding(props);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const iconList = [
    { value: 'EditOutlined', label: 'Editar' },
    { value: 'DeleteOutlined', label: 'Eliminar' },
    { value: 'SearchOutlined', label: 'Buscar' },
  ];
  

  const openModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    updateValue('key', name, 'name');

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type='primary' size='small' onClick={openModal} icon={<EditOutlined />} />
      <Modal title='Editar' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form>
          <Form.Item label='Nombre'>
            <Input
              size='small'
              onChange={(e) => {
                e && updateValue('key', e, 'name');
              }}
            />
          </Form.Item>
          <Form.Item label='Iconos'>
            <Select defaultValue='Eliminar' style={{ width: 120 }} options={iconList} />
          </Form.Item>
          <Form.Item label='Habilitado'>
            <Switch checked={true} onChange={(checked) => checkedItem('key', checked)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
