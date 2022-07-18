import { CurrentEventContext } from '@/context/eventContext';
import { EventsApi } from '@/helpers/request';
import { Button, DatePicker, Form, Input, message, Modal, Spin } from 'antd';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';

const ModalContador = ({ setVisible, visible }) => {
  const cEvent = useContext(CurrentEventContext);
  const [dateLimit, setDateLimit] = useState(moment());
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    setLoading(true);
    const data = {
      useCountdown: true,
      dateLimit: dateLimit,
      countdownMessage: values.messageIn || '',
      countdownFinalMessage: values.messageFinish || '',
    };
    const respApi = await EventsApi.editOne(data, cEvent.value._id);
    if (respApi?._id) {
      message.success('Configuración guardada correctamente!');
      setVisible(false);
    } else {
      message.error('Error al guardar la configuración!');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!cEvent.value || !visible) return;
    obtenerDetailsEvent();
    async function obtenerDetailsEvent() {
      const event = await EventsApi.getOne(cEvent.value._id);
      if (event._id) {
        const initialValueEvent = {
          date: event?.dateLimit ? moment(event?.dateLimit, 'YYYY/MM/DD HH:mm:ss') : moment(),
          messageIn: event?.countdownMessage || '',
          messageFinish: event?.countdownFinalMessage || '',
        };
        setDateLimit(event?.dateLimit);
        form.setFieldsValue(initialValueEvent);
      }
    }
  }, [cEvent.value, visible]);
  return (
    <Modal
      onCancel={() => setVisible(false)}
      footer={null}
      visible={visible}
      bodyStyle={{ paddingLeft: '40px', paddingTop: '30px', paddingRight: '40px', paddingBottom: '30px' }}>
      <Form form={form} onFinish={onFinish} layout='vertical'>
        <Form.Item rules={[{ required: true, message: 'Ingrese una fecha' }]} name='date' label='Fecha y hora'>
          <DatePicker
            allowClear={false}
            style={{ width: '100%' }}
            format='YYYY-MM-DD HH:mm:ss'
            defaultValue={moment()}
            onChange={(e, eString) => setDateLimit(eString)}
            showTime={{ defaultValue: moment().format('HH:mm:ss') }}
          />
        </Form.Item>
        <Form.Item name='messageIn' label='Mensaje durante la cuenta'>
          <Input.TextArea
            showCount
            autoSize={{ minRows: 2, maxRows: 4 }}
            placeholder='Este mensaje se verá durante la cuenta regresiva'
            maxLength={100}
          />
        </Form.Item>
        <Form.Item name='messageFinish' label='Mensaje al finalizar la cuenta'>
          <Input.TextArea
            showCount
            autoSize={{ minRows: 2, maxRows: 4 }}
            placeholder='Este mensaje se verá al finalizar la cuenta regresiva'
            maxLength={100}
          />
        </Form.Item>

        <Form.Item>
          {!loading ? (
            <Button size='large' block type='primary' htmlType='submit'>
              Guardar
            </Button>
          ) : (
            <Spin />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalContador;
