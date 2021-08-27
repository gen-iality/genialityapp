import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tag, Input, Button, Typography, Space, Divider, message, Alert, Spin } from 'antd';
import React from 'react';
import { useState } from 'react';
import { EventsApi } from '../../../helpers/request';
import withContext from '../../../Context/withContext';

const { Title, Text } = Typography;

const OfertaProduct = ({ product, eventId, cEventUser, cUser, hability,messageF }) => {
  const [selectedValue, setSelectedValue] = useState(50000);
  const [loadingSave, setLoadingSave] = useState(false);
  const [priceProduct, setPriceProduct] = useState(product && product.price);
  const [valuOferta, setValueOferta] = useState(
    product && product.price && product.price.includes('COP')
      ? product.price
          .split('COP $ ')[1]
          .replace(`’`, '')
          .replace('.', '')
          .replace(',', '')
      : product && product.price && product.price.includes('USD')?
      product.price
          .split('USD $ ')[1]
          .replace(`’`, '')
          .replace('.', '').replace(',', ''):0
  );
  console.log('DATACONTEXT==>', cEventUser, cUser);
  const [valorProduct, setValorProduct] = useState(valuOferta);
  //VALORES PARA SUBIR EN LA PUJA
  const valuesPuja = [
    {
      name: '500',
      value: 500,
    },
    {
      name: '1.000',
      value: 1000,
    },
    {
      name: '5.000',
      value: 5000,
    },
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
  //VALIDAR SI TIENE PERMISOS DE PUJAR
  const permission = () => {
    if (cEventUser.value.rol_id == '60e8a8b7f6817c280300dc23') {
      return true;
    }
    return false;
  };
  //ONCHANGE INPUT VALUE
  const changeValor = (e) => {
    setValueOferta(e.target.value);
  };
 // console.log("VALOR OFERTA=>",valuOferta)
  //SAVE VALUE OFERTA
  const saveValue = async () => {
    setLoadingSave(true)
    if (valuOferta > 0) {
      let data = {
        valueOffered: valuOferta,
      };
      try {
        let valueResp=await EventsApi.validPrice(eventId, product._id, data)
        if(valueResp){
        let valueNumber=valueResp.includes('COP')?valueResp.split('COP $ ')[1]
        .replace(`’`, '')
        .replace('.', '')
        .replace(',', '')
    : valueResp.includes('USD')?
    valueResp
        .split('USD $ ')[1]
        .replace(`’`, '')
        .replace('.', '').replace(',', ''):0;
        //
        console.log("VALUE NUMBER==>",valueNumber)
        if (valuOferta>=valueNumber) {
          let respuestaApi = await EventsApi.storeOfert(eventId, product._id, data);
          if(respuestaApi){
          console.log('RESPUESTA_API==>', respuestaApi);
          message.success('Oferta realizada correctamente..!');
          }         
        }else{
          setValueOferta(valueNumber)
          setPriceProduct(valueResp);
          message.error('Actualmente se ha ofertado un valor mucho mayor para esta obra!');

        }
      }
      } catch (error) {
        message.error('No estás autorizado para realizar ofertas');
      }    
    }
    setLoadingSave(false)
  };
  // BOTON MAS
  const upvalue = () => {
    if (+valuOferta + selectedValue <= 3 * valorProduct) {
      setValueOferta(+valuOferta + selectedValue);
    }
  };
  //BOTON MENOS
  const downvalue = () => {
    if (+valuOferta - selectedValue >= valorProduct) {
      setValueOferta(+valuOferta - selectedValue);
    }
  };
  return (
    <Card>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Text type='secondary'>
            Precio: <Title level={4}>{priceProduct && priceProduct}</Title>
          </Text>
          {hability && <Divider></Divider>}
        </Col>
        {hability && (
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Space wrap size={8} align='center'>
              {valuesPuja.map((val, index) => (
                <Tag
                  style={{ cursor: 'pointer', padding: '5px', fontSize: '14px' }}
                  color={selectedValue === val.value ? '#2db7f5' : ''}
                  onClick={() => setSelectedValue(val.value)}
                  key={'val' + index}>
                  {val.name}
                </Tag>
              ))}
            </Space>
          </Col>
        )}
      </Row>
      {hability && (
        <Row style={{ marginTop: '5px' }} gutter={[20, 30]} justify='center'>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Space size='small'>
              <Button
                type='dashed'
                shape='circle'
                icon={<MinusOutlined style={{ color: '#2db7f5' }} />}
                onClick={() => downvalue()}></Button>
              <Input
                readOnly
                type='number'
                style={{ width: '100%', margin: 0 }}
                value={`${valuOferta}`}
                onChange={changeValor}
                min='1000'
                max={9999999999}
              />
              <Button
                type='dashed'
                shape='circle'
                icon={<PlusOutlined style={{ color: '#2db7f5' }} />}
                onClick={() => upvalue()}></Button>
            </Space>
          </Col>
          {permission() && (
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              {!loadingSave ? <Button block type={'primary'} onClick={saveValue}>
                Ofrecer
              </Button>:<Spin />}
            </Col>
          )}
          {!permission() && (
            <Row>
              <Alert type='warning' message='No tienes permisos para pujar sobre esta obra.' />
            </Row>
          )}
        </Row>
      )}
      {!hability && (  <div>       
            {messageF && messageF != '<p><br></p>' && (
              <div
                dangerouslySetInnerHTML={{
                  __html: messageF ? messageF : 'Sin mensaje',
                }}></div>
            )}        
        </div>
      )}
    </Card>
  );
};

export default withContext(OfertaProduct);
