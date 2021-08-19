import { Card, Col, Row, Tag, Input, Button } from 'antd';
import React from 'react';
import { useState } from 'react';

const OfertaProduct = ({ product, eventId }) => {
  const [selectedValue, setSelectedValue] = useState(50000);
  const [valuOferta, setValueOferta] = useState(
    product && product.price
      ? product.price
          .split('COP $ ')[1]
          .replace(`’`, '')
          .replace('.', '')
      : 0
  );
  const [valorProduct, setValorProduct] = useState(valuOferta);
  console.log('VALOR OFERTA ', valuOferta);
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

  const changeValor = (e) => {
    setValueOferta(e.target.value);
  };

  const upvalue = () => {     
    if (+valuOferta + selectedValue <= 3 * valorProduct) {
    
      setValueOferta((+valuOferta + selectedValue));
    }
  };

  const downvalue = () => {
    if (+valuOferta - selectedValue >0) {
      setValueOferta((+valuOferta - selectedValue));
    }
  };
  return (
    <Card>
      <Row>
        <Col xs={24} md={24} xl={10} lg={10}>
          <strong>Precio: </strong>
          {product && product.price}
        </Col>
        <Col xs={24} md={24} xl={14} lg={14}>
          {valuesPuja.map((val, index) => (
            <Tag
              color={selectedValue === val.value ? '#2db7f5' : ''}
              onClick={() => setSelectedValue(val.value)}
              key={'val' + index}>
              {val.name}
            </Tag>
          ))}
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col xs={2} md={2} xl={2} lg={2}>
          <Button onClick={()=>downvalue()}>- </Button>
        </Col>
        <Col xs={10} md={10} xl={11} lg={11}>
          <Input
            type='number'
            style={{ width: '100%', margin: 0 }}
            value={`${valuOferta}`}
            onChange={changeValor}
            min='1000'
            max={9999999999}
          />
        </Col>
        <Col xs={2} md={2} xl={2} lg={2}>
          <Button onClick={()=>upvalue()}>+</Button>
        </Col>
        <Col>
          <Button type={'primary'}>Ofrecer</Button>
        </Col>
      </Row>
    </Card>
  );
};

export default OfertaProduct;
