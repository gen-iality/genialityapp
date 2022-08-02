import EviusReactQuill from '@/components/shared/eviusReactQuill';
import { CurrentEventContext } from '@/context/eventContext';
import { EventsApi } from '@/helpers/request';
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
  const [textColor, setTextColor] = useState(null);
  const [bgColor, setBgColor] = useState(null);

  useEffect(() => {
    if (type !== 'text') return;
    !initialValue ? setText(null) : setText(initialValue.value);
    obtenerEvento();
    async function obtenerEvento() {
      const event = await EventsApi.landingEvent(cEvent.value._id);
      if (event) {
        setBgColor(event.styles?.toolbarDefaultBg);
        setTextColor(event.styles?.textMenu);
      }
    }
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
      width={720}
      maskClosable={false}
      closable={false}
      bodyStyle={{
        padding: '0px',
        borderTop: '10px solid #517FD6',
        borderRadius: '8px 8px 0px 0px',
        backgroundColor: bgColor,
      }}
      title={null}
      visible={type == 'text'}
      onOk={saveText}
      okText={'Guardar'}
      cancelText={'Cancelar'}
      onCancel={() => setType(null)}>
      {textColor && bgColor && (
        <EviusReactQuill
          placeholder='Ingresa aquí la descripción'
          colors={[textColor, bgColor]}
          styles={{ caretColor: textColor }}
          className='insideModal'
          blockedOptions={true}
          name='Texto'
          data={text}
          handleChange={(value) => handleText(value)}
        />
      )}
    </Modal>
  );
};

export default ModalTextComponent;
