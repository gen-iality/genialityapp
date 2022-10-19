import { useState, useEffect } from 'react';

import { Result, Space, Typography, List, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { firestore, fireRealtime } from '@helpers/firebase';

import { useEventContext } from '@context/eventContext';
import Logger from '@Utilities/logger';
import { AgendaApi } from '@helpers/request';
import type { ExtendedAgendaType } from '@Utilities/types/AgendaType';
import { useCurrentUser } from '@context/userContext';

import Online from '@components/online/Online';

type UserSessionInfo = {
  userId: string;
  names: string,
  online: boolean | null;
};

export interface TimeTrackingProps {
  matchUrl: string,
  event: any,
};

const { LOG, ERROR } = Logger('time-tracking');

function TimeTracking(props: TimeTrackingProps) {
  const [subtitleLoading, setSubtitleLoading] = useState('Por favor espere');
  const [isLoading, setIsLoading] = useState(true);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [userSessionInfoList, setUserSessionInfoList] = useState<UserSessionInfo[]>([]);
  const cEvent = useEventContext();
  const cUser = useCurrentUser();

  const history = useHistory();

  const requestAllAgendaItems = async (eventId: string) => {
    const result = await AgendaApi.byEvent(eventId) as { data: ExtendedAgendaType[] };
    return result.data;
  };

  const requestAllAttendees = async (eventId: string) => {
    const activityList = await requestAllAgendaItems(eventId);
    const allActivities: any[] = await Promise.all(
      activityList.map(async (activity) => {
        const result = await firestore.collection(`${activity._id}_event_attendees`)
          .where('checked_in', '==', true).get();
        return result.docs.map((doc) => doc.data());
      })
    );

    const takenIds: any[] = [];
    const uniqueActivities = allActivities.flat().filter((activity) => {
      if (takenIds.includes(activity.account_id)) return false;
      takenIds.push(activity.account_id);
      return true;
    })
    LOG(uniqueActivities.length, 'attendess');
    setAttendees(uniqueActivities);
  };

  useEffect(() => {
    if (!cEvent.value?._id) return;
    if (!cUser.value?._id) return;

    setSubtitleLoading('Espere mientras se carga el listado de asistentes');

    (async () => {
      await requestAllAttendees(cEvent.value?._id);
      LOG('all users loaded');

      setSubtitleLoading('Espere mientras se procesa los asistentes');
    })();
  }, [cEvent.value, cUser.value]);

  useEffect(() => {
    const beaconRef = fireRealtime.ref('user_sessions/beacon');
    (async () => {
      const data: UserSessionInfo[] = [];
      for (let i = 0; i<attendees.length; i++) {
        const attendee = attendees[i];
        const snapshot = await beaconRef.child(attendee.account_id).get();
        const beacon = snapshot.val();
        LOG('userId:', attendee.account_id, 'beacon:', beacon);
        data.push({
          userId: attendee.account_id,
          names: attendee.user.names,
          online: beacon,
        });
      }

      setUserSessionInfoList(data);
      setSubtitleLoading('Mostrando datos');

      setIsLoading(false);
    })();
  }, [attendees]);

  if (isLoading) {
    return (
      <>
      <Result
        title='Cargando...'
        subTitle={subtitleLoading}
        icon={<LoadingOutlined/>}
      />
        {attendees.length} cargados.
      </>
    );
  }

  return (
    <>
    <section>
      <Typography.Title>Time tracking for this event</Typography.Title>
      <Button
        onClick={() => {
          if (cEvent.value?._id) {
            setIsLoading(true);
            requestAllAttendees(cEvent.value._id);
          }
        }}
      >Recargar</Button>
      <List
        header={'User session info'}
        dataSource={userSessionInfoList}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <Space>
              <Online isOnline={item.online}/>
              {item.names}
              {/* TODO: Add more data representation, etc. */}
            </Space>
          </List.Item>
        )}
      />
    </section>
    </>
  );
}

export default TimeTracking;
