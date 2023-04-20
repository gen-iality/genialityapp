import { Tabs, Typography } from 'antd';
import Report from './report';
import NetworkingProvider, { NetworkingContext } from './context/NetworkingContext';
import { PropsNetworking, networkingGlobalConfig } from './interfaces/Index.interfaces';
import MeentignView from './views/Meentigns.view';
import Calendar from './views/Calendar.view';
import Configuration from './views/Configuration.view';
import { useContext, useEffect, useState } from 'react';
import Initial from './views/Initial.view';
import { UseUserEvent } from '@/context/eventUserContext';
import Header from '@/antdComponents/Header';
import * as serviceConfig from './services/configuration.service';
import Loading from '@/components/profile/loading';


export default function NetworkingPage({ eventId }: PropsNetworking) {
  const [globalConfig, setGlogbalConfig] = useState<null | networkingGlobalConfig>(null);
  useEffect(() => {
    if (!!eventId) {
      const unsubscribeConfig = serviceConfig.ListenConfig(eventId, setGlogbalConfig);
      return () => {
        unsubscribeConfig();
      };
    }
  }, [])

  return (
    <NetworkingProvider>
      <Header 
        title='Networking'
        back={!globalConfig?.active}
      />
      {globalConfig?.active ? (
        <Tabs defaultActiveKey={'5'}>
          <Tabs.TabPane tab='General' key={5}>
            <Initial {...globalConfig}/>
          </Tabs.TabPane>

          <Tabs.TabPane tab='Configuración' key={3}>
            <Configuration />
          </Tabs.TabPane>

          <Tabs.TabPane tab='Agendar citas' key={1}>
            <MeentignView />
          </Tabs.TabPane>

          <Tabs.TabPane tab='Calendario' key={2}>
            <Calendar />
          </Tabs.TabPane>

          <Tabs.TabPane tab='Reporte de networking' key={4}>
            <Report props={eventId} />
          </Tabs.TabPane>
        </Tabs>
      ) : (
       <>
        {/* <Header title={'Networking'} description={''} back /> */}
        {/* <div  className='animate__animated animate__backInDown' >  */}
        <Initial/>
        {/* </div> */}
       </>
      )}
    </NetworkingProvider>
  );
}
