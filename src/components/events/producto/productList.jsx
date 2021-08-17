import React, { useState } from 'react';
import { EventsApi } from '../../../helpers/request';
import withContext from '../../../Context/withContext';
import { useHistory } from 'react-router-dom';
import { Card, Row } from 'antd';
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
        setProducts(resp.data);
      }
    });
  };
  return (
    <>
      {/*<Card style={{textAlign:'center', marginLeft:30,marginRight:30,marginTop:60}}>
            <IssuesCloseOutlined  style={{marginRight:20, fontSize:20}} />La subasta se ha cerrado
         </Card>*/}     
      {products.length > 0 && (
        <Row className='site-card-border-less-wrapper' style={{ width: '75vw', margin: 'auto' }}>
          {products.length > 0 && (
            <Row key={'container'}>
              {products.map((galery) => (
                <ProductCard history={history} eventId={props.cEvent.value._id} key={galery.id} galery={galery} />
              ))}
            </Row>
          )}
        </Row>
      )}
      {products.length == 0 && (
        <Row >
          <Card style={{width:'100%',textAlign:'center',marginRight:60,marginLeft:60,marginTop:50}} >Aún no existen artículos en la galería</Card>
        </Row>
      )}
    </>
  );
};

export default withContext(ProductList);
