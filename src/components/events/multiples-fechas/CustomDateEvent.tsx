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
          destroyOnClose={true}
        />
      )}
      <Space direction='vertical'>
        {mustUpdateDate && (
          <Alert
            message={<Typography.Text strong>Formato de fecha incorrecto</Typography.Text>}
            description={
              <Typography.Paragraph>
                Las fechas se han modificado a un nuevo formato, 
                para continuar con la configuración correcta por favor verifique las fechas y horas respectivas del evento
                (Fecha de inicio {datesOld?.startDateOld}, fecha final {datesOld?.endDateOld}). <br />  
                Una vez que haya verificado las fechas y horas, debe guardar los cambios dando clic al botón 
                <Typography.Text strong> Guardar fechas</Typography.Text>, el cual realizará el cambio y hará desaparecer este mensaje. 
                
              </Typography.Paragraph>
            }
            type='error'
          />
        )}
        <Typography.Text strong>Fechas seleccionadas</Typography.Text>
        <List 
          grid={{gutter: 8, column: 2}}
          split={false}
          dataSource={dates}
          renderItem={date => (
            <List.Item>
              <DateEventItem
                key={date.id}
                date={date}
                onClick={() => openEditDate(date)}
                handledDelete={handledDelete}
              />
            </List.Item>
          )}
        >
          <List.Item >
            <Row justify={'center'}>
              <Col span={12}>
                <Card onClick={openCreateNewDate} hoverable style={{borderRadius: 10, border: '1px solid #C4C4C490'}}>
                  <Row justify='center' align='middle'>
                    <PlusOutlined />
                  </Row>
                </Card>
              </Col>
            </Row>
          </List.Item>
        </List>
        <Row justify='end' gutter={[8, 8]} wrap>
          <Col>
            <Button icon={<SaveOutlined />} type='primary' onClick={handleSubmit} loading={isSaving}>
              Guardar fechas
            </Button>
          </Col>
        </Row>
      </Space>
    </Card>
  );
}
