import { Button, Card, Space, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';

const ProductCard = ({ galery, eventId, history }) => {
  console.log('PRODUCT==>', galery);
  const { Title, Text } = Typography;
  return (
    <Card
      actions={[
        <div style={{ fontWeight: 'bold', fontSize: '18px' }} onClick={null} key={'act-' + galery.id}>
          {galery.price}
        </div>,
      ]}
      bordered={false}
      //  bodyStyle={{padding:'15px'}}
      bodyStyle={{ padding: '10px 10px',  minHeight:'120px' }}
      key={'Cardgallery' + galery.id}
      style={{ width: '100%', cursor: 'pointer', }}
      onClick={() => history.push(`/landing/${eventId}/producto/${galery._id}/detailsproducts`)}
      cover={<img alt='example' src={galery && galery.image && galery.image[0]} />}
      //  extra={<div onClick={null}key={'act-'+galery.id}>$ {galery.price}</div>}
      //  title={galery.name}
      //  actions={[
      //    <div onClick={()=>this.props.cUser.value?this.pujar(galery):this.setState({isModalVisibleRegister:true})}  key={'act2-'+galery.id} ><SettingOutlined key='setting' /> Pujar</div>
      //  ]}
    >
      <Meta
        
        description={
          <Space direction='vertical'>
            <Title level={5} ellipsis={{ rows: 3}}>
            {galery.name}
          </Title>
            <div>
              <span style={{ fontWeight: 'bold' }}>by:&nbsp;</span>
              {galery && galery.by ? galery.by : 'Sin artista'}
            </div>

            {/* <Button  type="primary" block onClick={()=>history.push(`/landing/${eventId}/producto/${galery._id}/detailsproducts`)}  key={'act2-'+galery.id}>
         Comprar
       </Button> */}
          </Space>
        }
      />
    </Card>
  );
};

export default ProductCard;
