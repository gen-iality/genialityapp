import {  Tabs } from 'antd';
import Report from './report';
import NetworkingProvider from './context/NetworkingContext';
import { PropsNetworking } from './interfaces/Index.interfaces';
import MeentignView from './views/Meentigns.view';
import Calendar from './views/Calendar.view';
import Configuration from './views/Configuration.view';


export default function NetworkingPage({ eventId } : PropsNetworking) {  
  return (
   <NetworkingProvider>
     <Tabs defaultActiveKey={'1'}>
      
      <Tabs.TabPane tab='Agendar citas' key={1}>
        <MeentignView/>
      </Tabs.TabPane>

      <Tabs.TabPane tab='Calendario' key={2}>
        <Calendar/>
      </Tabs.TabPane> 
      
      <Tabs.TabPane tab='Configuracion' key={3}>
        <Configuration/>
      </Tabs.TabPane>

      <Tabs.TabPane tab='Reporte de networking' key={4}>
        <Report props={eventId} />
      </Tabs.TabPane>

    </Tabs>
   </NetworkingProvider>
  );
}
