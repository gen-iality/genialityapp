import { Badge, Card, Empty, Space, Statistic, Typography } from 'antd';
import React from 'react';
import { ProductCardProps } from '../interfaces/productsLanding';

const ProductCard: React.FC<ProductCardProps> = ({ product, eventId, history }) => {
  const calculateDiscountedPrice = (): number => {
    const discountedPrice = product.discount > 0 ? product.price - (product.price * product.discount) / 100 : product.price;
    return discountedPrice;
  };
  const discountedPrice = calculateDiscountedPrice();  

  return (
    <Badge.Ribbon text={product?.discount ? '-' + product?.discount + '%' : ''} color={product?.discount ? 'red': 'transparent'}>
      <Card
      /* actions={[
        product?.currency && product?.currency && (
          <div style={{ fontWeight: 'bold', fontSize: '18px' }} onClick={null} key={'act-' + product.id}>
            {(product?.currency && product?.currency) +
              ' $ ' +
              (product.start_price?.toLocaleString('es-CO') || product.price?.toLocaleString('es-CO'))}
          </div>
        ),
      ]} */
        /* bordered={false} */
        hoverable
        style={{ width: '100%', cursor: 'pointer', borderRadius: 10 }}
        bodyStyle={{ /* padding: '10px', */width: '100%', height: '160px'}}
        key={product?.type + product?._id}
        onClick={() => history.push(`/landing/${eventId}/producto/${product._id}/detailsproducts`)}
        cover={
          product && product.images && product.images[0] ?
          <img alt='imagen del producto'
            src={product && product.images && product.images[0]}
            style={{ height: '250px', objectFit: 'fill', backgroundColor: '#C4C4C440' }}
          /> : 
          <Empty style={{height: '250px', display: 'grid', justifyContent: 'center', alignItems: 'center' }} description={'Sin imagen'} />
        }>
        <Card.Meta
          description={
            <Space direction='vertical'>
              <Typography.Title level={5} ellipsis={{ rows: 2 }}>
                {product.name}
              </Typography.Title>
              {product && (
                <Space direction='vertical'>
                  {/* {product?.by && (
                    <Typography.Text type='secondary'>
                      {product?.by}
                    </Typography.Text>
                  )} */}
                  {/* {discountedPrice && <Typography.Text type='success'> $ {discountedPrice}</Typography.Text>} */}
                  { product.discount ?
                    <Statistic
                      title={<Typography.Text delete>$ {new Intl.NumberFormat().format(product.price)}</Typography.Text>}
                      value={discountedPrice}
                      valueStyle={{ color: '#52c41a' }}
                      prefix='$'
                    />
                    :
                      <Statistic
                        title={<Typography.Text style={{color: 'transparent'}}>Valor del producto</Typography.Text>}
                        value={product.price}
                        valueStyle={{ color: '#52c41a' }}
                        prefix='$'
                      />
                  }
                </Space>
              )}
            </Space>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default ProductCard;
