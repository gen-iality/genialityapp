import {
  CheckCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FlagOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, InputNumber, Modal, Row, Space, Steps, Typography, notification } from 'antd';
import React, { useState } from 'react';
import { UseEventContext } from '@/context/eventContext';
import { deleteNetworking, updateOrCreateConfigMeet } from '../services/configuration.service';
import { networkingGlobalConfig } from '../interfaces/Index.interfaces';

const { Step } = Steps;

export default function Initial({ ConfigTime }: networkingGlobalConfig) {
  const { value: Event } = UseEventContext();
  const [loading, setloading] = useState(false);
  const [modal, setModal] = useState(false);

  const onSave = async (data: { meetingDuration: number }) => {
    setloading(true);
    const response = await updateOrCreateConfigMeet(Event._id, {
      ConfigTime: {
          meetingDuration: data.meetingDuration,
          hourFinishSpaces: Event.datetime_to ,
          hourStartSpaces: Event.datetime_from ,
      },
    });

    notification[response ? 'success' : 'error']({
      icon: response ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />,
      message: response ? 'Networking Configurado' : 'Problemas al Configurar Networking',
      style: { color: response ? 'green' : 'orange' },
    });
    setloading(false);
  };

  const onDelete= async () => {
  const response = await deleteNetworking(Event._id)
  notification[response ? 'success' : 'error']({
    icon: response ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />,
    message: response ? 'Configuracion Eliminada' : 'No se logro eliminar la configuracion',
    style: { color: response ? 'green' : 'orange' },
  });
  }
  return (
    <>
      <Row justify='center' gutter={[16, 16]}>
        <Col span={16} style={{ margin: 30 }}>
        {modal && (
        <Modal
          visible={modal}
          title={"Eliminar networking"}
          footer={false}
          onCancel={()=>setModal(false)}
          okText={'Guardar'}>
          
        </Modal>
      )}
          <Card
            hoverable
            style={{ cursor: 'auto', height: '100%', width: '100%', backgroundColor: '#FDFEFE', borderRadius: 8 }}
            >
            <Divider orientation='left'>
              <Typography.Title level={5}> Configuración de Networking</Typography.Title>
            </Divider>
            <Steps direction='horizontal'>
              <Step title={'Fecha Inicio'} description={Event.datetime_from} icon={<StarOutlined />} status='finish' />
              <Step title={'Fecha Fin'} description={Event.datetime_to} icon={<FlagOutlined />} status='finish' />
            </Steps>
            <Form onFinish={onSave} layout='vertical' style={{margin: 10}}>
              <Form.Item
                name={'meetingDuration'}
                label={'Tiempo entre reuniones'}
                rules={[{ required: true, message: 'Debe configurar un minimo de 5 minutos' }]}
                help={
                  <Typography.Text type='secondary'>
                    <InfoCircleOutlined /> Este tiempo es en minutos y no puede ser mayor a 60 ni menor a 5
                  </Typography.Text>
                }
                initialValue={ConfigTime ? ConfigTime.meetingDuration : 5}>
                <InputNumber disabled={loading} max={60} min={5} style={{ width: '100%' }} />
              </Form.Item>
              <Row justify='center' style={{ marginTop: 10 }}>
               <Space align='center'>
               <Button loading={loading} type='primary' icon={<SaveOutlined />} htmlType='submit'>
                  Guardar
                </Button>
                {ConfigTime ? <Button icon={<DeleteOutlined />} danger type='primary' onClick={onDelete}>Eliminar</Button> : <></>}
               </Space>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}
