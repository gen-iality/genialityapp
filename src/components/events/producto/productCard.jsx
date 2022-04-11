import { Card, Space, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
const ProductCard = ({ galery, eventId, history }) => {
  const { Title } = Typography;
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
          src={galery && galery.image && galery.image[0]}
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
                {galery?.price && <Typography.Text type='success'> $ {galery?.price}</Typography.Text>}
              </Space>
            )}
          </Space>
        }
      />
    </Card>
  );
};

export default ProductCard;
