import { Alert, Button, Card, Col, List, Row, Space, Typography } from 'antd';
import { DateRangeEvius, useCustomDateEvent } from '../hooks/useCustomDateEvent';
import Loading from '@/components/loaders/loading';
import { TimeItem } from './TimeItem';
import { DateEventItem } from './DateEventItem';
import { PlusCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
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
    handledDelete,
    handledEdit,
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
    <Card style={{borderRadius: 20}} hoverable>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          {openModal && (
            <DateModal
              closeModal={closeModal}
              handledEdit={handledEdit}
              footer={false}
              disabledDate={disabledDate}
              setOpenModal={setOpenModal}
              handledInterceptor={handleInterceptor}
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
          <Typography.Text strong>Fechas seleccionadas</Typography.Text>
          <Space wrap>
            <List 
              grid={{gutter: 8, column: 2}}
              dataSource={dates}
              renderItem={date => (
                <List.Item style={{border: 'none'}}>
                  <DateEventItem
                    key={date.id}
                    date={date}
                    onClick={() => openEditDate(date)}
                    handledDelete={handledDelete}
                  />
                </List.Item>
              )}
            >
            </List>
            {/* {!!dates.length &&
              dates.map((date) => (
                <DateEventItem
                  key={date.id}
                  date={date}
                  onClick={() => openEditDate(date)}
                  handledDelete={handledDelete}
                />
              ))} */}
            {/* <Card onClick={openCreateNewDate} hoverable>
              <PlusOutlined />
            </Card> */}
          </Space>
        </Col>
        <Col span={24}>
          <Row justify='end' gutter={[8, 8]} wrap>
            <Col>
              <Button icon={<PlusCircleOutlined />} type='default' onClick={openCreateNewDate}>
                Agregar
              </Button>
            </Col>
            <Col>
              <Button icon={<SaveOutlined />} type='primary' onClick={handleSubmit} loading={isSaving}>
                Guardar fechas
              </Button>
            </Col>
          </Row>
          {/* <Button style={{ marginTop: 16 }} type='primary' onClick={handleSubmit} loading={isSaving}>
            Guardar
          </Button> */}
        </Col>
      </Row>
    </Card>
  );
}
