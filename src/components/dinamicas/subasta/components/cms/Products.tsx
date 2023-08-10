import { Card, Col, Popconfirm, Result, Row, Typography } from 'antd';
import React from 'react';
import { ProductsProps } from '../../interfaces/auction.interface';
import { AntCloudOutlined, DeleteOutlined } from '@ant-design/icons';

export default function Products({ products, onclick, onDelete }: ProductsProps) {
  return (
    <>
      <Row wrap gutter={[16, 16]} style={{ padding: 10}}>
        {products?.length > 0 ? (
          products?.map((product) => (
            <Col xs={24} sm={24} md={12} lg={8} xl={7} xxl={8} key={product._id}>
              <Card
                className='products'
                key={product._id + 'card'}
                bordered={true}
                style={{ width: 300, aspectRatio: 'relative', height: 310, borderRadius: 20}}
                cover={
                  <img
                    alt='imagen del producto'
                    src={product.images[0].url}
                    style={{ height: '250px', objectFit: 'fill', backgroundColor: '#C4C4C440', borderRadius: '20px 20px 0 0px' }}
                    onClick={() => onclick(product)}
                  />
                }>
                  <Card.Meta 
                    title={
                      <Row justify={'space-between'}>
                        <Typography.Text strong>{product.name}</Typography.Text>
                          <Popconfirm
                            placement='top'
                            title={'¿Está seguro de eliminar la información?'}
                            onConfirm={() => onDelete(product._id, product.images)}
                            okText='Yes'
                            cancelText='No'>
                            <DeleteOutlined key={'delete'} style={{color: 'red'}}/>
                          </Popconfirm>
                      </Row>
                    }
                  />
                </Card>
            </Col>
          ))
        ) : (
          <Result status='info' icon={<AntCloudOutlined />} title='No hay productos creados.' />
        )}
      </Row>
    </>
  );
}
