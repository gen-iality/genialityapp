import {  Tabs } from 'antd';
import Report from '../report';
import NetworkingProvider from './context/NetworkingContext';
import Meentign from './views/meentigns';
interface Props {
	eventId: string;
}

export default function Networking({ eventId } : Props) {  
  return (
   <NetworkingProvider>
     <Tabs defaultActiveKey={'1'}>
      
      <Tabs.TabPane tab='Agendar citas' key={1}>
        <Meentign/>
      </Tabs.TabPane>

      <Tabs.TabPane tab='Report de networking' key={2}>
        <Report props={eventId} />
      </Tabs.TabPane>

    </Tabs>
   </NetworkingProvider>
  );
}
