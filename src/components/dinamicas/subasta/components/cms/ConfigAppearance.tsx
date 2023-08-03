import React, { useState } from 'react';
import { Card, Col, Row, Tabs, Grid, Empty, Typography, Statistic, Tooltip, Result, Button, Space } from 'antd';
import { AuctionExample, TabsDrawerAuction } from '../../utils/utils';
import { CommentOutlined, FileProtectOutlined, VideoCameraOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
const { useBreakpoint } = Grid;

export default function ConfigAppearance() {
  return (
    <Row gutter={[16, 8]} style={{ padding: 10 }}>
      <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10} style={{ height: '100%' }}>
        <Row gutter={[0, 8]}style={{ paddingRight: 10}}>
          <Col span={24} style={{ paddingBottom: 10, paddingLeft: 10}}>
          <Tooltip title="Transmicion o video">
            <Card
              className='products'
              style={{
                backgroundColor: 'transparent',
                height: 270,
                width: '100%',
                borderRadius: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              bordered={true}
              bodyStyle={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
            <Result
            subTitle="Seccion de transmicion o video" 
            icon={  <VideoCameraOutlined style={{ fontSize: 50 }} />}
            />
            </Card>
            </Tooltip>
          </Col>
          <Col span={24} style={{ paddingBottom: 10, paddingLeft: 10}} >
          <Tooltip title="Seccion de pujas e historial de articulos">
            <Card
              className='products'
              style={{ borderRadius: '20px' }}
              hoverable
              bordered={true}
              bodyStyle={{ padding: '0px 20px' }}>
              <Tabs defaultActiveKey={TabsDrawerAuction.Bids} draggable style={{ width: '100%' }}>
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
      <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
        <Row gutter={[0, 8]}>
          <Col span={24}>
          <Tooltip title="xd">
            <Card
             className='products'
              hoverable={true}
              style={{ height: 550, borderRadius: 20 }}
              headStyle={{ textAlign: 'center' }}
              cover={
                <img
                  className='animate__animated animate__flipInX'
                  alt='imagen del producto'
                  src={AuctionExample.currentProduct?.images[0].url ?? ''}
                  style={{
                    height: '410px',
                    objectFit: 'fill',
                    backgroundColor: '#C4C4C440',
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
      <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
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
      </Col>
    </Row>
  );
}
