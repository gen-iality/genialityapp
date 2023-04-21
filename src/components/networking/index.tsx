import React from 'react';
import useGetConfigNetworking from './hooks/useGetConfigNetworking';
import { UseUserEvent } from '@/context/eventUserContext';
import ListEventUserWithContext from './landing.view';
import { Button, Result } from 'antd';

export default function networkingIndex(key: string) {
  const cUser = UseUserEvent();
  const eventId = cUser?.value?.event_id;
  const { globalConfig } = useGetConfigNetworking(eventId);
  if (globalConfig?.show) {
    return (<ListEventUserWithContext key={key} />)
  } else {
    return (<Result
      status="403"
      title="Networking no se encuentra visible en este momento."
      subTitle="Sí, necesita acceso, por favor, comunicarse con el administrador."
    />)
  }
}
