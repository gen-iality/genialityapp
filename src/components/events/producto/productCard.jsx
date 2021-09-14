import { Card, Space, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';

const ProductCard = ({ galery, eventId, history }) => {
  const { Title } = Typography;
  return (
    <Card
      actions={[
        <div style={{ fontWeight: 'bold', fontSize: '18px' }} onClick={null} key={'act-' + galery.id}>
          {(galery?.currency && galery?.currency) +" $ "+( galery.start_price || galery.price) }
        </div>,
      ]}
      bordered={false}
      bodyStyle={{ padding: '10px 10px', minHeight: '120px' }}
      key={'Cardgallery' + galery.id}
      style={{ width: '100%', cursor: 'pointer' }}
      onClick={() => history.push(`/landing/${eventId}/producto/${galery._id}/detailsproducts`)}
      cover={<img alt='example' src={galery && galery.image && galery.image[0]} />}>
      <Meta
        description={
          <Space direction='vertical'>
            <Title level={5} ellipsis={{ rows: 2 }}>
              {galery.name}
            </Title>
            <div>
              <span style={{ fontWeight: 'bold' }}>by:&nbsp;</span>
              {galery && galery.by ? galery.by : 'Sin artista'}
            </div>
          </Space>
        }
      />
    </Card>
  );
};

export default ProductCard;
