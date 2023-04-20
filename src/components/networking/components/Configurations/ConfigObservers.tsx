import { DeleteOutlined, ExclamationCircleOutlined, InfoCircleOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, List, Modal, Row, Select, Typography, Space, Tooltip, Card } from 'antd';
import React, { useState, useContext } from 'react';
import { NetworkingContext } from '../../context/NetworkingContext';
import { CreateObservers } from '../../interfaces/configurations.interfaces';
import { DispatchMessageService } from '@/context/MessageService';

export default function ConfigObservers() {
  const [modalConfig, setModalConfig] = useState(false);
  const [loader, setLoader] = useState(false);
  const { attendeesList, createObserver, deleteObserver, observers } = useContext(NetworkingContext);

  const closeModal = () => {
    setModalConfig(false);
  };

  const onDelete = async (id : string) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere...',
      action: 'show',
    });
    Modal.confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        const onHandlerRemove = async () => {
          try {
            setLoader(true);
            await deleteObserver(id);
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'success',
              msj: 'Se eliminó la información correctamente!',
              action: 'show',
            });
            setLoader(false);
          } catch (e) {
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'error',
              msj: 'Ha ocurrido un error',
              action: 'show',
            });
          }
        };
        onHandlerRemove();
      },
    });
  };

  const onCreate = async (data: CreateObservers) => {
    setLoader(true)
    setModalConfig(false);
    await createObserver(data);
    setLoader(false)
  };

  return (
    <>
      {modalConfig && (
        <Modal
          visible={modalConfig}
          title={'Agregar observador'}
          footer={false}
          onCancel={closeModal}
          okText={'Guardar'}>
          <Form onFinish={onCreate} layout='vertical'>
            <Form.Item
              name={'data'}
              label={'Participantes'}
              rules={[{ required: true, message: 'Debe seleccionar un participante' }]}
              initialValue={[]}
              help={
                <Typography.Text type='secondary'>
                  <InfoCircleOutlined /> Puede seleccionar más de un observador
                </Typography.Text>
              }>
              <Select
                allowClear
                mode='multiple'
                options={attendeesList()}
                defaultValue={[]}
                placeholder='Seleccione un observador'
                style={{ paddingBottom: '5px' }}
                showArrow={true}
              />
            </Form.Item>
            <Row justify='end'>
              <Button type='primary' icon={<SaveOutlined />} htmlType='submit'>
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
          <Tooltip placement='top' title='Configuración de observadores'><Typography.Text strong>Configuración de <br /> observadores</Typography.Text></Tooltip>}
        headStyle={{border: 'none'}}
        extra={
          <Tooltip placement='top' title='Agregar observadores'>
            <Button
              type='primary'
              icon={<PlusCircleOutlined />}
              size='middle'
              onClick={() => {
                setModalConfig(true);
              }}>
              Agregar
            </Button>
          </Tooltip>
        }
      >
        <List
          pagination={observers && observers.length > 5 && { pageSize: 5 }}
          header={<Typography.Text strong>Observadores</Typography.Text>}
          bordered
          dataSource={observers}
          renderItem={(item) => (
            <List.Item
              extra={
                <Tooltip placement='topLeft' title='Eliminar'>
                  <Button onClick={() => onDelete(item.id)} icon={<DeleteOutlined />} danger type='primary' loading={loader}/>
                </Tooltip>
              }>
              <Typography.Text ellipsis style={{width: '220px'}}>{item.label}</Typography.Text>
            </List.Item>
          )}
        />
      </Card>
    </>
  );
}
