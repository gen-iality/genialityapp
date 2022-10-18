import { fireRealtime } from '@helpers/firebase';
import Logger from '@Utilities/logger';
import { Typography } from 'antd';
import { useEffect, useState, type FunctionComponent } from 'react';

const { LOG, ERROR } = Logger('time-tracking-by-event');

export interface TimeTrackingByEventProps {
  eventId: string,
  eventName: string,
  userId: string,
}

const TimeTrackingByEvent: FunctionComponent<TimeTrackingByEventProps> = (props) => {
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    (async () => {
      //
      const localRef = await fireRealtime.ref(`user_sessions/local/${props.userId}`);
      const result = await localRef.get();
      LOG(result.exists())
      if (result.exists()) {
        const documents: any[] = result.val();
        setLoadedCount(documents.length);
      }
    })();
  }, []);

  return (
    <div>
      <Typography.Text strong>{props.eventName}</Typography.Text>
      {': '}
      {loadedCount === 0 ? 'Sin datos' : `${loadedCount} registros encontrados`}
    </div>
  );
};

export default TimeTrackingByEvent;
