import { Alert, Button, Card, Col, Row, Space, Typography } from 'antd';
import { DateRangeEvius, useCustomDateEvent } from '../hooks/useCustomDateEvent';
import Loading from '@/components/loaders/loading';
import { TimeItem } from './TimeItem';
import { DateEventItem } from './DateEventItem';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { DateModal } from './DateModal';
interface Props {
  eventId: string;
  updateEvent: () => void;
}

export default function CustomDateEvent(props: Props) {
  const { eventId } = props;
  const {
    isFetching,
    isSaving,
    dates,
    handleSubmit,
    handleUpdateTime,
    handleInterceptor,
    mustUpdateDate,
    datesOld,
    disabledDate,
  } = useCustomDateEvent({
    eventId,
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateRangeEvius>();
  if (isFetching) return <Loading />;

  const openCreateNewDate = () => {
    setOpenModal(true);
  };

  const openEditDate = (date: DateRangeEvius) => {
    setOpenModal(true);
    setSelectedDate(date);
  };
  const closeModal = () => {
    setOpenModal(false);
    setSelectedDate(undefined);
  };

  return (
    <Row gutter={[16, 24]}>
      <Col xs={24} lg={24}>
        {openModal && (
          <DateModal
            footer={false}
            disabledDate={disabledDate}
            setOpenModal={setOpenModal}
            handleInterceptor={handleInterceptor}
            date={selectedDate}
            visible={openModal}
            onCancel={closeModal}
            handleUpdateTime={handleUpdateTime}
          />
        )}
        {mustUpdateDate && (
          <Alert
            message='Formato de fecha incorrecto'
            description={`Fecha inicio ${datesOld?.startDateOld} y fecha final ${datesOld?.endDateOld} Se han corregido las fechas al nuevo formato, confirme`}
            type='error'
            style={{ marginTop: '2rem' }}
          />
        )}
      </Col>
      <Col xs={24} lg={24}>
        <Typography.Title level={5}>Fechas seleccionadas</Typography.Title>
        <Space wrap>
          {!!dates.length &&
            dates.map((date) => <DateEventItem key={date.id} date={date} onClick={() => openEditDate(date)} />)}
          <Card onClick={openCreateNewDate} hoverable>
            <PlusOutlined />
          </Card>
        </Space>
      </Col>
      <Col span={24}>
        <Button style={{ marginTop: 16 }} type='primary' onClick={handleSubmit} loading={isSaving}>
          Guardar
        </Button>
      </Col>
    </Row>
  );
}
