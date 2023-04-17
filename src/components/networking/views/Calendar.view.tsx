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
import { CloseOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import MeetingInfo from '../components/MeetingInfo';
import useGroupByCalendar from '../hooks/useGroupByCalendar';
import useGetMeetingToCalendar from '../hooks/useGetMeetingToCalendar';
import { useGetSpaces } from '../hooks/useGetSpaces';
import { GroupByResources } from '../interfaces/groupBy-interfaces';
import { useGetMeetings } from '../hooks/useGetMeetings';

const { confirm } = Modal;
export default function MyCalendar() {
  const [View, setView] = useState<View>(TypeCalendarView.month);
  const [open, setOpen] = useState(false);
  const [meenting, setMeeting] = useState(meetingSelectedInitial);
  const localizer = momentLocalizer(moment);
  const now = () => new Date();
  const {
    updateMeeting,
    editMeenting,
    setMeentingSelect,
    openModal,
    observers,
    typeMeetings,
    deleteMeeting,
  } = useContext(NetworkingContext);
  const { meetings, loading } = useGetMeetings();
  const [groupBy, setGroupBy] = useState<GroupByResources>('spaces');
  const { spaces } = useGetSpaces();
  const { renderEvents } = useGetMeetingToCalendar(meetings, View, observers, groupBy);
  const { resources, resourceAccessor, buttonGroupBy } = useGroupByCalendar(
    {
      observers: {
        resources: observers,
        resourceAccessor: 'assigned',
        buttonGroupBy: 'Observadores',
      },
      spaces: {
        resources: spaces,
        resourceAccessor: 'place',
        buttonGroupBy: 'Espacios',
      },
    },
    groupBy
  );
  
  const ReactBigCalendar: any = withDragAndDrop(Calendar);

  const showDrawer = (event: IMeeting) => {
    setMeeting({ ...event, start: event.start.toString(), end: event.end.toString() });
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const onEdit = () => {
    setOpen(false);
    editMeenting(meenting);
  };
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
        setOpen(false);
      },
    });
  };
  /*actualziar reuniones con el evento "drop" del calendario*/
  const updateEventCalendar = ({ start, end, event }: IEventCalendar<IMeeting>) => {
    updateMeeting(event.id, { ...event, start: start.toString(), end: end.toString(), dateUpdated: Date.now() });
  };

  /*crear reuniones desde el calendario*/
  const createEventCalendar = ({ start, end }: IEventCalendar<IMeeting>) => {
    end.setDate(end.getDate() - 1);
    end.setTime(end.getTime() + 5 * 60 * 1000);
    setMeentingSelect({ ...meetingSelectedInitial, start: start.toString(), end: end.toString() });
    openModal();
  };

  const eventStyleGetter = (event: IMeeting | IMeetingCalendar) => {
    if(!typeMeetings) return {
      backgroundColor: defaultType.style,
      color: 'white',
      border: `1px solid rgba(196, 196, 196, 0.3)`, //#C4C4C4
    };
    const style = {
      backgroundColor: typeMeetings.find((item) => item.id === event.type?.id)?.style || defaultType.style,
      color: getCorrectColor(typeMeetings.find((item) => item.id === event.type?.id)?.style || defaultType.style),
      border: `1px solid rgba(196, 196, 196, 0.3)`, //#C4C4C4
    };
    return {
      style: style,
    };
  };

  const onSetNextGroupBy = () => {
    if (groupBy === 'observers') return setGroupBy('spaces');
    if (groupBy === 'spaces') return setGroupBy('observers');
  };
  return (
    <>
      <Row justify='center' wrap gutter={8}>
        <Col span={23}>
          <Drawer
            title={<></>}
            placement='right'
            visible={open}
            width={515}
            closable={false}
            headerStyle={{border: 'none'}}
            bodyStyle={{paddingTop: 0}}
            extra={
              <Row gutter={[16, 16]} justify='end'>
                <Col>
                  <Tooltip placement='topLeft' title='Editar'>
                    <Button icon={<EditOutlined />} onClick={() => onEdit()} type='text'/>
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip placement='topLeft' title='Eliminar'>
                    <Button icon={<DeleteOutlined />} onClick={() => onDelete()} danger type='text' />
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip placement='topLeft' title='Cerrar'>
                    <Button icon={<CloseOutlined style={{fontSize: 25}} />} onClick={onClose} type='text' />
                  </Tooltip>
                </Col>
              </Row>
            }>
            <MeetingInfo meenting={meetings.find((item) => item.id === meenting.id) || meenting}/>
          </Drawer>
          <Card hoverable loading={loading}>
            <Row justify='end' style={{ marginBottom: 10 }}>
              {(View === 'week' || View === 'day') && <Button onClick={onSetNextGroupBy}>Por {buttonGroupBy}</Button>}
            </Row>
            <ReactBigCalendar
              events={renderEvents}
              view={View}
              onView={(view: View) => setView(view)}
              onSelectSlot={createEventCalendar}
              onSelectEvent={showDrawer}
              onEventDrop={updateEventCalendar}
              onEventResize={updateEventCalendar}
              resources={resources}
              resourceAccessor={resourceAccessor}
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
