import { useEffect, useState } from 'react';
import { Select, Form, Button, Input, Modal } from 'antd';
const { Option } = Select;

const ModalEdit = ({ visible, data, onFinish }) => {
  const [visibleModal, setVisibleModal] = useState();

  const [form] = Form.useForm();

  useEffect(() => {
    setVisibleModal(visible);
  }, [visible]);

  useEffect(() => {
    form.setFieldsValue({
      language: data && data.language,
      state: data && data.state,
      informative_text: data && data.informative_text,
      meeting_id: data && data.meeting_id ? data.meeting_id : 0,
      vimeo_id: data && data.vimeo_id ? data.vimeo_id : 0,
    });
  }, [data, form]);

  const handleCancel = async () => {
    setVisibleModal(false);
  };

  return (
    <Modal
      title='Editar'
      visible={visibleModal}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Cerrar
        </Button>,
      ]}>
      <Form onFinish={onFinish} form={form}>
        <Form.Item label='Lenguaje' name='language'>
          <Select>
            <Option value='Ingles'>Ingles</Option>
            <Option value='Español'>Español</Option>
            <Option value='Frances'>Frances</Option>
            <Option value='Portugués'>Portugués</Option>
            <Option value='Aleman'> Aleman</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Id de conferencia' name='meeting_id'>
          <Input disabled />
        </Form.Item>

        <Form.Item label='Id de conferencia' name='vimeo_id'>
          <Input disabled />
        </Form.Item>

        <Form.Item label='estado' name='state'>
          <Select>
            <Option value='open_meeting_room'>Conferencia abierta</Option>
            <Option value='closed_meeting_room'>Conferencia no Iniciada</Option>
            <Option value='ended_meeting_room'>Conferencia terminada</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Texto informativo ' name='informative_text'>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModalEdit;
