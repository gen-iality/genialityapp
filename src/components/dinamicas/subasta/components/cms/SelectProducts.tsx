import { Card, Col, Result, Row, Typography } from 'antd';
import React, { useState } from 'react';
import { ProductsProps } from '../../interfaces/auction.interface';
import { AntCloudOutlined } from '@ant-design/icons';

export default function SelectProducts({ products, onclick }: Omit<ProductsProps, 'onDelete'>) {
  const [selected, setselected] = useState('')
  return (
    <Card style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Row justify='start' /* style={{ display: 'flex', height: 330, overflowY: 'auto' }} */>
        {products?.length > 0 ? (
          products?.map((product) => (
            <Col /* style={{ height: 340 ,border:  selected === product._id ? '3px solid #4A5052' : '3px solid transparent', }} */ key={product._id}>
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
                style={{ margin: 10, width: 200, aspectRatio: 'relative', height: 310, borderRadius: 20 }}
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
