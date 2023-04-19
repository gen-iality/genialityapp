import { PlusCircleOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, List, Modal, Row, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useState, useContext } from 'react';
import { NetworkingContext } from '../../context/NetworkingContext';
import { IColor, ITypeMeenting } from '../../interfaces/configurations.interfaces';
import InputColor from '@/components/games/bingo/components/InputColor';

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
          title={edit ? 'Editar tipo de reunión' : 'Agregar tipo de reunión'}
          footer={false}
          onCancel={closeModal}
          okText={'Guardar'}>
          <Form onFinish={edit ? onUpdate : onCreate} layout='vertical'>
            <Form.Item
              name={'name'}
              label={'Nombre'}
              rules={[{ required: true, message: 'El nombre es requerido'},{max: 15, message: 'El nombre tiene un máximo de 15 caracteres'}]}
              initialValue={edit ? selected.nameType : ''}>
              <Input placeholder='Nombre del tipo de reunión' />
            </Form.Item>
            <InputColor
                color={color}
                onChange={(color : any) => handleColorChange(color)}
                labelColorName={'Color'}
              />
            <Row justify='end'>
              <Button type='primary' htmlType='submit' icon={<SaveOutlined />}>
                Guardar
              </Button>
            </Row>
          </Form>
        </Modal>
      )}
      <Card 
        hoverable 
        style={{ height: "100%", backgroundColor: '#FDFEFE'}} 
        title={
          <Tooltip placement='top' title='Configuración de tipos'><Typography.Text strong>Configuración de <br /> tipos</Typography.Text></Tooltip>}
        headStyle={{border: 'none'}}
        extra={
          <Tooltip placement='top' title='Agregar tipos'>
            <Button type='primary' icon={<PlusCircleOutlined />} size='middle' onClick={openModal}>
              Agregar
            </Button>
          </Tooltip>
        }
      >
        <List
          pagination={typeMeetings && typeMeetings.length > 5 && { pageSize: 5 }}
          header={<Typography.Text strong>Tipos</Typography.Text>}
          bordered
          dataSource={typeMeetings}
          renderItem={(item) => (
            <List.Item
              extra={
                <Space wrap>
                  <Tooltip placement='left' title='Editar'><Button onClick={() => onEdit(item)} icon={<EditOutlined />} /></Tooltip>
                  <Tooltip placement='left' title='Eliminar'><Button onClick={() => deleteType(item.id)} icon={<DeleteOutlined />} danger type='primary' /></Tooltip>
                </Space>
              }>
                <Space wrap align='center'>
                  <Typography.Text ellipsis style={{width: '80px'}}>{item.nameType}</Typography.Text>
                  <Tag color={item.style} style={{ width: '100px', height: 20, marginTop: 5 }}></Tag>
                </Space>
            </List.Item>
          )}
        />
      </Card>
    </>
  );
}
