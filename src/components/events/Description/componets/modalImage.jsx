import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { CurrentEventContext } from '@/context/eventContext';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { message, Modal, Form, Input, Button, Col } from 'antd';
import { useState, useEffect, useContext } from 'react';

const iconsStyles = { marginRight: '5px' };
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const ModalImageComponent = ({
  type,
  setType,
  saveItem,
  initialValue,
  setLoading,
  dataSource,
  setItem,
  setDataSource,
}) => {
  const [image, setImage] = useState(null);
  const cEvent = useContext(CurrentEventContext);
  const [url, setUrl] = useState('');
  const [showInputUrl, setShowInputUrl] = useState(false);

  useEffect(() => {
    if (type !== 'image') return;
    if (!initialValue) {
      setImage(null);
      setShowInputUrl(false);
    } else {
      if (initialValue.hiperVinculo?.length > 0) {
        setShowInputUrl(true);
        setUrl(initialValue.hiperVinculo);
      }
      setImage(initialValue.value);
    }
    return () => setType(null);
  }, [type]);

  const saveImage = () => {
    if (!image) return message.error('Seleccione una imagen para poder guardar');

    if (showInputUrl && url.length === 0) return message.error('Debe diligenciar una url valida para la imagen');

    const item = {
      ...initialValue,
      type: 'image',
      value: image,
      hiperVinculo: url,
    };

    saveItem(item, setLoading, dataSource, setItem, cEvent, setDataSource);
    setType(null);
    setShowInputUrl(false);
    setUrl('');
  };

  const handleImage = (imageUrl) => {
    setImage(imageUrl);
  };

  const hadledChange = ({ target }) => {
    setUrl(target.value);
  };

  const handledShowInput = ()=> {
    setShowInputUrl(!showInputUrl);
    setUrl('')
  };

  return (
    <Modal
      width={720}
      maskClosable={false}
      closable={false}
      bodyStyle={{ padding: '0px', borderTop: '10px solid #51D6A8', borderRadius: '8px' }}
      title={null}
      visible={type == 'image'}
      onOk={saveImage}
      okText={'Guardar'}
      cancelText={'Cancelar'}
      onCancel={() => setType(null)}>
      <ImageUploaderDragAndDrop
        imageDataCallBack={(imageUrl) => handleImage(imageUrl)}
        imageUrl={image}
        width={null}
        height={null}
        styles={{ cursor: 'auto', borderRadius: '10px 10px 0px 0px', textAlign: 'center' }}
        hoverable={false}
      />

      <Col style={{ padding: 20 }}>
        <Button
          icon={showInputUrl ? <MinusCircleOutlined style={iconsStyles} /> : <PlusCircleOutlined style={iconsStyles} />}
          type='link'
          onClick={handledShowInput}>
          {showInputUrl ? 'Quitar URL' : 'Agregar URL'}
        </Button>

        {showInputUrl && (
          <Form {...formLayout}>
            <Form.Item label={'Enlace'} initialValue={url}>
              <Input defaultValue={url} name='url' placeholder={`Enlace de redireccion`} onChange={hadledChange}></Input>
            </Form.Item>
          </Form>
        )}
      </Col>
    </Modal>
  );
};

export default ModalImageComponent;
