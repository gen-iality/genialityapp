import React from 'react';
import { Tabs } from 'antd';
import ListadoJuegos from './listadoJuegos';
import LiveChat from './liveChat';
const { TabPane } = Tabs;

export default function ConferenceTabsComponent(props) {
  function callback(key) {
    console.log(key);
  }

  const { chat, surveys, games, attendees } = props;
  return (
    <Tabs defaultActiveKey='1' onChange={callback}>
      {games && (
        <TabPane tab='Juegos' key='1'>
          <ListadoJuegos {...props} />
        </TabPane>
      )}
      {chat && (
        <TabPane tab='Chat' key='2'>
          <LiveChat {...props} />
        </TabPane>
      )}
      {surveys && (
        <TabPane tab='Encuestas' key='4'>
          <span onClick={() => props.changeContentDisplayed('surveys')}>Encuestas</span>
        </TabPane>
      )}
      {attendees && (
        <TabPane tab='Asistentes' key='3'>
          Asistentes
        </TabPane>
      )}
    </Tabs>
  );
}
