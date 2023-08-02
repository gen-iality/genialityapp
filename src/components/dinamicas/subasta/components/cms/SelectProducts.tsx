import { Card, Col, Result, Row, Typography } from 'antd';
import React, { useState } from 'react';
import { ProductsProps } from '../../interfaces/auction.interface';
import { AntCloudOutlined } from '@ant-design/icons';

export default function SelectProducts({ products, onclick }: Omit<ProductsProps, 'onDelete'>) {
  const [selected, setselected] = useState('')
  return (
    <Card style={{ height: 350, overflowY: 'auto' }} className='desplazar'>
      <Row justify='start' gutter={[16, 16]} wrap>
        {products?.length > 0 ? (
          products?.map((product) => (
            <Col xs={24} sm={24} md={6} lg={8} xl={8} xxl={8}  /* style={{ height: 340 ,border:  selected === product._id ? '3px solid #4A5052' : '3px solid transparent', }} */ key={product._id}>
              <Card
               onClick={() =>{
                 if(product.state !== 'auctioned'){
                  setselected(product._id)
                  onclick(product)
                 }
                }}
                key={product._id + 'card'}
                bordered={true}
                hoverable
                onMouseEnter={() => {}}
                style={{ aspectRatio: 'relative', height: 310, borderRadius: 20 }}
                cover={
                  <img
                    alt='imagen del producto'
                    src={product.images[0].url}
                    style={{ height: '250px', objectFit: 'fill', backgroundColor: '#C4C4C440', borderRadius: '20px 20px 0 0px', filter: product.state === 'auctioned' ? 'grayscale(100%)' : '' }}
                    onClick={() => onclick(product)}
                  />
                }>
                  <Card.Meta 
                    title={<Typography.Text strong>{product.name}</Typography.Text>}
                  />
                </Card>
            </Col>
          ))
        ) : (
          <Result status='info' icon={<AntCloudOutlined />} title='No hay productos creados.' />
        )}
      </Row>
    </Card>
  );
}
