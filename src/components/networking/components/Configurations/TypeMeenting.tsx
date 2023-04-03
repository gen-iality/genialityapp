import { PlusCircleOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, List, Modal, Row, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useState, useContext } from 'react';
import { NetworkingContext } from '../../context/NetworkingContext';
import { SketchPicker } from 'react-color';
import { IColor, ITypeMeenting } from '../../interfaces/configurations.interfaces';
import InputColor from '@/components/games/bingo/components/InputColor';

export default function TypeMeenting() {
  const [selected, setselected] = useState<ITypeMeenting>({ id: '', nameType: '', style: '' });
  const [modalType, setModalType] = useState(false);
  const [edit, setEdit] = useState(false);
  const [color, setColor] = useState('#406D85');

  const { typeMeetings, createType, deleteType, updateType } = useContext(NetworkingContext);

  const handleColorChange = (value: IColor) => {
    console.log(value, value.hex, 'here')
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
          <>
            <Form onFinish={edit ? onUpdate : onCreate} layout='vertical'>
              <Form.Item
                name={'name'}
                label={'Nombre'}
                rules={[{ required: true, message: 'El nombre es requerido'},{max: 15, message: 'El nombre tiene un máximo de 15 caracteres'}]}
                initialValue={edit ? selected.nameType : ''}>
                <Input placeholder='Nombre del tipo de reunión' />
              </Form.Item>
              <Form.Item name={'color'} /* label={'Color'} */>
                <InputColor
                  color={color}
                  onChange={() => handleColorChange}
                  labelColorName={'Color'}
                />
                {/* <Space size={'small'} align='center' direction='vertical' style={{ display: 'flex' }}>
                  <SketchPicker color={color} onChangeComplete={handleColorChange} />
                </Space> */}
              </Form.Item>
              <Row justify='end'>
                <Button type='primary' /* style={{ margin: 10 }}  */htmlType='submit' icon={<SaveOutlined />}>
                  Guardar
                </Button>
              </Row>
            </Form>
          </>
        </Modal>
      )}
      <Row justify='end' style={{paddingBottom: '10px'}}>
        <Button type='primary' icon={<PlusCircleOutlined />} size='middle' onClick={openModal}>
          Agregar
        </Button>
      </Row>
      {/* <Divider orientation='left'>Tipos de reuniones</Divider> */}
      <List
        pagination={{ pageSize: 5 }}
        header={<div>Tipos</div>}
        bordered
        dataSource={typeMeetings}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Tooltip placement='left' title='Editar'><Button onClick={() => onEdit(item)} icon={<EditOutlined />} /></Tooltip>,
              <Tooltip placement='left' title='Eliminar'><Button onClick={() => deleteType(item.id)} icon={<DeleteOutlined />} danger type='primary' /></Tooltip>,
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
