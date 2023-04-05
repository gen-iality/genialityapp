import React from 'react';
import { DailyMeeting } from '../../interfaces/my-agenda.interfaces';
import { Col, Row, Tabs } from 'antd';
import moment from 'moment';
import AcceptedCard from './AcceptedCard';

interface TabComponentProps {
  listTabPanels: DailyMeeting[];
  eventUser: any;
  enableMeetings: any;
  setCurrentRoom: any;
}

const TabComponent = ({ listTabPanels, eventUser, enableMeetings, setCurrentRoom }: TabComponentProps) => {
  return (
    <>
      <Tabs>
        {listTabPanels.map((dailyMeeting, eventDateIndex) => (
          <Tabs.TabPane
            tab={<div style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{dailyMeeting.date}</div>}
            key={`daily-meeting-${eventDateIndex}-${dailyMeeting.date}`}>
            <Row justify='center'>
              {dailyMeeting.meetings.map((meeting) => (
                <Col xxl={12}>
                  <AcceptedCard
                    key={`accepted-${meeting.id}`}
                    eventId={meeting.id}
                    eventUser={eventUser}
                    data={meeting}
                    enableMeetings={enableMeetings}
                    setCurrentRoom={setCurrentRoom}
                  />
                </Col>
              ))}
            </Row>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </>
  );
};

export default TabComponent;
