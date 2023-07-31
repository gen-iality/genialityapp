import { Card, Col, Popconfirm, Result, Row, Typography } from 'antd';
import React from 'react';
import { ProductsProps } from '../../interfaces/auction.interface';
import { AntCloudOutlined, DeleteOutlined } from '@ant-design/icons';

export default function Products({ products, onclick, onDelete }: ProductsProps) {
  return (
    <Card style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Row justify='start' style={{ display: 'flex', height: 600, overflowY: 'auto' }}>
        {products?.length > 0 ? (
          products?.map((product) => (
            <Col style={{ margin: 10 }} key={product._id}>
              <Card
                title={
                  <Row justify={'space-between'}>
                    <Typography.Title level={5}>{product.name}</Typography.Title>
                      <Popconfirm
                        placement='top'
                        title={'¿Está seguro de eliminar la información?'}
                        onConfirm={() => onDelete(product._id, product.images)}
                        okText='Yes'
                        cancelText='No'>
                        <DeleteOutlined key={'delete'} />
                      </Popconfirm>
                  </Row>
                }
                key={product._id + 'card'}
                bordered={true}
                hoverable
                onMouseEnter={() => {}}
                style={{  margin: 10, width: 300, aspectRatio: 'relative', height: 251}}
                cover={
                  <div
                    onClick={() => onclick(product)}
                    style={{
                      width:  300,
                      height:  185,
                      backgroundImage: `url(${product.images[0].url})`,
                      backgroundSize: 'cover',
                    }}></div>
                }></Card>
            </Col>
          ))
        ) : (
          <Result status='info' icon={<AntCloudOutlined />} title='No hay productos creados.' />
        )}
      </Row>
    </Card>
  );
}
