import { Badge, Card, Col, Empty, List, Popconfirm, Result, Row, Space, Tag, Tooltip, Typography } from 'antd';
import React from 'react';
import { ProductsProps } from '../../interfaces/auction.interface';
import { AntCloudOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

export default function Products({ products, onclick, onDelete }: ProductsProps) {
  return (
    <>
      {products?.length > 0 ?
        <List
          grid={{
            gutter: 20,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 5,
            xl: 6,
            xxl: 6,
          }}
          style={{ padding: 20 }}
          dataSource={products}
          renderItem={(product) => (
            <List.Item style={{ height: '100%' }} key={product._id}>
              <Badge.Ribbon
                text={product?.state === 'auctioned' ? product?.state : ''}
                color={product?.state === 'auctioned' ? 'red' : 'transparent'}
              >
                <Card
                  hoverable
                  className={product.state === 'auctioned' ? '' : 'products'}
                  key={product._id + 'card'}
                  style={{ width: '100%', cursor: 'auto', borderRadius: 10, backgroundColor: '#C4C4C420' }}
                  actions={[
                    product.state !== 'auctioned' && <EditOutlined onClick={() => onclick(product)} />,
                    <Popconfirm
                      placement='top'
                      title={'¿Está seguro de eliminar el producto?'}
                      onConfirm={() => onDelete(product._id, product.images)}
                      okText='Sí'
                      cancelText='No'>
                      <DeleteOutlined key={'delete'} style={{color: 'red'}}/>
                    </Popconfirm>
                  ]}
                  cover={
                    product && product.images && product.images.length > 0 ? (
                      <img
                        alt='imagen del producto'
                        src={product.images[0].url}
                        style={{ height: '200px', objectFit: 'fill', backgroundColor: '#C4C4C440' }}
                      />
                    ) : (
                      <Empty
                        style={{ height: '200px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
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
        /> :
        <Row justify='center' align='middle' style={{width: '100%'}}>
          <Result status='info' /* icon={<AntCloudOutlined />} */ title='No hay productos creados.' />
        </Row>
      }
    </>
  );
}
