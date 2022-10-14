import { useState, useEffect, FunctionComponent } from 'react';

import { Result, Space, Typography, List } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { firestore, fireRealtime } from '@helpers/firebase';

import { UseEventContext as useEventContext } from '@context/eventContext';
import Logger from '@Utilities/logger';
import { AgendaApi } from '@helpers/request';
import type { ExtendedAgendaType } from '@Utilities/types/AgendaType';
import { useCurrentUser } from '@context/userContext';

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

    // allActivities.flat().map();
    // const allUserIds = result.docs.map((one) => {
    //   // Get the user ID
    //   if (!one.exists) return null;
    //   const data = one.data();
    //   return data.account_id as string;
    // });

    // const filteredUserIds = allUserIds.filter((value) => !!value) as string[];

    // setUserIds((previous) => [...previous, ...filteredUserIds]);
    // return 0;


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

  const Online: FunctionComponent<{ isOnline: boolean | null }> = ({ isOnline }) => {
    return (
      <div
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '8px',
          backgroundColor: isOnline === null ? 'gray' : isOnline ? 'green' : 'red',
        }}
      ></div>
    );
  };

  return (
    <>
    <section>
      <Typography.Title>Time tracking for this event</Typography.Title>
      <List
        header={'User session info'}
        dataSource={userSessionInfoList}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <Online isOnline={item.online}/>
            {' | '}
            {item.names}
            {/* TODO: Add more data representation, etc. */}
          </List.Item>
        )}
      />
    </section>
    </>
  );
}

export default TimeTracking;
