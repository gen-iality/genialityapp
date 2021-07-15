import React from 'react';
import { Row, Col } from 'antd';

function products(props) {
  return (
    <>
      <div className='product-company'>
        <Row gutter={[16, 16]} className='row'>
          <Col xs={24} sm={24} md={24} lg={6} xl={6} className='product-img'>
            <div className='cuadro-producto'>
              <img
                className='producto'
                src={
                  props.imgProduct === '' ? 'https://via.placeholder.com/200/50D3C9/FFFFFF?text=Item' : props.imgProduct
                }
              />
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={18} xl={18}>
            <div className='producto-informacion'>
              <span className='title'>{props.title} </span>
              <span className='etiqueta'>{props.etiqueta} </span>
              <p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: props.description && props.description,
                  }}></div>
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
export default products;
