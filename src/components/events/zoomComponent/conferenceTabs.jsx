import React from 'react';
import { Tabs } from 'antd';
import ListadoJuegos from './listadoJuegos';
import LiveChat from './liveChat';
const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

export default function ConferenceTabsComponent(props) {
  return (
    <Tabs defaultActiveKey='1' onChange={callback}>
      <TabPane tab='Juegos' key='1'>
        <ListadoJuegos {...props} />
      </TabPane>
      <TabPane tab='Chat' key='2'>
        <LiveChat {...props} />
      </TabPane>
      <TabPane tab='Asistentes' key='3'>
        Asistentes
      </TabPane>
      <TabPane tab='Encuestas' key='4'>
        Encuestas
      </TabPane>
    </Tabs>
  );
}
