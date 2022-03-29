import { useState, useEffect } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Col, Row, Spin, Switch } from 'antd';
import { withRouter } from 'react-router';
import ReactQuill from 'react-quill';
import { toolbarEditor } from '../../helpers/constants';
import { firestore } from '../../helpers/firebase';
import Header from '../../antdComponents/Header';
import { DispatchMessageService } from '../../context/MessageService';

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
        console.log('respuesta firebase=>', resp.data());
        let data = resp.data();
        setCheckSubasta(data.data.habilitar_subasta);
        setMessage(data.data.message);
      }
      setLoadingData(false);
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
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se guarda la configuración...',
      action: 'show',
    });
    setLoading(true)     
    let data={
      habilitar_subasta:checkSubasta,
      message:messageF
    }

    try{
      let resp = await firestore
      .collection('config')
      .doc(props.eventId).set({data});
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'success',
        msj: 'Configuración guardada correctamente!',
        action: 'show',
      });       
    } catch (e) {
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: 'Ha ocurrido un error',
        action: 'show',
      });
    }
    setLoading(false)
  };
  

  return !loadingData ? (
    <>
      <Header title={'Configuración'} back save saveMethod={saveConfiguration} />
      <Row justify='center' wrap gutter={12}>
        <Col span={16}>
          <p>Habilitar puja</p>
          <Switch checked={checkSubasta} onChange={onChange} />
          <br /> <br />
          <p>Mensaje a mostrar al deshabilitar</p>
          <ReactQuill id={'messageF'} value={messageF} modules={toolbarEditor} onChange={changeMessage} />
        </Col>
      </Row>
    </>
  ) : (
    <div style={{ textAlign: 'center' }}>
      <Spin />
    </div>
  );
};

export default withRouter(Configuration);
