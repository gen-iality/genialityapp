import { LinkOutlined } from '@ant-design/icons';
import { Col, Form, Input, message, Modal, Result, Row } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import LinkVariantOffIcon from '@2fd/ant-design-icons/lib/LinkVariantOff';
import { CurrentEventContext } from '@/context/eventContext';

const ModalVideoComponent = ({
  type,
  setType,
  saveItem,
  initialValue,
  setLoading,
  dataSource,
  setItem,
  setDataSource,
}) => {
  //REFERENCIA FORM
  const formRef = useRef();
  //ESTADOS
  const [videourl, setvideourl] = useState('');
  const [videoerror, setvideoerror] = useState(false);

  //CONTEXTO
  const cEvent = useContext(CurrentEventContext);

  //PERMITE SETEAR EL ESTADO INICIAL INITIALVALUE
  useEffect(() => {
    if (type !== 'video') return;
    formRef.current.setFieldsValue({ video: initialValue?.value || null });
    setvideourl('');
    return () => setType(null);
  }, [type]);

  const saveUrlVideo = async () => {
    try {
      const values = await formRef.current.validateFields();
      if (values.video !== '' && values.video !== null) {
        const item = {
          ...initialValue,
          type: 'video',
          value: values.video,
        };
        saveItem(item, setLoading, dataSource, setItem, cEvent, setDataSource);
        setType(null);
      } else {
        message.error('Ingrese una url de video para poder guardar');
      }
    } catch (error) {
      message.error('Ingrese una url de video para poder guardar');
    }
  };
  return (
    <Modal
      width={720}
      maskClosable={false}
      closable={false}
      title={null}
      bodyStyle={{ borderTop: '10px solid #D6A851', borderRadius: '8px' }}
      visible={type == 'video'}
      onOk={saveUrlVideo}
      okText={'Guardar'}
      cancelText={'Cancelar'}
      onCancel={() => {
        setvideoerror(true);
        setvideourl('');
        //PERMITE CAMBIAR LOS ESTADOS Y NO SE REPRODUZCA EL VIDEO
        setTimeout(() => setType(null), 200);
      }}>
      <Row gutter={[16, 16]} justify='center' align='middle' style={{ height: '100%' }}>
        <Col span={24}>
          <Form style={{ width: '100%' }} layout='vertical' ref={formRef}>
            <Form.Item
              style={{ marginBottom: '0px' }}
              rules={[
                { type: 'url', message: 'Ingrese una url válida' },
                { required: 'true', message: 'Este campo es obligatorio' },
              ]}
              name='video'>
              <Input
                onChange={(e) => {
                  setvideourl(e.target.value);
                  setvideoerror(false);
                }}
                size='large'
                placeholder='URL de tu vídeo'
                prefix={<LinkOutlined style={{ color: '#D6A851' }} />}
              />
            </Form.Item>
          </Form>
        </Col>
        {videourl !== '' && (
          <Col span={24}>
            {!videoerror ? (
              <ReactPlayer
                controls
                onError={(error) => {
                  setvideoerror(true);
                  console.log('error', error);
                }}
                url={videourl}
                width={'100%'}
                height={null}
                style={{ aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden' }}
              />
            ) : (
              <Result
                icon={<LinkVariantOffIcon />}
                title='Vídeo no encontrado'
                subTitle='Asegúrate que el enlace a tu video este bien escrita'
              />
            )}
          </Col>
        )}
      </Row>
    </Modal>
  );
};

export default ModalVideoComponent;
