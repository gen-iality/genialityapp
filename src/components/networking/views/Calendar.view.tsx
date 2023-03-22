import { Col, Row } from 'antd';
import moment from 'moment';
import React, { useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { NetworkingContext } from '../context/NetworkingContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { IEventCalendar, IMeeting } from '../interfaces/Meetings.interfaces';

const DragAndDropCalendar: any = withDragAndDrop(Calendar);

export default function MyCalendar() {
  const { meetings, updateMeeting, editMeenting , meetingSelectedInitial} = useContext(NetworkingContext);
  const localizer = momentLocalizer(moment);
  const now = () => new Date();

  const updateEventCalendar = ({ start, end, event }: IEventCalendar<IMeeting>) => {
    updateMeeting(event.id, { ...event, start: start.toString(), end: end.toString(), dateUpdated: Date.now() });
  };
  const createMeenting = ({ start, end }: IEventCalendar<IMeeting>) => {
    editMeenting({...meetingSelectedInitial, start: start.toString(), end: end.toString()})
  };

  const resourceFiltered = () => {
    return [
      {
          "attendance": "sin confirmar",
          "email": "carlos.rubio@evius.co",
          "key": "640f29c4fd1de4db43024f82",
          "id":"NqyAGXOPcXPNxALQV4h6",
          "name": "carlos andres rubio viloria"
      },
      {
          "email": "luis.ortiz@evius.co",
          "attendance": "sin confirmar",
          "id": "640f29e8fd1de4db43024f83",
          "name": "Luis Javier Ortiz Franco",
          "key": "640f29e8fd1de4db43024f83"
      },
      {
          "name": "Juan Camayo",
          "attendance": "sin confirmar",
          "id": "6377d905a940621c63131072",
          "email": "juan.camayo@evius.co",
          "key": "6377d905a940621c63131072"
      }
  ];
  };

  return (
    <>
      <Row justify='center' wrap gutter={[0, 16]}>
        <Col span={24}>
          <DragAndDropCalendar
            onSelectSlot={createMeenting}
            onSelectEvent={editMeenting}
            onEventDrop={updateEventCalendar}
            onEventResize={updateEventCalendar}

           /*  resources={resourceFiltered()}
            resourceAccessor="participants"
            resourceIdAccessor="id"
            resourceTitleAccessor="name" */

            localizer={localizer}
            getNow={now}

            selectable='ignoreEvents'
            events={meetings.map((meeting) => ({
              ...meeting,
              start: new Date(meeting.start),
              end: new Date(meeting.end),
            }))}
            titleAccessor='name'
            startAccessor='start'
            endAccessor='end'
            style={{ height: 500 }}
          />
        </Col>
      </Row>
    </>
  );
}
