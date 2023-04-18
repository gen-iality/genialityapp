import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FlagOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  StarOutlined,
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
  Space,
  Steps,
  Typography,
  notification,
} from 'antd';
import React, { useState } from 'react';
import { UseEventContext } from '@/context/eventContext';
import { deleteNetworking,createConfgi, updateConfig } from '../services/configuration.service';
import { networkingGlobalConfig } from '../interfaces/Index.interfaces';
import CalendarStarIcon from '@2fd/ant-design-icons/lib/CalendarStar';
import CalendarCheckIcon from '@2fd/ant-design-icons/lib/CalendarCheck';
import useDateFormat from '../hooks/useDateFormat';

export default function Initial({ active,ConfigTime }: networkingGlobalConfig) {
  const { value: Event } = UseEventContext();
  const { dateFormat } = useDateFormat();
  const [loading, setloading] = useState(false);
  const [modal, setModal] = useState(false);
  const [permit, setPermit] = useState(true);

  const onSave = async (data: { meetingDuration: number }) => {
    setloading(true);
    const configItem : networkingGlobalConfig  = {
      active : true,
      ConfigTime: {
        meetingDuration: data.meetingDuration,
        hourFinishSpaces: Event.datetime_to,
        hourStartSpaces: Event.datetime_from,
      }
    }
    let response = false
    if(active){
      response = await updateConfig(Event._id,configItem);
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
      <Row justify='center' gutter={[16, 16]}>
        <Col style={{ paddingTop: 70 }}>
          <Modal
            visible={modal}
            onCancel={() => setModal(false)}
            destroyOnClose={true}
            footer={[
              <Button type='primary' onClick={() => setModal(false)} icon={<CloseCircleOutlined />}>
                Cancelar
              </Button>,
              <Button type="default" danger onClick={onDelete} disabled={permit} icon={<DeleteOutlined />}>
                Eliminar
              </Button>
            ]}
          >
            <Result
              status={'warning'}
              title={
                <Typography.Text strong type='warning' style={{ fontSize: 22 }} >
                  ¿Quieres eliminar networking?
                </Typography.Text>
              }
              extra={
                <Input placeholder="Networking" onChange={(e)=>{
                  if(e.target.value === "Networking" ){
                    setPermit(false)
                  } else {
                    setPermit(true)
                  }
                }}/>
              }
              subTitle={
                <Space style={{ textAlign: 'justify' }} direction='vertical'>
                  <Typography.Paragraph >
                    Esta acción borrará permanentemente los datos de la configuración de networking así como las
                    reuniones previamente establecidas.
                  </Typography.Paragraph>
                
                  <Typography.Paragraph>
                    Para confirmar que deseas borrar toda la configuración de networking, escribe la siguiente palabra:
                    <Typography.Text strong type='danger'> Networking</Typography.Text>
                  </Typography.Paragraph>
                </Space>
              }
            />
          </Modal>
          <Card
            hoverable
            style={{ cursor: 'auto', height: '100%', backgroundColor: 'rgba(196, 196, 196, 0.1)'}}
            title={
              <Typography.Text strong> Configuración de Networking</Typography.Text>
            }
            headStyle={{border: 'none'}}>
            
            <Row justify='center' align='middle' gutter={[16, 16]}>
              <Col span={20}>
                <Steps labelPlacement="vertical" >
                  <Steps.Step title={'Fecha Inicio'} description={dateFormat(Event.datetime_from, 'MM/DD/YYYY hh:mm A')} icon={<CalendarStarIcon />} status='finish' />
                  <Steps.Step title={'Fecha Fin'} description={dateFormat(Event.datetime_to, 'MM/DD/YYYY hh:mm A')} icon={<CalendarCheckIcon />} status='finish' />
                </Steps>
              </Col>
            </Row>
            
            <Form onFinish={onSave} layout='vertical' style={{ paddingTop: 15 }}> 
              <Form.Item
                name={'meetingDuration'}
                label={'Tiempo entre reuniones'}
                rules={[{ required: true, message: 'Debe configurar un mínimo de 5 minutos' }]}
                help={
                  <Typography.Link type='secondary'>
                    <InfoCircleOutlined /> Este tiempo es en minutos y no puede ser mayor a 60 ni menor a 5
                  </Typography.Link>
                }
                initialValue={ConfigTime ? ConfigTime.meetingDuration : 5}>
                <InputNumber disabled={loading} max={60} min={5} style={{ width: '100%' }} />
              </Form.Item>

              <Row justify='end' gutter={[8, 8]} style={{paddingTop: 15}}>
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
          </Card>
        </Col>
      </Row>
    </>
  );
}
