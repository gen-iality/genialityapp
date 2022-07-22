import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { message, Modal } from 'antd';
import { useState, useEffect } from 'react';

const ModalImageComponent = ({ type, setType, saveItem, initialValue }) => {
  const [image, setImage] = useState(null);

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
      saveItem(item);
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
      maskClosable={false}
      closable={false}
      bodyStyle={{ padding: '0px' }}
      title={null}
      visible={type == 'image'}
      onOk={saveImage}
      okText={'Guardar'}
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
