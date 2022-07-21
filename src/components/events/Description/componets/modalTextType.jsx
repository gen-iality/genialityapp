import EviusReactQuill from '@/components/shared/eviusReactQuill';
import { Form, message, Modal } from 'antd';
import { useState, useEffect } from 'react';

const ModalTextComponent = ({ type, setType, saveItem, initialValue }) => {
  const [text, setText] = useState(null);

  useEffect(() => {
    if (type !== 'text') return;
    !initialValue ? setText(null) : setText(initialValue.value);
    return () => setType(null);
  }, [type]);
  const saveText = () => {
    if (text) {
      const item = {
        ...initialValue,
        type: 'text',
        value: text,
      };
      saveItem(item);
      setType(null);
    } else {
      message.error('Ingrese un text para poder guardar');
    }
  };
  const handleText = (text) => {
    setText(text);
  };
  return (
    <Modal
      maskClosable={false}
      closable={false}
      bodyStyle={{ padding: '0px' }}
      title={null}
      visible={type == 'text'}
      onOk={saveText}
      okText={'Guardar'}
      onCancel={() => setType(null)}>
      <EviusReactQuill
        className='insideModal'
        blockedOptions={true}
        name='Texto'
        data={text}
        handleChange={(value) => handleText(value)}
      />
    </Modal>
  );
};

export default ModalTextComponent;
