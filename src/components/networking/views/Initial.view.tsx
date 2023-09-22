import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Result,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  notification,
} from 'antd';
import React, { useState } from 'react';
import { UseEventContext } from '@/context/eventContext';
import { deleteNetworking, createConfgi, updateConfig } from '../services/configuration.service';
import { networkingGlobalConfig } from '../interfaces/Index.interfaces';
import CalendarTodayIcon from '@2fd/ant-design-icons/lib/CalendarToday';
import CalendarIcon from '@2fd/ant-design-icons/lib/Calendar';
import TimerOutlineIcon from '@2fd/ant-design-icons/lib/TimerOutline';
import useDateFormat from '../hooks/useDateFormat';

export default function Initial({ active, ConfigTime, show }: networkingGlobalConfig) {
  const { value: Event } = UseEventContext();
  const { dateFormat } = useDateFormat();
  const [loading, setloading] = useState(false);
  const [modal, setModal] = useState(false);
  const [permit, setPermit] = useState(true);
  const onSave = async (data: { meetingDuration: number }) => {
    setloading(true);

    const configItem: networkingGlobalConfig = {
      show: false,
      active: true,
      ConfigTime: {
        meetingDuration: data.meetingDuration,
        hourFinishSpaces: Event.datetime_to,
        hourStartSpaces: Event.datetime_from,
      },
    };
    let response = false;
    
    if (active) {
      response = await updateConfig(Event._id, configItem);
    } else {
      response = await createConfgi(Event._id, configItem);
    }

    notification[response ? 'success' : 'error']({
      icon: response ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />,
      message: response ? 'Networking configurado' : 'Problemas al configurar networking',
      style: { color: response ? 'green' : 'orange' },
    });
    setloading(false);
  };

  const updateShowNetworking = async (show : boolean) => {
    setloading(true);
    const response = await updateConfig(Event._id, {show});
      notification[response ? 'success' : 'error']({
      icon: response ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />,
      message: response ? 'Networking configurado' : 'Problemas al configurar networking',
      style: { color: response ? 'green' : 'orange' },
    });
    setloading(false);
  }

  const onDelete = async () => {
    const response = await deleteNetworking(Event._id);
    notification[response ? 'success' : 'error']({
      icon: response ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />,
      message: response ? 'Configuración eliminada' : 'No se logro eliminar la configuración',
      style: { color: response ? 'green' : 'orange' },
    });
  };

  return (
    <>
      <Form onFinish={onSave} layout='vertical' style={{ padding: 20}}>
        <Modal
          visible={modal}
          onCancel={() => setModal(false)}
          destroyOnClose={true}
          footer={[
            <Button key={'btnCancelar'} type='default' onClick={() => setModal(false)} icon={<CloseCircleOutlined />}>
              Cancelar
            </Button>,
            <Button key={'btnEliminar'} type='primary' danger onClick={onDelete} disabled={permit} icon={<DeleteOutlined />}>
              Eliminar
            </Button>,
          ]}>
          <Result
            status={'warning'}
            title={
              <Typography.Text strong type='warning' style={{ fontSize: 22 }}>
                ¿Quieres eliminar networking?
              </Typography.Text>
            }
            extra={
              <Input
                placeholder='Networking'
                onChange={(e) => {
                  if (e.target.value === 'Networking') {
                    setPermit(false);
                  } else {
                    setPermit(true);
                  }
                }}
              />
            }
            subTitle={
              <Space style={{ textAlign: 'justify' }} direction='vertical'>
                <Typography.Paragraph>
                  Esta acción borrará permanentemente los datos de la configuración de networking así como las
                  reuniones previamente establecidas.
                </Typography.Paragraph>

                <Typography.Paragraph>
                  Para confirmar que deseas borrar toda la configuración de networking, escribe la siguiente palabra:
                  <Typography.Text strong type='danger'>
                    {' '}
                    Networking
                  </Typography.Text>
                </Typography.Paragraph>
              </Space>
            }
          />
        </Modal>
        <Row justify='end' gutter={[8, 8]} style={{ paddingBottom: 15 }}>
          {!active && 
          <Col>
            <Button loading={loading} type='primary' icon={<SaveOutlined />} htmlType='submit'>
              Guardar
            </Button>
          </Col>}
          {active && 
            <Col>
              <Button icon={<DeleteOutlined />} danger type='primary' onClick={() => setModal(true)}>
                Eliminar
              </Button>
            </Col>
          }
        </Row>
        <Row justify='center' gutter={[16, 16]}>
          <Col span={active ? 16 : 24}>
            <Card hoverable style={{ height: '100%', borderRadius: 20 }}>
              <Space direction='vertical' style={{ width: '100%' }}>
                {!active && (
                  <Typography.Text strong style={{ fontSize: 16 }}>
                    Configuración general de networking
                  </Typography.Text>
                )}
                <Row justify='center' gutter={[16, 16]} wrap>
                  <Col span={24}>
                    {!active ? 
                      <Form.Item
                        name={'meetingDuration'}
                        label={'Duración de las reuniones'}
                        rules={[{ required: true, message: 'Debe configurar un mínimo de 5 minutos' }]}
                        help={
                          <Typography.Text type='secondary'>
                            <InfoCircleOutlined /> Este tiempo se verá reflejado en la sección de networking en landing
                          </Typography.Text>
                        }
                        initialValue={ConfigTime ? ConfigTime.meetingDuration : 5}>
                        <Select>
                          <Select.Option value={5}>5 minutos</Select.Option>
                          <Select.Option value={10}>10 minutos</Select.Option>
                          <Select.Option value={15}>15 minutos</Select.Option>
                          <Select.Option value={20}>20 minutos</Select.Option>
                          <Select.Option value={25}>25 minutos</Select.Option>
                          <Select.Option value={30}>30 minutos</Select.Option>
                        </Select>
                      </Form.Item>
                      :
                      <Space direction='vertical'>
                        <Typography.Text strong>Duración de las reuniones</Typography.Text>
                        <Space align='center'>
                          <Button
                            icon={<TimerOutlineIcon style={{ fontSize: 20, color: 'rgba(0, 0, 0, 0.45)' }} />}
                            type='text'
                            style={{ cursor: 'default' }}
                          />
                          <Typography.Text>{ConfigTime && ConfigTime.meetingDuration} minutos</Typography.Text>
                        </Space>
                      </Space>
                    } 
                  </Col>
                </Row>
              </Space>
            </Card>
          </Col>
          {active &&
            <Col span={8}>
              <Card hoverable style={{ /* height: '100%',  */borderRadius: 20 }}>
                <Form.Item label={'Publicar y abrir networking en landing'}>
                  <Switch
                    style={{ marginLeft: 10 }}
                    checked={show}
                    checkedChildren='Si'
                    unCheckedChildren='No'
                    loading={loading}
                    onChange={(value) => {
                      updateShowNetworking(value);
                    }}
                  />
                </Form.Item>
              </Card>
            </Col>
          }
        </Row>
      </Form>
    </>
  );
}
