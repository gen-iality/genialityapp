import { Card } from 'antd';
import React from 'react';

const OfertaProduct = ({ product, eventId }) => {
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
      <strong>Precio: </strong> {product && product.price}
      {valuesPuja.map((val,index)=><Card key={'val'+index}>{val.name}</Card>
      )}
    </Card>
  );
};

export default OfertaProduct;
