import { Badge, Card, Space, Typography } from 'antd';

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
        bordered={false}
        hoverable
        bodyStyle={{ padding: '10px', minHeight: '120px', width: '100%' }}
        key={'Cardgallery' + product.id}
        style={{ width: '100%', cursor: 'pointer', height: '100%' }}
        onClick={() => history.push(`/landing/${eventId}/producto/${product._id}/detailsproducts`)}
        cover={
          <img
            alt='example'
            src={product && product.images && product.images[0]}
            style={{ height: '250px', objectFit: 'cover' }}
          />
        }>
        <Card.Meta
          description={
            <Space direction='vertical'>
              <Typography.Title level={5} ellipsis={{ rows: 2 }}>
                {product.name}
              </Typography.Title>
              {product && (
                <Space direction='vertical'>
                  {product?.by && (
                    <Typography.Text type='secondary' italic>
                      {product?.by}
                    </Typography.Text>
                  )}
                  {discountedPrice && <Typography.Text type='success'> $ {discountedPrice}</Typography.Text>}
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
