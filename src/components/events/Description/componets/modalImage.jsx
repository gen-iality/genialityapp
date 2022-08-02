import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { CurrentEventContext } from '@/context/eventContext';
import { message, Modal } from 'antd';
import { useState, useEffect, useContext } from 'react';

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

  useEffect(() => {
    if (type !== 'image') return;
    !initialValue ? setImage(null) : setImage(initialValue.value);
    return () => setType(null);
  }, [type]);

  const saveImage = () => {
    if (image) {
      const item = {
        ...initialValue,
        type: 'image',
        value: image,
      };
      saveItem(item, setLoading, dataSource, setItem, cEvent, setDataSource);
      setType(null);
    } else {
      message.error('Seleccione una imagen para poder guardar');
    }
  };
  const handleImage = (imageUrl) => {
    console.log('imageUrl', imageUrl);
    setImage(imageUrl);
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
    </Modal>
  );
};

export default ModalImageComponent;
