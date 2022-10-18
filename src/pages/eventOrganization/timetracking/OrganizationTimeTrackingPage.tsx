import { useState, useEffect, type FunctionComponent } from 'react';
import { Avatar, Result, Space, Typography } from 'antd';
import { fireRealtime } from '@helpers/firebase';
import Logger from '@Utilities/logger';
import Online from '@components/online/Online';
import { OrganizationApi, UsersApi } from '@helpers/request';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import TimeTrackingByEvent from './TimeTrackingByEvent';

const { LOG, ERROR } = Logger('time-tracking-page');

export interface OrganizationTimeTrackingPageProps {
  match: any,
  org: any,
};

export type OrganizationUserInfo = {
  name: string,
  isOnline?: boolean,
  picture?: string,
};

const OrganizationTimeTrackingPage: FunctionComponent<OrganizationTimeTrackingPageProps> = (props) => {
  const {
    org: organization,
  } = props;
  const [memberId] = useState(props.match.params.memberIdParam);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({} as OrganizationUserInfo);

  useEffect(() => {
    if (!memberId) return;
    if (!organization?._id) return;
    const beaconRef = fireRealtime.ref('user_sessions/beacon');
    (async () => {
      // Get all events
      try {
        const allEvents = await OrganizationApi.events(organization._id);
        setEvents(allEvents.data);
      } catch (err) {
        ERROR('Cannot get all organization events:', err);
      }

      // Get the member data
      try {
        const member = await OrganizationApi.getEpecificUser(organization._id, memberId);
        userInfo.name = member.user.names;
        userInfo.picture = member.user.picture;

        // Get info about the beacon status
        try {
          const snapshot = await beaconRef.child(member.user._id).get();
          const beacon = snapshot.val();
          userInfo.isOnline = beacon;
          LOG('userId:', member.user._id, 'beacon:', beacon);
        } catch (err) {
          ERROR('Cannot get beacon status to userId', member.user._id, 'getting:', err);
        }
      } catch (err) {
        ERROR('Cannot get the organization member to orgId and userId:', organization._id, memberId, 'getting:', err);
      }

      setUserInfo(userInfo);
      setIsLoading(false);
    })();
  }, [memberId]);

  if (isLoading) {
    return (
      <Result
        title='Cargando...'
        subTitle={'Recuperando información del miembro'}
        icon={<LoadingOutlined/>}
      />
    );
  }

  return (
    <Space direction='vertical'>
    <Typography.Title>Usuario en {organization.name}</Typography.Title>
    <Space
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <Avatar
        style={{ backgroundColor: '#87d068' }}
        icon={<UserOutlined />}
        src={userInfo.picture}
      >
        {userInfo.name}
      </Avatar>
      <Typography.Text>{userInfo.name}</Typography.Text>
      <Online isOnline={userInfo.isOnline}/>
    </Space>
    {events.map((event, index) => (
      <TimeTrackingByEvent key={index} eventName={event.name} eventId={event._id} userId={memberId} />
    ))}
    </Space>
  );
};

export default OrganizationTimeTrackingPage;
