import { useState } from 'react';
import { EventsApi } from '@helpers/request';
import withContext from '@context/withContext';
import { useHistory } from 'react-router-dom';
import { Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import ProductCard from './productCard';

const ProductList = (props) => {
  const [products, setProducts] = useState([]);
  let history = useHistory();

  useEffect(() => {
    obtenerGaleria();
  }, []);

  const obtenerGaleria = () => {
    EventsApi.getProducts(props.cEvent.value._id).then((resp) => {
      if (resp && resp.data) {
        let listporductOrder = resp.data.sort((a, b) => a?.position - b?.position);
        setProducts(listporductOrder);
      }
    });
  };
  return (
    <Row gutter={[16, 16]} style={{ padding: '20px' }}>
      {/*<Card style={{textAlign:'center', marginLeft:30,marginRight:30,marginTop:60}}>
            <IssuesCloseOutlined  style={{marginRight:20, fontSize:20}} />La subasta se ha cerrado
         </Card>*/}
      {products.length > 0 ? (
        <>
          {products.map((galery) => (
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8} key={galery.id}>
              <ProductCard history={history} eventId={props.cEvent.value._id} galery={galery} />
            </Col>
          ))}
        </>
      ) : (
        <Card style={{ width: '100%', textAlign: 'center', marginRight: 60, marginLeft: 60, marginTop: 50 }}>
          Aún no existen artículos en la galería
        </Card>
      )}
    </Row>
  );
};

export default withContext(ProductList);
