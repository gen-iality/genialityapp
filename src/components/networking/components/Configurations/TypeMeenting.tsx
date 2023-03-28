import { PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, List, Modal, Row, Space, Tag, Typography } from 'antd';
import React, { useState, useContext } from 'react';
import { NetworkingContext } from '../../context/NetworkingContext';
import { SketchPicker } from 'react-color';
import { IColor, ITypeMeenting } from '../../interfaces/configurations.interfaces';

export default function TypeMeenting() {
  const [selected, setselected] = useState<ITypeMeenting>({ id: '', nameType: '', style: '' });
  const [modalType, setModalType] = useState(false);
  const [edit, setEdit] = useState(false);
  const [color, setColor] = useState('#406D85');

  const { typeMeetings, createType, deleteType, updateType } = useContext(NetworkingContext);

  const handleColorChange = (value: IColor) => {
    setColor(value.hex);
  };
  const closeModal = () => {
    setColor('#406D85');
    setEdit(false);
    setModalType(false);
  };

  const openModal = () => {
    setModalType(true);
  };

  const onEdit = (select: ITypeMeenting) => {
    setselected(select);
    setColor(select.style);
    setEdit(true);
    openModal();
  };

  const onUpdate = (data: { name: string; color: string }) => {
    updateType(selected.id, {
      nameType: data.name,
      style: color,
    });
    setModalType(false);
  };

  const onCreate = (data: { name: string; color: string }) => {
    createType({
      nameType: data.name,
      style: color,
    });
    setModalType(false);
  };
  return (
    <>
      {modalType && (
        <Modal
          visible={modalType}
          title={edit ? 'editar tipo de reunion' : 'Agregar tipo de reunion'}
          footer={false}
          onCancel={closeModal}
          okText={'Guardar'}>
          <>
            <Form onFinish={edit ? onUpdate : onCreate} layout='horizontal'>
              <Form.Item
                name={'name'}
                label={'nombre'}
                rules={[{ required: true, message: 'debe seleccionar un participante'},{max: 15, message: 'el nombre tiene un maximo de 15 caracteres'}]}
                initialValue={edit ? selected.nameType : ''}>
                <Input placeholder='nombre del tipo de reunion' />
              </Form.Item>
              <Form.Item name={'color'} label={'color'}></Form.Item>
              <Space size={'small'} align='center' direction='vertical' style={{ display: 'flex' }}>
                <SketchPicker color={color} onChangeComplete={handleColorChange} />
                <Button type='primary' style={{ margin: 10 }} htmlType='submit'>
                  Guardar
                </Button>
              </Space>
            </Form>
          </>
        </Modal>
      )}
      <Row justify='end'>
        <Button type='primary' icon={<PlusCircleOutlined />} size='middle' onClick={openModal}>
          Agregar
        </Button>
      </Row>
      <Divider orientation='left'>Tipos de reuniones</Divider>
      <List
        pagination={{ pageSize: 3 }}
        header={<div>Tipos</div>}
        bordered
        dataSource={typeMeetings}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button onClick={() => onEdit(item)} icon={<EditOutlined />} />,
              <Button onClick={() => deleteType(item.id)} icon={<DeleteOutlined />} />,
            ]}>
            <Space style={{ width: 80 }}>
              <Typography.Text>{item.nameType}</Typography.Text>
            </Space>
            <Space>
              <Tag color={item.style} style={{ width: '100px', height: 15 }}></Tag>
            </Space>
          </List.Item>
        )}
      />
    </>
  );
}
