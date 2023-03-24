import { Col, Row } from 'antd';
import moment from 'moment';
import React, { useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { NetworkingContext } from '../context/NetworkingContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { IEventCalendar, IMeeting } from '../interfaces/Meetings.interfaces';
import { meetingSelectedInitial } from '../utils/utils';

const DragAndDropCalendar: any = withDragAndDrop(Calendar);

export default function MyCalendar() {
  const localizer = momentLocalizer(moment);
  const now = () => new Date();
  const { 
    meetings, 
    updateMeeting, 
    editMeenting, 
    setMeentingSelect, 
    openModal,
    observers
   } = useContext(NetworkingContext);

  {/*actualziar reuniones con el evento "drop" del calendario*/}
  const updateEventCalendar = ({ start, end, event }: IEventCalendar<IMeeting>) => {
    updateMeeting(event.id, { ...event, start: start.toString(), end: end.toString(), dateUpdated: Date.now() });
  };
  
  {/*crear reuniones desde el calendario*/}
  const createMeenting = ({ start, end }: IEventCalendar<IMeeting>) => {
    setMeentingSelect({ ...meetingSelectedInitial, start: start.toString(), end: end.toString() });
    openModal();
  };

  const algo = () => {
   const a = meetings.map((meeting) => ({
      ...meeting,
       start: new Date(meeting.start),
       end: new Date(meeting.end),
       assigned : meeting.participants.map((item) => item.id)
   }))
   return a
  }

  return (
    <>
      <Row justify='center' wrap gutter={[0, 16]}>
        <Col span={24}>
          <DragAndDropCalendar
            events={algo()}
            
            onSelectSlot={createMeenting}
            onSelectEvent={editMeenting}
            onEventDrop={updateEventCalendar}
            onEventResize={updateEventCalendar}

            resources={observers.length ? observers : undefined}
            resourceAccessor={'assigned'}
            resourceIdAccessor='value'
            resourceTitleAccessor='label'

            localizer={localizer}
            getNow={now}
            selectable='ignoreEvents'

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
