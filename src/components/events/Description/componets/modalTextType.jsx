import EviusReactQuill from '@/components/shared/eviusReactQuill';
import { CurrentEventContext } from '@/context/eventContext';
import { Form, message, Modal } from 'antd';
import { useState, useEffect, useContext } from 'react';

const ModalTextComponent = ({
  type,
  setType,
  saveItem,
  initialValue,
  setLoading,
  dataSource,
  setItem,
  setDataSource,
}) => {
  const [text, setText] = useState(null);
  const cEvent = useContext(CurrentEventContext);

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
      saveItem(item, setLoading, dataSource, setItem, cEvent, setDataSource);
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
      bodyStyle={{ padding: '0px', borderTop: '10px solid #517FD6', borderRadius: '8px' }}
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
