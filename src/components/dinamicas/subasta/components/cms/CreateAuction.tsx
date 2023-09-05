import {
  CloseCircleOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  TagOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Col, Divider, Form, Input, InputNumber, Modal, Result, Row, Select, Space, Switch, Typography } from 'antd';
import React, { useContext, useState } from 'react';
import { AuctionContext } from '../../context/AuctionContext';
import { AuctionConfig, CreateProps } from '../../interfaces/auction.interface';
import { saveAuctioFirebase } from '../../services/Execute.service';
const { TextArea } = Input;
export default function CreateAuction({ active, auction, event }: CreateProps) {
  const [modal, setModal] = useState<boolean>(false);
  const [permit, setPermit] = useState<boolean>(true);
  const { saveAuction, deleteAuction, uptadeAuction, eventId } = useContext(AuctionContext);
  const isAnonymously = event?.visibility === 'ANONYMOUS';
  const [loading, setLoading] = useState<boolean>(false);

  const onChange = async (value: boolean, key: string) => {
    setLoading(true);
    if (auction) {
      await saveAuctioFirebase(eventId, { ...auction, [key]: value });
    }
    setLoading(false);
  };
  const CreateOrUpdate = async (data: AuctionConfig) => {
    if (auction?._id) {
      await uptadeAuction(data, auction?._id);
    } else {
      await saveAuction(data);
    }
  };

  return (
    <>
      <Form onFinish={CreateOrUpdate} layout='vertical' style={{ padding: 10 }}>
        <Modal
          visible={modal}
          onCancel={() => setModal(false)}
          destroyOnClose={true}
          footer={[
            <Button key={'btnCancelar'} type='default' onClick={() => setModal(false)} icon={<CloseCircleOutlined />}>
              Cancelar
            </Button>,
            <Button
              key={'btnEliminar'}
              type='primary'
              danger
              onClick={() => {
                setModal(false);
                deleteAuction(auction?._id);
              }}
              disabled={permit}
              icon={<DeleteOutlined />}>
              Eliminar
            </Button>,
          ]}>
          <Result
            status={'warning'}
            title={
              <Typography.Text strong type='warning' style={{ fontSize: 22 }}>
                ¿Quieres eliminar la subasta?
              </Typography.Text>
            }
            extra={
              <Input
                placeholder={auction?.name}
                onChange={(e) => {
                  if (auction && e.target.value === auction.name) {
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
                  Esta acción borrará permanentemente los datos de la configuración de la subasta así como los productos
                  previamente creados.
                </Typography.Paragraph>

                <Typography.Paragraph>
                  Para confirmar que deseas borrar toda la configuración de la subasta, escribe la siguiente palabra:
                  <Typography.Text strong type='danger'>
                    {` ${auction?.name ?? ''}`}
                  </Typography.Text>
                </Typography.Paragraph>
              </Space>
            }
          />
        </Modal>
        {isAnonymously ? (
          <Result
            status='warning'
            title={'Los eventos con "registro sin autenticación" no son válidos para una subasta'}
          />
        ) : 
          <>
            <Row justify='end' gutter={[8, 8]} style={{ paddingBottom: 10 }}>
              <Col>
                <Button type='primary' disabled={isAnonymously} icon={<SaveOutlined />} htmlType='submit'>
                  Guardar
                </Button>
              </Col>
              {active && (
                <Col>
                  <Button icon={<DeleteOutlined />} danger type='primary' onClick={() => setModal(true)}>
                    Eliminar
                  </Button>
                </Col>
              )}
              
            </Row>
            <Row justify='center' gutter={[16, 16]}>
              <Col span={16}>
                <Card hoverable style={{ height: '100%', borderRadius: 20 }}>
                  <Space direction='vertical' style={{ width: '100%' }}>
                    {/* <Typography.Text strong style={{ fontSize: 16 }}>
                      Configuración general de la subasta
                    </Typography.Text> */}

                    <Form.Item
                      name={'name'}
                      label={'Nombre de la subasta'}
                      rules={[{ required: true, message: 'Debe configurar un nombre para la subasta' }]}
                      initialValue={auction?.name ?? ''}>
                      <Input prefix={<TagOutlined style={{ /* fontSize: 20, */ color: 'rgba(0, 0, 0, 0.45)' }} />} />
                    </Form.Item>
                    <Form.Item
                      name={'currency'}
                      label={'Moneda para la subasta'}
                      rules={[{ required: true, message: 'Debe configurar una moneda para la subasta' }]}
                      help={
                        <Typography.Text type='secondary'>
                          <InfoCircleOutlined /> Esta sera la moneda de cobro durante la subasta
                        </Typography.Text>
                      }
                      initialValue={auction?.currency ?? 'COP'}>
                      <Select>
                        <Select.Option value={'COP'}>COP</Select.Option>
                        <Select.Option value={'USD'}>USD</Select.Option>
                      </Select>
                    </Form.Item>
                    
                    {auction &&
                      <Form.Item label={'Reglamento de la subasta'}  initialValue={auction.rules  ?? ''} name={'rules'}>
                        <TextArea showCount autoSize={{minRows: 5, maxRows: 6}} maxLength={500} placeholder='Escriba el reglamento para la subasta'/>
                      </Form.Item>
                    }
                  </Space>
                </Card>
              </Col>

              {auction && (
                <Col span={8}>
                  <Card hoverable style={{ height: '100%',  borderRadius: 20 }}>
                    <Form.Item label={'Publicar la subasta en landing'}>
                      <Switch
                        loading={loading}
                        disabled={auction?.opened}
                        style={{ marginLeft: 10 }}
                        checked={auction?.published}
                        checkedChildren='Si'
                        unCheckedChildren='No'
                        onChange={(value) => onChange(value, 'published')}
                      />
                    </Form.Item>
                    <Form.Item label={'Abrir la subasta en landing'}>
                      <Switch
                        loading={loading}
                        disabled={!auction?.published}
                        style={{ marginLeft: 10 }}
                        checked={auction?.opened}
                        checkedChildren='Si'
                        unCheckedChildren='No'
                        onChange={(value) => onChange(value, 'opened')}
                      />
                    </Form.Item>
                    <Divider />
                    <Form.Item label={'Tiempo de espera entre pujas'} initialValue={auction.timerBids ?? 10} name={'timerBids'}>
                      <Select>
                        <Select.Option value={10}>10 SEGUNDOS</Select.Option>
                        <Select.Option value={15}>15 SEGUNDOS</Select.Option>
                        <Select.Option value={20}>20 SEGUNDOS</Select.Option>
                        <Select.Option value={25}>25 SEGUNDOS</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label={'Monto entre pujas'}
                      name={'amount'}
                      initialValue={auction.amount}
                      help={
                        <Typography.Text type='secondary'>
                          <InfoCircleOutlined /> Si este campo esta vacio entonces la puja sera libre para el usuario
                        </Typography.Text>
                      }>
                        <InputNumber
                          style={{ width: '100%' }}
                          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                    </Form.Item>
                  </Card>
                </Col>
              )}
              {/* <Col span={12}>
                {auction && (
                  <Col span={24}>
                    <Card hoverable style={{ borderRadius: 20 }}>
                      <Form.Item label={'Tiempo de espera entre pujas'} initialValue={auction.timerBids ?? 10} name={'timerBids'}>
                        <Select>
                            <Select.Option value={10}>10 SEGUNDOS</Select.Option>
                            <Select.Option value={15}>15 SEGUNDOS</Select.Option>
                            <Select.Option value={20}>20 SEGUNDOS</Select.Option>
                            <Select.Option value={25}>25 SEGUNDOS</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label={'Monto entre pujas'}
                      name={'amount'}
                      initialValue={auction.amount}
                      help={
                        <Typography.Text type='secondary'>
                              <InfoCircleOutlined /> Si este campo esta vacio entonces la puja sera libre para el usuario
                            </Typography.Text>}>
                        <InputNumber
                          style={{ width: '100%' }}
                          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                      </Form.Item>
                    </Card>
                  </Col>
                )}
              </Col>
              <Col span={12}>
                {auction && (
                  <Col span={24}>
                    <Card hoverable style={{ borderRadius: 20 }}>
                      <Form.Item label={'Reglamento de la subasta'}  initialValue={auction.rules  ?? ''} name={'rules'}>
                        <TextArea showCount rows={6} maxLength={500} placeholder='Escriba el reglamento para la subasta'/>
                      </Form.Item>
                    </Card>
                  </Col>
                )}
              </Col> */}
            </Row>
          </>
        }
      </Form>
    </>
  );
}
