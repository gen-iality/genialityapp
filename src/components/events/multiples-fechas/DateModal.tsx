import { Button, DatePicker, Form, Modal, ModalProps, Space, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { DateRangeEvius } from '../hooks/useCustomDateEvent';
import { useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form';

interface Props extends ModalProps {
  date?: DateRangeEvius;
  handleUpdateTime: (dateKey: string, type: 'start' | 'end', value: moment.Moment | null, dateString: string) => void;
  handledInterceptor: (fecha: Moment, horaInicio: Moment, horaFin: Moment) => void;
  handledEdit: (fecha: Moment, horaInicio: Moment, horaFin: Moment, idToEdit: string) => void;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  disabledDate: (current: Moment) => boolean;
  closeModal: () => void;
}

const format = 'hh:mm A';

interface FormDateRange {
  date: Moment;
  timeStart: Moment;
  timeEnd: Moment;
}

export const DateModal = ({
  date,
  handleUpdateTime,
  handledInterceptor: handleInterceptor,
  setOpenModal,
  disabledDate,
  handledEdit,
  closeModal,
  ...modalProps
}: Props) => {
  const [currentDate, setcurrentDate] = useState<Moment>();
  const [form] = useForm<FormDateRange>();

  const onCreate = () => {
    if (date) {
      handledEdit(form.getFieldValue('date'), form.getFieldValue('timeStart'), form.getFieldValue('timeEnd'), date.id);
      setOpenModal(false);
      closeModal();
      return;
    }
    closeModal();
    handleInterceptor(form.getFieldValue('date'), form.getFieldValue('timeStart'), form.getFieldValue('timeEnd'));
    setOpenModal(false);
  };

  useEffect(() => {
    if (date) {
      return form.setFieldsValue({
        date: moment(date.start),
        timeStart: moment(date.start),
        timeEnd: moment(date.end),
      });
    }
    form.setFieldsValue({
      date: '',
      timeEnd: '',
      timeStart: '',
    });
  }, [date]);

  return (
    <Modal
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
      title={date ? 'Edicion de fecha' : 'Creacion de fecha'}
      okText={'Guardar'}
      cancelText={'Cancelar'}
      {...modalProps}>
      <Form layout='vertical' onFinish={onCreate} form={form}>
        <Form.Item label='Fecha' name={'date'} rules={[{ required: true, message: 'La fecha es obligatoria' }]}>
          {/* @ts-ignore */}
          <DatePicker
            disabledDate={disabledDate}
            allowClear={false}
            value={currentDate}
            style={{ marginBottom: 10, width: '100%' }}
            format={'DD-MM-YYYY'}
            // @ts-ignore
          />
        </Form.Item>
        <Form.Item
          label='Hora inicio'
          rules={[{ required: true, message: 'La hora inicio es obligatoria' }]}
          name={'timeStart'}>
          {/* @ts-ignore */}
          <TimePicker
            value={currentDate}
            style={{ marginBottom: 10, width: '100%' }}
            format={format}
            // @ts-ignore
          />
        </Form.Item>
        <Form.Item
          label='Hora fin'
          rules={[{ required: true, message: 'La hora fin es obligatoria' }]}
          name={'timeEnd'}>
          {/* @ts-ignore */}
          <TimePicker
            allowClear={false}
            value={currentDate}
            style={{ marginBottom: 10, width: '100%' }}
            format={format}
            // @ts-ignore
          />
        </Form.Item>
        <Space wrap>
          <Button type='primary' htmlType='submit'>
            Guardar
          </Button>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
        </Space>
      </Form>
    </Modal>
  );
};
