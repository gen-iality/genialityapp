import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tag, Input, Button, Typography, Space, Divider } from 'antd';
import React from 'react';
import { useState } from 'react';

const { Title, Text } = Typography;

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
      setValueOferta(+valuOferta + selectedValue);
    }
  };

  const downvalue = () => {
    if (+valuOferta - selectedValue > 0) {
      setValueOferta(+valuOferta - selectedValue);
    }
  };
  return (
    <Card>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Text type='secondary'>
            Precio: <Title level={4}>{product && product.price}</Title>
          </Text>
          <Divider></Divider>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Space wrap size={8} align='center'>
            {valuesPuja.map((val, index) => (
              <Tag
                style={{ cursor: 'pointer', padding:'5px', fontSize:'14px' }}
                color={selectedValue === val.value ? '#2db7f5' : ''}
                onClick={() => setSelectedValue(val.value)}
                key={'val' + index}>
                {val.name}
              </Tag>
            ))}
          </Space>
        </Col>
      </Row>
      <Row style={{ marginTop: '5px' }} gutter={[20, 30]} justify='center'>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Space size='small'>
            <Button type='dashed' shape='circle' icon={<MinusOutlined style={{color:'#2db7f5'}} />} onClick={() => downvalue()}></Button>
            <Input
              readOnly
              type='number'
              style={{ width: '100%', margin: 0 }}
              value={`${valuOferta}`}
              onChange={changeValor}
              min='1000'
              max={9999999999}
            />
            <Button type='dashed' shape='circle' icon={<PlusOutlined style={{color:'#2db7f5'}} />} onClick={() => upvalue()}></Button>
          </Space>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Button block type={'primary'}>
            Ofrecer
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default OfertaProduct;
