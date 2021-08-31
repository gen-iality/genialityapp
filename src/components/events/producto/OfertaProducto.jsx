import { MinusOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tag, Input, Button, Typography, Space, Divider, message, Alert, Spin } from 'antd';
import React from 'react';
import { useState } from 'react';
import {  EventsApi } from '../../../helpers/request';
import withContext from '../../../Context/withContext';
import { useEffect } from 'react';

const { Title, Text } = Typography;

const OfertaProduct = ({ product, eventId, cEventUser, cUser, hability,messageF,updateValues }) => {
  const [selectedValue, setSelectedValue] = useState(50000);
  const [loadingSave, setLoadingSave] = useState(false);
  const [priceProduct, setPriceProduct] = useState(product && product.price);
  const [valuOferta, setValueOferta] = useState(0);
  const [valorProduct, setValorProduct] = useState(valuOferta);
  const [totalOferts, setTotalOferts] = useState(0);
  const [isUsd, setUsd] = useState(false);
  const [bloquerPuja,setBloquearPuja]=useState(false)
  useEffect(()=>{
    if(product && eventId){
      obtenerOfertas()
      if(product.price.includes('USD')){
        setUsd(true)
        setSelectedValue(50)
      }
      //PUJA BLOQUEDA PARA UN PRODUCTO EN ESPECIFICO, SIRVE PARA NO CAMBIAR EL VALOR A OFRECER
      if(product && product._id=='6116cae171f4b926d1363266'){
        setBloquearPuja(true)
       
      }
      setPriceProduct( product &&product.price)
      setValorProduct(obtenerValor())
      console.log("ISUSD==>",product.price.includes('USD'))
      let minValueUp=product.price.includes('USD')?50:50000
      let valueOfertaMin=parseFloat(obtenerValor())+minValueUp
      setValueOferta(valueOfertaMin)
    }
    async function obtenerOfertas(){
     let oferts= await EventsApi.ofertsProduct(eventId,product._id);    
     if(oferts && oferts.data){
       setTotalOferts(oferts.data.length)
     }
    }
  },[eventId,product])

  const obtenerValor=()=>{
  return  product && product.price && product.price.includes('COP')
      ? product.price
          .split('COP $ ')[1]
          .replace(`’`, '')
          .replace('.', '')
          .replace(',', '')
      : product && product.price && product.price.includes('USD')?
      product.price
          .split('USD $ ')[1]
          .replace(`’`, '')
          .replace('.', '').replace(',', ''):0;
  }

  /*const formatPrecioInitial=(value)=>{
    let valueFormat;
   if(value){    
    let valor= value.split(' ');    
    valueFormat=valor.slice(2)     
      return valueFormat;        
   }
  }*/
  //VALORES PARA SUBIR EN LA PUJA
  const valuesPuja = [
    {
      name: 'COP 50.000',
      value: 50000,
    },
    {
      name: 'COP 100.000',
      value: 100000,
    },
    {
      name: 'COP 500.000',
      value: 500000,
    },
    {
      name: 'COP 1.000.000',
      value: 1000000,
    },
  ];

    //VALORES PARA SUBIR EN LA PUJA USD
    const valuesPujaDol = [
      {
        name: 'USD 50',
        value: 50,
      },
      {
        name: ' USD 100',
        value: 100,
      },     
      {
        name: 'USD 500',
        value: 500,
      },
      {
        name: 'USD 1.000',
        value: 1000,
      }
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
         // console.log('RESPUESTA_API==>', respuestaApi);
          message.success('Oferta realizada correctamente..!');
          updateValues(true)
          }         
        }else{
          let minValueUp=product.price.includes('USD')?50:50000
          let valueOfertaMin=parseFloat(valueNumber)+minValueUp
          setValueOferta(valueOfertaMin);
          setPriceProduct(valueResp);
          setValorProduct(valueNumber);
         // console.log("VALUE RESP==>",valueResp)
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
    let minValueUp=product.price.includes('USD')?50:50000   
    if (+valuOferta - selectedValue >= +valorProduct+minValueUp) {  
      setValueOferta(+valuOferta - selectedValue);
    }
  };
  return (
    <Card>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Text type='secondary'>
            Precio Inicial: <Title level={4}>{(product && product.start_price && product.start_price ) || (priceProduct && priceProduct) }</Title>
          </Text>
          {hability && <Divider></Divider>}
        </Col>
        {hability && permission() && product && product.start_price && <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Text type='secondary'>
            Oferta actual: <Title level={4}>{priceProduct && priceProduct}</Title>
          </Text>
          {hability && permission() && <Divider></Divider>}
        </Col>}
        {hability && permission() && (
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Space wrap size={8} align='center'>
              {!isUsd&& valuesPuja.map((val, index) => (
                <Tag
                  style={{ cursor: 'pointer', padding: '5px', fontSize: '14px' }}
                  color={selectedValue === val.value ? '#2db7f5' : ''}
                  onClick={() => setSelectedValue(val.value)}
                  key={'val' + index}>
                  {val.name}
                </Tag>
              ))}
                {isUsd&& valuesPujaDol.map((val, index) => (
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
      {hability && (<>
       
        <Row style={{ marginTop: '5px' }} gutter={[20, 30]} >
         {permission() && <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Space size='small'>
              <Button
                type='dashed'
                shape='circle'
                icon={<MinusOutlined style={{ color: '#2db7f5' }} />}
                onClick={() =>!bloquerPuja ?downvalue():null}></Button>
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
                onClick={() => !bloquerPuja ? upvalue():null}></Button>
            </Space>
          </Col>}
          <Col>
          
          {permission() && totalOferts==0?<div><small>No hay ofertas por esta obra</small></div>:permission() && <div><small>Hay <strong>{totalOferts}</strong> oferta{totalOferts>1 && 's'}</small></div>}
          </Col>
       
          {permission() && (
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              
              {!loadingSave ? <Button block type={'primary'} onClick={saveValue}>
                Ofrecer
              </Button>:<Spin />}
              <Alert showIcon type={'success'} style={{marginTop:20,marginBottom:30}} message={'Al hacer esta puja está aceptando nuestros términos y condiciones y se compromete al pago del valor ofertado en caso que ningún otro participante realice una puja por un monto superior'}/>
             <a target='_blank' rel="noreferrer" href={'https://tiempodejuego.org/tyclaventana/'}><PlayCircleOutlined /> Ver términos y condiciones</a>
            </Col>
          )}
          {!permission() && (
            <Row>
              <Alert type='warning' message='No tienes permisos para pujar sobre esta obra.' />
            </Row>
          )}
        </Row>
        </>
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
