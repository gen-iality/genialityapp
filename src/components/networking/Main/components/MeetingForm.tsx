import React, { useState, Fragment, createRef } from 'react';
import { Checkbox, Form, Input, Radio, Select, InputNumber, Button, Row, Alert } from 'antd';

export default function MeetingForm() {
  const [modal, setModal] = useState(true);
  const [form] = Form.useForm();
  const formRef = createRef<any>();
  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };
  return (
    <Fragment>
      {/* <section className='modal-card-body'> */}
      <Form autoComplete='off' initialValues={() => {}} ref={() => {}} onFinish={() => {}}>
        <Form.Item
          label={'Nombre'}
          name={'nombre'}
          rules={[{ required: true, message: 'Es necesario el nombre de la reunion' }]}>
          <Input 
            ref={formRef}
            name={'nombre'}
            type='text'
            placeholder={'Ej: Acuerdo productos'} 
            />
        </Form.Item>
        <Form.Item
          label={'Participantes'}
          name='participantes'
          rules={[{ required: true, message: 'Es necesario escoger al menos un participante' }]}>
          <Select
            options={[
              { value: 12345, label: 'Luis' },
              { value: 654894, label: 'Carlos' },
            ]}></Select>
        </Form.Item>
      </Form>
    </Fragment>
  );
}
