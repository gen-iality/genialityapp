import { SessionPayload } from '@components/presence/types';
import { fireRealtime } from '@helpers/firebase';
import Logger from '@Utilities/logger';
import { Typography, Card, Space } from 'antd';
import { useEffect, useMemo, useState, type FunctionComponent } from 'react';

const { LOG, ERROR, WARN } = Logger('time-tracking-by-event');

export interface TimeTrackingByEventProps {
  eventId: string,
  eventName: string,
  userId: string,
  timeMode: 'seconds' | 'hours' | 'days',
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

  const loggedTime = useMemo(() => {
    let divisor = 1;
    let description = 'segundo(s)';
    switch(props.timeMode) {
      case 'seconds':
        divisor = 1;
        description = 'segundo(s)';
        break;
      case 'hours':
        divisor = 3600;
        description = 'hora(s)';
        break;
      case 'days':
        divisor = 3600*24;
        description = 'día(s)';
        break;
      default:
        WARN('the prop', props.timeMode, 'is unknown');
    }
    const time = loadSessionPayloadItems.map((log) => (log.endTimestamp - log.startTimestamp) / 1000 / divisor).reduce((a, b) => a+b, 0);
    return { time, description };    
  }, [loadSessionPayloadItems, props.timeMode]);

  return (
    <Card title={props.eventName}>
      <Space direction='vertical'>
        <Typography.Text>
          {loadSessionPayloadItems.length === 0 ? 'Sin datos' : `${loadSessionPayloadItems.length} registros encontrados`}
        </Typography.Text>
        {loadSessionPayloadItems.length > 0 && (
          <Space direction='horizontal'>
          <Card>{loggedTime.time < 10 ? loggedTime.time.toPrecision(4) : loggedTime.time} {loggedTime.description}</Card>
          </Space>
        )}
      </Space>
    </Card>
  );
};

export default TimeTrackingByEvent;
