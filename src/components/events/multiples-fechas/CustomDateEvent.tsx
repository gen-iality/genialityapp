import { Alert, Button, Col, Row, Space, Typography } from 'antd';
import { useCustomDateEvent } from '../hooks/useCustomDateEvent';
import Loading from '@/components/loaders/loading';
import { MyMultiPicker } from '@/components/react-multi-picker/MyMultiPicker';
import { TimeItem } from './TimeItem';
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
  } = useCustomDateEvent({
    eventId,
  });
  if (isFetching) return <Loading />;

  return (
    <Row gutter={[16, 24]}>
      <Col xs={24} lg={12}>
        <MyMultiPicker multiple onChange={handleInterceptor} value={dates.map(dateRange=>dateRange.start)} className="rmdp-mobile" />
        {mustUpdateDate && (
          <Alert
            message='Formato de fecha incorrecto'
            description={`Fecha inicio ${datesOld?.startDateOld} y fecha final ${datesOld?.endDateOld}`}
            type='error'
            style={{ marginTop: '2rem' }}
          />
        )}
      </Col>
      <Col xs={24} lg={12}>
        <Space direction='vertical'>
          <Typography.Title level={5}>Fechas seleccionadas</Typography.Title>
          {!!dates.length &&
            dates.map((date) => <TimeItem key={date.id} date={date} handleUpdateTime={handleUpdateTime} />)}
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
