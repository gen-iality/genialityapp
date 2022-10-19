import { SessionPayload } from '@components/presence/types';
import { fireRealtime } from '@helpers/firebase';
import Logger from '@Utilities/logger';
import { Typography, Card, Space } from 'antd';
import { useEffect, useMemo, useState, type FunctionComponent } from 'react';

const { LOG, ERROR } = Logger('time-tracking-by-event');

export interface TimeTrackingByEventProps {
  eventId: string,
  eventName: string,
  userId: string,
}

const TimeTrackingByEvent: FunctionComponent<TimeTrackingByEventProps> = (props) => {
  const [loadSessionPayloadItems, setLoadSessionPayloadItems] = useState<SessionPayload[]>([]);

  useEffect(() => {
    LOG(props.eventId);
    (async () => {
      //
      const localRef = await fireRealtime.ref(`user_sessions/local/${props.userId}`);
      const result = await localRef.get();
      LOG(result.exists())
      if (result.exists()) {
        const allDocuments: {[x: string]: SessionPayload} = result.val();
        LOG(allDocuments);
        // Load all logs that its data.eventId does match with the eventId prop.
        setLoadSessionPayloadItems(
          Object.values(allDocuments).filter((document) => document.data?.eventId === props.eventId),
        );
      }
    })();
  }, []);

  const loggedSeconds = useMemo(() => {
    return loadSessionPayloadItems.map((log) => (log.endTimestamp - log.startTimestamp) / 1000).reduce((a, b) => a+b, 0);
  }, [loadSessionPayloadItems]);

  const loggedHours = useMemo(() => loggedSeconds/3600, [loggedSeconds]);

  return (
    <Card title={props.eventName}>
      <Space direction='vertical'>
        <Typography.Text>
          {loadSessionPayloadItems.length === 0 ? 'Sin datos' : `${loadSessionPayloadItems.length} registros encontrados`}
        </Typography.Text>
        {loadSessionPayloadItems.length > 0 && (
          <Space direction='horizontal'>
          <Card>{loggedSeconds.toPrecision(4)} segundos</Card>
          <Card>{loggedHours.toPrecision(2)} horas</Card>
          </Space>
        )}
      </Space>
    </Card>
  );
};

export default TimeTrackingByEvent;
