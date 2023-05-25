import { Badge, Card, Space, Statistic, Typography } from 'antd';

const ProductCard = ({ product, eventId, history }) => {
  const calculateDiscountedPrice = () => {
    if (product.discount > 0) {
      const discountedPrice = product.price - (product.price * product.discount) / 100;
      return discountedPrice;
    }
    return product.price;
  };
  const discountedPrice = calculateDiscountedPrice();
  console.log(product, 'product');

  return (
    <Badge.Ribbon text={product?.discount ? product?.discount + '%' : ''} color={product?.discount ? 'red': 'transparent'}>
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
        bodyStyle={{ padding: '10px', minHeight: '120px', width: '100%' }}
        key={product?.type + product?.id}
        onClick={() => history.push(`/landing/${eventId}/producto/${product._id}/detailsproducts`)}
        cover={
          <img
            src={product && product.images && product.images[0]}
            style={{ height: '250px', objectFit: 'contain', backgroundColor: '#C4C4C440' }}
          />
        }>
        <Card.Meta
          description={
            <Space direction='vertical'>
              <Typography.Text strong style={{width: '280px'}} ellipsis={{ rows: 2 }}>
                {product.name}
              </Typography.Text>
              {product && (
                <Space direction='vertical'>
                  {product?.by && (
                    <Typography.Text type='secondary' /* italic */>
                      {product?.by}
                    </Typography.Text>
                  )}
                  {/* {discountedPrice && <Typography.Text type='success'> $ {discountedPrice}</Typography.Text>} */}
                  { product.discount ?
                    <Statistic
                      title={<Typography.Text delete>$ {product.price}</Typography.Text>}
                      value={discountedPrice}
                      valueStyle={{ color: '#52c41a' }}
                      prefix='$'
                    />
                    : product.price && 
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
