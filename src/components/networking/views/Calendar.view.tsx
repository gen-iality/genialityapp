import { Button, Card, Col, Drawer, Modal, Row, Tooltip } from 'antd';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { Calendar, View, momentLocalizer } from 'react-big-calendar';
import { NetworkingContext } from '../context/NetworkingContext';
import { IEventCalendar, IMeeting, IMeetingCalendar } from '../interfaces/Meetings.interfaces';
import { meetingSelectedInitial, defaultType } from '../utils/utils';
import { TypeCalendarView } from '../interfaces/configurations.interfaces';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'moment/dist/locale/es';
import { getCorrectColor } from '@/helpers/utils';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import MeetingInfo from '../components/MeetingInfo';

const { confirm } = Modal;
export default function MyCalendar() {
  const [View, setView] = useState<View>(TypeCalendarView.month);
  const [open, setOpen] = useState(false);
  const [meenting, setMeeting] = useState(meetingSelectedInitial);
  const localizer = momentLocalizer(moment);
  const now = () => new Date();
  const {
    meetings,
    updateMeeting,
    editMeenting,
    setMeentingSelect,
    openModal,
    observers,
    DataCalendar,
    typeMeetings,
    deleteMeeting
  } = useContext(NetworkingContext);

  const ReactBigCalendar: any = withDragAndDrop(Calendar);

  const showDrawer = (event : IMeeting) => {
    const meeting = meetings.find((item)=> item.id === event.id)
    if(meeting){
    setMeeting(meeting)
    setOpen(true);
    }
  };

  const onClose = () => {
    setOpen(false);
  };
  const onEdit = () => {
    setOpen(false)
    editMeenting(meenting)
  }
  const onDelete = () => {
    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        deleteMeeting(meenting.id);
        setOpen(false)
      },
    });
  };
  {
    /*actualziar reuniones con el evento "drop" del calendario*/
  }
  const updateEventCalendar = ({ start, end, event }: IEventCalendar<IMeeting>) => {
    updateMeeting(event.id, { ...event, start: start.toString(), end: end.toString(), dateUpdated: Date.now() });
  };

  {
    /*crear reuniones desde el calendario*/
  }
  const createEventCalendar = ({ start, end }: IEventCalendar<IMeeting>) => {
    end.setDate(end.getDate() - 1);
    end.setTime(end.getTime() + 5 * 60 * 1000);
    setMeentingSelect({ ...meetingSelectedInitial, start: start.toString(), end: end.toString() });
    openModal();
  };
  //todo : optimizar este procedimiento con buenas practicas
  const renderEvents = () => {
    let events = meetings;
    if (View !== TypeCalendarView.month && observers.length) events = DataCalendar;
    return events.map((meeting) => ({
      ...meeting,
      start: new Date(meeting.start),
      end: new Date(meeting.end),
    }));
  };

  const eventStyleGetter = (event: IMeeting | IMeetingCalendar) => {
    const style = {
      backgroundColor: typeMeetings.find((item) => item.id === event.type?.id)?.style || defaultType.style,
      color: getCorrectColor(typeMeetings.find((item) => item.id === event.type?.id)?.style || defaultType.style),
      border: `1px solid rgba(196, 196, 196, 0.3)`, //#C4C4C4
    };
    return {
      style: style,
    };
  };
  return (
    <>
      <Row justify='center' wrap gutter={8}>
        <Col span={23}>
          <Drawer  
          title={meenting.name} 
          placement='right' 
          onClose={onClose} 
          visible={open}
          size='large'
          extra={
            <Row gutter={[16,16]}>
            <Col span={12}>
              <Tooltip placement='topLeft' title='Editar'>
                <Button icon={<EditOutlined />} onClick={() => onEdit()} />
              </Tooltip>
            </Col>
            <Col  span={12}>
              <Tooltip placement='topLeft' title='Eliminar'>
                <Button icon={<DeleteOutlined />} onClick={() => onDelete()} danger type='primary' />
              </Tooltip>
            </Col>
          </Row>
          }
          >
            <MeetingInfo  meenting={meetings.find((item)=> item.id === meenting.id) || meenting}/>
          </Drawer>
          <Card hoverable>
            <ReactBigCalendar
              events={renderEvents()}
              view={View}
              onView={(view: View) => setView(view)}
              onSelectSlot={createEventCalendar}
              onSelectEvent={showDrawer}
              onEventDrop={updateEventCalendar}
              onEventResize={updateEventCalendar}
              resources={observers.length ? observers : undefined}
              resourceAccessor={'assigned'}
              resourceIdAccessor='value'
              resourceTitleAccessor='label'
              localizer={localizer}
              getNow={now}
              selectable='ignoreEvents'
              eventPropGetter={eventStyleGetter}
              titleAccessor='name'
              startAccessor='start'
              endAccessor='end'
              style={{ height: 500 }}
              messages={{
                next: 'Siguiente',
                previous: 'Anterior',
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                date: 'Fecha',
                time: 'Hora',
                event: 'Evento',
                showMore: function showMore(total: number) {
                  return '+' + total + ' Más';
                },
                noEventsInRange: 'No hay eventos dentro del rango seleccionado',
              }}
              culture='es'
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
