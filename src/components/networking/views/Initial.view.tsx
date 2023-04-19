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
  InputNumber,
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
import CalendarStarIcon from '@2fd/ant-design-icons/lib/CalendarStar';
import CalendarCheckIcon from '@2fd/ant-design-icons/lib/CalendarCheck';
import useDateFormat from '../hooks/useDateFormat';

export default function Initial({ active, ConfigTime, show }: networkingGlobalConfig) {
  const { value: Event } = UseEventContext();
  const { dateFormat } = useDateFormat();
  const [loading, setloading] = useState(false);
  const [modal, setModal] = useState(false);
  const [permit, setPermit] = useState(true);
  const [configShow, setConfigShow] = useState(show ?? false);
  const onSave = async (data: { meetingDuration: number }) => {
    setloading(true);
    const configItem: networkingGlobalConfig = {
      show: configShow,
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
      <Row justify='center' gutter={[32, 32]}>
        <Col span={16}>
          <Modal
            visible={modal}
            onCancel={() => setModal(false)}
            destroyOnClose={true}
            footer={[
              <Button type='primary' onClick={() => setModal(false)} icon={<CloseCircleOutlined />}>
                Cancelar
              </Button>,
              <Button type='default' danger onClick={onDelete} disabled={permit} icon={<DeleteOutlined />}>
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
          <Card hoverable style={{ height: '100%' }}>
            <Space direction='vertical' style={{ width: '100%' }}>
              {!active && (
                <Typography.Text strong style={{ fontSize: 16 }}>
                  Configuración general de networking
                </Typography.Text>
              )}

              <Form onFinish={onSave} layout='vertical'>
                <Form.Item
                  name={'meetingDuration'}
                  label={'Tiempo entre reuniones'}
                  rules={[{ required: true, message: 'Debe configurar un mínimo de 5 minutos' }]}
                  help={
                    <Typography.Link type='secondary'>
                      <InfoCircleOutlined /> Intervalo de tiempo entre las reuniones donde el mínimo es de 5 minutos y
                      un máximo de 30 minutos
                    </Typography.Link>
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
                  {/* <InputNumber disabled={loading} max={60} min={5} style={{ width: '100%' }} /> */}
                </Form.Item>

                <Row justify='start'>
                  <Typography.Paragraph strong>Habilitar la visualizacion de networking:</Typography.Paragraph>
                  <Switch
                    style={{ marginLeft: 10 }}
                    checked={configShow}
                    checkedChildren='Si'
                    unCheckedChildren='No'
                    onChange={() => {
                      setConfigShow(!configShow);
                    }}
                  />
                </Row>
                <Row justify='end' gutter={[8, 8]} style={{ paddingTop: 15 }}>
                  <Col>
                    <Button loading={loading} type='primary' icon={<SaveOutlined />} htmlType='submit'>
                      Guardar
                    </Button>
                  </Col>
                  {active ? (
                    <Col>
                      <Button icon={<DeleteOutlined />} danger type='primary' onClick={() => setModal(true)}>
                        Eliminar
                      </Button>
                    </Col>
                  ) : (
                    <></>
                  )}
                </Row>
              </Form>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable style={{ height: '100%' }}>
            <Space direction='vertical'>
              <Typography.Text strong>Rango de fechas para las reuniones</Typography.Text>
              <Space align='center'>
                <Button
                  icon={<CalendarStarIcon style={{ fontSize: 20, color: 'rgba(0, 0, 0, 0.45)' }} />}
                  type='text'
                  style={{ cursor: 'default' }}
                />
                <div>
                  <Typography.Text strong>Fecha de inicio</Typography.Text> <br />
                  <Typography.Text>{dateFormat(Event.datetime_from, 'lll A')}</Typography.Text>
                </div>
              </Space>
              <Space align='center'>
                <Button
                  icon={<CalendarCheckIcon style={{ fontSize: 20, color: 'rgba(0, 0, 0, 0.45)' }} />}
                  type='text'
                  style={{ cursor: 'default' }}
                />
                <div>
                  <Typography.Text strong>Fecha final</Typography.Text> <br />
                  <Typography.Text>{dateFormat(Event.datetime_to, 'lll A')}</Typography.Text>
                </div>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
}
