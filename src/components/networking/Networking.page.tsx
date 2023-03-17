import {  Tabs } from 'antd';
import Report from './report';
import NetworkingProvider from './context/NetworkingContext';
import { PropsNetworking } from './interfaces/Index.interfaces';
import MeentignView from './views/Meentigns.view';


export default function NetworkingPage({ eventId } : PropsNetworking) {  
  return (
   <NetworkingProvider>
     <Tabs defaultActiveKey={'1'}>
      
      <Tabs.TabPane tab='Agendar citas' key={1}>
        <MeentignView/>
      </Tabs.TabPane>

    {/*   <Tabs.TabPane tab='Calendario' key={2}>
        <MeentignView/>
      </Tabs.TabPane> */}

      <Tabs.TabPane tab='Reporte de networking' key={3}>
        <Report props={eventId} />
      </Tabs.TabPane>

    </Tabs>
   </NetworkingProvider>
  );
}
