import { Badge, Card, Col, Empty, List, Result, Row, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import { ProductsProps } from '../../interfaces/auction.interface';
import { AntCloudOutlined } from '@ant-design/icons';

export default function SelectProducts({ products, onclick }: Omit<ProductsProps, 'onDelete'>) {
  const [selected, setselected] = useState('')
  return (
    <Card style={{ height: 400, overflowY: 'auto' }} className='desplazar'>
      {products?.length > 0 ? 
        <List
          grid={{
            gutter: 20,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 4,
            xl: 5,
            xxl: 5,
          }}
          style={{ width: '100%', padding: 0 }}
          dataSource={products}
          renderItem={(product) => (
            <List.Item style={{border: selected === product._id ? '2px solid #4A5052' : 'transparent', borderRadius: 5}} key={product._id}>
              <Badge.Ribbon
                text={product?.state === 'auctioned' ? product?.state : ''}
                color={product?.state === 'auctioned' ? 'red' : 'transparent'}
              >
                <Card
                  bordered={selected === product._id}
                  onClick={() => {
                    if(product.state !== 'auctioned'){
                      setselected(product._id)
                      onclick(product)
                    }
                  }}
                  hoverable={product.state !== 'auctioned'}
                  /* className={product.state === 'auctioned' ? '' : 'products'} */
                  key={product._id + 'card'}
                  style={{ 
                    width: '100%', /* borderRadius: 10, */ backgroundColor: '#C4C4C420', 
                    /* border: selected === product._id ? '2px solid #4A5052' : 'transparent' */
                  }}
                  cover={
                    product && product.images && product.images.length > 0 ? (
                      <img
                        alt='imagen del producto'
                        src={product.images[0].url}
                        style={{ height: '150px', objectFit: 'fill', backgroundColor: '#C4C4C440'}}
                      />
                    ) : (
                      <Empty
                        style={{ height: '150px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
                        description={'Sin imagen'}
                      />
                    )
                  }>
                  <Card.Meta
                    title={
                      <Tooltip title={product.name} placement='bottomLeft'>
                        <Typography.Text strong>{product.name}</Typography.Text>
                      </Tooltip>
                    }
                  />
                </Card>
              </Badge.Ribbon>
            </List.Item>
          )}
        />
        :
        <Row justify='center' align='middle' style={{width: '100%'}}>
          <Result status='info' /* icon={<AntCloudOutlined />} */ title='No hay productos creados.' />
        </Row>
      }
    </Card>
  );
}
