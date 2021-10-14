import React, { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Row, Spin, Switch } from 'antd';
import { withRouter } from 'react-router';
import ReactQuill from 'react-quill';
import { toolbarEditor } from '../../helpers/constants';
import { firestore } from '../../helpers/firebase';
import { useEffect } from 'react';

const Configuration = (props) => {
  const [checkSubasta, setCheckSubasta] = useState(false);
  const [messageF, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (props.eventId) {
      obtenerConfig();
    }
    async function obtenerConfig() {
    
      let resp = await firestore
        .collection('config')
        .doc(props.eventId)
        .get();
      if (resp.exists) {
          console.log("respuesta firebase=>",resp.data())
        let data = resp.data();       
        setCheckSubasta(data.data.habilitar_subasta);
        setMessage(data.data.message);
      }
      setLoadingData(false)
    }
  }, []);

  const goBack = () => props.history.goBack();
  function onChange(checked) {   
    setCheckSubasta(checked);
  }
  const changeMessage = (e) => {
    setMessage(e);
  };

  const saveConfiguration = async() => { 
      setLoading(true)     
      let data={
        habilitar_subasta:checkSubasta,
        message:messageF
      }
      let resp = await firestore
      .collection('config')
      .doc(props.eventId).set({data});
      setLoading(false)        
      message.success('Configuración guardada correctamente!');        
    };
  

  return (
    !loadingData ? <>
     <Col style={{marginBottom:20}}>
        <Row>
          <Button shape='circle' onClick={goBack} icon={<ArrowLeftOutlined />} />{' '}
          <span style={{ marginLeft: 30 }}>Configuración</span>
        </Row>
      </Col>
      <Col>
        <Card style={{width:700,margin:'auto'}}>
          <Row>
            <span>Habilitar puja</span>
          </Row>
          <Row style={{ paddingBottom: 20 }}>
            {' '}
            <Switch checked={checkSubasta} onChange={onChange} />
          </Row>
          <Row>Mensaje a mostrar al deshabilitar</Row>
          <Row style={{ height: '300px', padding: '10px 20px 90px 0px' }}>
            <ReactQuill value={messageF} modules={toolbarEditor} onChange={changeMessage} />
          </Row>
          <Row>
            {loading?<><Spin></Spin> Por favor espere...</>: <Button onClick={saveConfiguration} type='primary'>Guardar</Button>}
          </Row>
        </Card>
      </Col>
    </>:<div style={{textAlign:'center'}}><Spin></Spin></div>
  );
};

export default withRouter(Configuration);
