import { Button, Col, DatePicker, Form, Modal, ModalProps, Row, Space, TimePicker } from 'antd';
import moment, { Moment, isMoment } from 'moment';
import { DateRangeEvius } from '../hooks/useCustomDateEvent';
import { useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { getArrayUntilNumber } from './utils/validate-hours.utils';

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
  times: Moment[];
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
    const times = form.getFieldValue('times');
    if (date) {
      handledEdit(form.getFieldValue('date'), times[0], times[1], date.id);
      setOpenModal(false);
      closeModal();
      return;
    }
    closeModal();
    handleInterceptor(form.getFieldValue('date'), times[0], times[1]);
    setOpenModal(false);
  };

  useEffect(() => {
    if (date) {
      return form.setFieldsValue({
        date: moment(date.start),
        times: [moment(date.start), moment(date.end)],
      });
    }
    form.setFieldsValue({
      date: '',
      times: [],
    });
  }, [date]);

  return (
    <Modal
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
      title={date ? 'Edición de la fecha' : 'Creación de la fecha'}
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
          label='Horas'
          name={'times'}
          rules={[{ required: true, message: 'Debe escoger las horas inicio y fin' }]}>
          {/* @ts-ignore */}
          <TimePicker.RangePicker allowClear={false} style={{ marginBottom: 10, width: '100%' }} format={format} />
        </Form.Item>
        <Row justify='end' wrap gutter={[8, 8]}>
          <Col>
            <Button danger onClick={() => setOpenModal(false)} icon={<CloseCircleOutlined />}>
              Cancelar
            </Button>
          </Col>
          <Col>
            <Button type='primary' htmlType='submit' icon={<SaveOutlined />}>
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
