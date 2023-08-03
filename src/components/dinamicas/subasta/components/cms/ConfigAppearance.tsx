import React, { useState } from 'react';
import { Card, Col, Row, Tabs, Grid, Empty, Typography, Statistic, Tooltip, Result, Button, Space, Modal } from 'antd';
import { AuctionExample, TabsDrawerAuction } from '../../utils/utils';
import { CommentOutlined, FileProtectOutlined, VideoCameraOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { AuctionStyles, ConfigStyleProps, ModalConfig } from '../../interfaces/auction.interface';
import { saveAuctioFirebase } from '../../services/Execute.service';
import ModalStyles from './ModalStyles';


export default function ConfigAppearance({auction, eventId} : ConfigStyleProps) {
  const [configModal, setconfigModal] = useState<ModalConfig>({
    visible: false,
    type: 'general'
  })
  const onOk = async (type: keyof AuctionStyles,data: any) => {
    await saveAuctioFirebase(eventId || '', { ...auction, styles: { ...auction.styles, [type]: { ...data} } });
  }
  const openModal = (type : keyof AuctionStyles) => {
    setconfigModal({ type, visible: true })
  }
  return (
    <Space className='container'>
      <Modal
      visible={configModal.visible}
      closable={true}
      onCancel={()=>setconfigModal({ ...configModal, visible: false })}
      onOk={()=>setconfigModal({ ...configModal, visible: false })}
      destroyOnClose      
      >
        <ModalStyles key={'ModalConfigAuctionStyles'} styles={auction.styles} type={configModal.type}  onOk={onOk} />
      </Modal>
      <Button type='primary' className='btnBackground' onClick={()=>{openModal('general')}}>Cambiar fondo</Button>
      <Row gutter={[16, 8]} className='cardLanding' style={{ background: auction.styles ? auction.styles.general?.backgroundColor : ''}}>
      <Col  style={{ height: '100%', width: 500 }}>
        <Row gutter={[0, 8]}style={{ paddingRight: 10, width: '100%'}}>
          <Col span={24} >
          <Tooltip title="Transmicion o video">
            <Card
              className='cardsConfigStyle'
              style={{
                backgroundColor: 'transparent',
                height: 250,
                width: '100%',
                borderRadius: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              bordered={true}>
            <Result
            subTitle="Seccion de transmicion o video" 
            icon={  <VideoCameraOutlined style={{ fontSize: 50 }} />}
            />
            </Card>
            </Tooltip>
          </Col>
          <Col span={24}  >
          <Tooltip title="Seccion de pujas e historial de articulos">
            <Card
              className='cardsConfigStyle'
              style={{ borderRadius: '20px', height: 230, width: '100%' }}
              bordered={true}
              bodyStyle={{ padding: '0px 20px' }}>
              <Tabs defaultActiveKey={TabsDrawerAuction.Bids} draggable style={{ width: '100%', height: 300 }}>
                <Tabs.TabPane key={TabsDrawerAuction.Bids} tab='Pujas'>
                  <Row justify='center'>
                    <Col span={24}>
                      <Empty
                        style={{ height: '250px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
                        description={'Sin puja'}
                      />
                    </Col>
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane key={TabsDrawerAuction.History} tab='Historial de artículos' closable>
                  <Row>
                    <Col span={24}>
                      <Empty
                        style={{ height: '250px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
                        description={'Sin artículos'}
                      />
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </Card>
            </Tooltip>
          </Col>
        </Row>
      </Col>
      <Col >
        <Row gutter={[0, 8]}>
          <Col span={24}>
          <Tooltip title="Visualización de productos">
            <Card
             className='cardsConfigStyle'
              style={{ height: 350, borderRadius: 20, width: 250 }}
              headStyle={{ textAlign: 'center' }}
              cover={
                <img
                  className='animate__animated animate__flipInX'
                  alt='imagen del producto'
                  src={AuctionExample.currentProduct?.images[0].url ?? ''}
                  style={{
                    height: '210px',
                    objectFit: 'cover',
                    borderRadius: '20px 20px 0 0px',
                  }}
                />
              }>
              <Meta
                title={
                  <Typography.Text strong>
                    {AuctionExample?.currentProduct ? AuctionExample?.currentProduct.name : 'Sin producto asignado'}
                  </Typography.Text>
                }
                description={
                  <Statistic
                    title='Valor del artículo'
                    className='animate__animated animate__flipInX'
                    prefix='$'
                    value={AuctionExample?.currentProduct?.price || 0}
                    suffix={AuctionExample?.currency}
                  />
                }
              />
            </Card>
            </Tooltip>
          </Col>
        </Row>
      </Col>
      <Col style={{ width: 200}}>
      <Tooltip title="Botones de accion">
        <Card bordered={false} style={{ height: '100%', backgroundColor: 'transparent' }}>
    <Row gutter={[16, 16]}>
        <Col span={24}>
            <Row justify='center'>
                <Button
                    className={'animate__animated animate__heartBeat'}
                    shape='circle'
                    style={{
                        width: '150px',
                        height: '150px',
                        border: `10px solid #CECECE`,
                        boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)',
                    }}
                    type='default'>
                    <Space direction='vertical'>
                        <Typography.Text strong={true}>¡PUJAR!</Typography.Text>
                    </Space>
                </Button>
            </Row>
        </Col>
        <Col span={24}>
            <Button
                style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
                icon={<FileProtectOutlined />}
                size='large'
                block>
                Reglas
            </Button>
        </Col>
        <Col span={24}>
            <Button
                style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
                icon={<CommentOutlined />}
                size='large'
                block>
                Chat
            </Button>
        </Col>
        <Col span={24}>
            <Button
                style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
                size='large'
                block>
                Cerrar
            </Button>
        </Col>
    </Row>
        </Card>
        </Tooltip>
      </Col>
    </Row>
    </Space>
  );
}
