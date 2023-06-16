import { Alert, Button, DatePicker, Form, Modal, ModalProps, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useIntl } from 'react-intl';
import { TimeItem } from './TimeItem';
import { DateRangeEvius } from '../hooks/useCustomDateEvent';
import { useState } from 'react';

interface Props extends ModalProps {
  date?: DateRangeEvius;
  handleUpdateTime: (dateKey: string, type: 'start' | 'end', value: moment.Moment | null, dateString: string) => void;
  handleInterceptor: (fecha: Moment, horaInicio: Moment, horaFin: Moment) => void;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  disabledDate: (current: Moment) => boolean;
}

const format = 'hh:mm A';

export const DateModal = ({
  date,
  handleUpdateTime,
  handleInterceptor,
  setOpenModal,
  disabledDate,
  ...modalProps
}: Props) => {
  const [currentDate, setcurrentDate] = useState<Moment>();
  const [horaInicio, setHoraInicio] = useState<Moment>();
  const [horaFin, setHoraFin] = useState<Moment>();
  const [loadingConfirmed, setloadingConfirmed] = useState(false);
  const [error, seterror] = useState('');

  const onCreate = () => {
    setloadingConfirmed(true);
    if (!currentDate || !horaInicio || !horaFin) return;
    handleInterceptor(currentDate, horaInicio, horaFin);
  };
  return (
    <Modal
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
      title={date ? 'Edicion de fecha' : 'Creacion de fecha'}
      okText={'Guardar'}
      cancelText={'Cancelar'}
      confirmLoading={loadingConfirmed}
      {...modalProps}>
      {date ? (
        <TimeItem date={date} handleUpdateTime={handleUpdateTime} />
      ) : (
        <>
          <Form layout='vertical' onFinish={onCreate}>
            <Form.Item label='Fecha' name={'date'} rules={[{ required: true, message: 'La fecha es obligatoria' }]}>
              {/* @ts-ignore */}
              <DatePicker
                disabledDate={disabledDate}
                allowClear={false}
                value={currentDate}
                style={{ marginBottom: 10, width: '100%' }}
                format={'DD-MM-YYYY'}
                // @ts-ignore
                onChange={setcurrentDate}
              />
            </Form.Item>
            <Form.Item
              label='Hora inicio'
              rules={[{ required: true, message: 'La hora inicio es obligatoria' }]}
              name={'dateStart'}>
              {/* @ts-ignore */}
              <TimePicker
                value={currentDate}
                style={{ marginBottom: 10, width: '100%' }}
                format={format}
                // @ts-ignore
                onChange={setHoraInicio}
              />
            </Form.Item>
            <Form.Item
              label='Hora fin'
              rules={[{ required: true, message: 'La hora fin es obligatoria' }]}
              name={'dateEnd'}>
              {/* @ts-ignore */}
              <TimePicker
                allowClear={false}
                value={currentDate}
                style={{ marginBottom: 10, width: '100%' }}
                format={format}
                // @ts-ignore
                onChange={setHoraFin}
              />
            </Form.Item>
            <Button htmlType='submit'>Guardar</Button>
          </Form>
          {error && <Alert message={error} type='warning' />}
        </>
      )}
    </Modal>
  );
};
