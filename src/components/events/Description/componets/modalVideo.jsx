import { Form, Input, message, Modal } from 'antd';
import { useEffect, useRef } from 'react';

const ModalVideoComponent = ({ type, setType, saveItem, initialValue }) => {
const formRef=useRef()

  useEffect(() => {
    if (type !== 'video') return;
    formRef.current.setFieldsValue(
        {video:initialValue?.value || null}
    );
    return () => setType(null);
  }, [type]);

  const saveUrlVideo = async () => {
    try {
        const values = await formRef.current.validateFields();      
         if (values.video!=='' && values.video!==null) {
           const item = {
             ...initialValue,
             type: 'video',
             value: values.video,
           };
           saveItem(item);
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
      maskClosable={false}
      closable={false}
      bodyStyle={{ padding: '0px' }}
      title={null}
      visible={type == 'video'}
      onOk={saveUrlVideo}
      okText={'Guardar'}
      onCancel={() => setType(null)}>
        <Form ref={formRef}>
            <Form.Item label="Url del video"  rules={[{type:'url',message: 'Ingrese una url válida'},
            {required:'true',message:"Este campo es obligatorio" },]} 
            name="video">
                <Input />
            </Form.Item>
        </Form>      
    </Modal>
  );
};

export default ModalVideoComponent;
