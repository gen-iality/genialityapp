import React, { useContext, useState } from 'react';
import { DeleteOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, List, Modal, Row, Space, Tooltip, Typography } from 'antd';
import { useGetSpaces } from '../../hooks/useGetSpaces';
import { NetworkingContext } from '../../context/NetworkingContext';
import { ISpacesForm } from '../../interfaces/spaces-interfaces';

const ConfigSpaces = () => {
  const [modalConfig, setModalConfig] = useState(false);
  const { loading, spaces } = useGetSpaces();
  const { createSpaces, deleteSpaces } = useContext(NetworkingContext);

  const closeModal = () => {
    setModalConfig(false);
  };

  const onCreateSpaces = (nameSpace: ISpacesForm) => {
    createSpaces(nameSpace);
    closeModal();
  };

  return (
    <>
      {modalConfig && (
        <Modal
          visible={modalConfig}
          title={'Agregar espacio'}
          footer={false}
          onCancel={closeModal}
          okText={'Guardar'}>
          <>
            <Form onFinish={onCreateSpaces} layout='vertical'>
              <Form.Item
                name={'nameSpace'}
                label={'Nombre'}
                rules={[{ required: true, message: 'Debe diligenciar el nombre del espacio' },{max: 20, message: 'El nombre tiene un máximo de 20 caracteres'}]}
                initialValue={''}>
                <Input name={'Nombre del espacio'} type='text' placeholder={'Ej: Salón principal'} />
              </Form.Item>
              <Row justify='end'>
                <Button type='primary' icon={<SaveOutlined />} htmlType='submit'>
                  Guardar
                </Button>
              </Row>
            </Form>
          </>
        </Modal>
      )}
      <Row justify='end' style={{ paddingBottom: '10px' }}>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          size='middle'
          onClick={() => {
            setModalConfig(true);
          }}>
          Agregar
        </Button>
      </Row>
     
      <List
        loading={loading}
        pagination={spaces && spaces.length >= 5 && { pageSize: 5 }}
        header={<div>Espacios</div>}
        bordered
        dataSource={spaces}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Tooltip placement='topLeft' title='Eliminar'>
                <Button onClick={() => deleteSpaces(item.id)} icon={<DeleteOutlined />} danger type='primary' />
              </Tooltip>,
            ]}>
            <Space size={'large'}>
              <Typography.Text>{item.label}</Typography.Text>
            </Space>
          </List.Item>
        )}
      />
    </>
  );
};

export default ConfigSpaces;
