import { Card, Col, Row, Tag } from 'antd';
import React from 'react';
import { useState } from 'react';

const OfertaProduct = ({ product, eventId }) => {
const [selectedValue,setSelectedValue]=useState(50000)
  const valuesPuja = [
    {
      name: '10.000',
      value: 10000,
    },
    {
      name: '50.000',
      value: 50000,
    },
    {
      name: '100.000',
      value: 100000,
    },
    {
      name: '500.000',
      value: 500000,
    },
  ];
  return (
    <Card>
    <Row>
      <Col xs={24} md={24}  xl={10} lg={10}><strong>Precio: </strong> 
      {product && product.price}</Col>
      <Col xs={24} md={24} xl={14} lg={14}>
      {valuesPuja.map((val,index)=><Tag color={selectedValue===val.value?'#2db7f5':''} onClick={()=>setSelectedValue(val.value)} key={'val'+index}>{val.name}</Tag>
      )}
      </Col>
      </Row>
    </Card>
  );
};

export default OfertaProduct;
