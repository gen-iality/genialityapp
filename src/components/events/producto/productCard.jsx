import { Card, Space, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
const ProductCard = ({ galery, eventId, history }) => {
  const { Title } = Typography;
  const calculateDiscountedPrice = () => {
    if (galery.discount > 0) {
      const discountedPrice = galery.price - (galery.price * galery.discount) / 100;
      return discountedPrice;
    }
    return galery.price;
  };
  const discountedPrice = calculateDiscountedPrice();
  return (
    <Card
      /* actions={[
        galery?.currency && galery?.currency && (
          <div style={{ fontWeight: 'bold', fontSize: '18px' }} onClick={null} key={'act-' + galery.id}>
            {(galery?.currency && galery?.currency) +
              ' $ ' +
              (galery.start_price?.toLocaleString('es-CO') || galery.price?.toLocaleString('es-CO'))}
          </div>
        ),
      ]} */
      bordered={false}
      bodyStyle={{ padding: '10px', minHeight: '120px', width: '100%' }}
      key={'Cardgallery' + galery.id}
      style={{ width: '100%', cursor: 'pointer' }}
      onClick={() => history.push(`/landing/${eventId}/producto/${galery._id}/detailsproducts`)}
      cover={
        <img
          alt='example'
          src={galery && galery.images && galery.images[0]}
          style={{ height: '250px', objectFit: 'cover' }}
        />
      }>
      <Meta
        description={
          <Space direction='vertical'>
            <Title level={5} ellipsis={{ rows: 2 }}>
              {galery.name}
            </Title>
            {galery && (
              <Space direction='vertical'>
                {galery?.by && (
                  <Typography.Text type='secondary' italic>
                    {galery?.by}
                  </Typography.Text>
                )}
                {discountedPrice && <Typography.Text type='success'> $ {discountedPrice}</Typography.Text>}
              </Space>
            )}
          </Space>
        }
      />
    </Card>
  );
};

export default ProductCard;
