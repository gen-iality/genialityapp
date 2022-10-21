import { useState, useEffect, useMemo, type FunctionComponent } from 'react';
import { Avatar, Card, Divider, Result, Select, Space, Typography } from 'antd';
import { fireRealtime } from '@helpers/firebase';
import Logger from '@Utilities/logger';
import Online from '@components/online/Online';
import { OrganizationApi, UsersApi } from '@helpers/request';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import TimeTrackingByEvent from './TimeTrackingByEvent';
import { type SessionPayload } from '@components/presence/types';

const { LOG, ERROR, WARN } = Logger('time-tracking-page');

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
  const [userId, setUserId] = useState<string | undefined>();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({} as OrganizationUserInfo);
  const [logs, setLogs] = useState<SessionPayload[]>([]);
  const [timeMode, setTimeMode] = useState<'minutes'|'hours'|'days'>('minutes');

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
        setUserId(member.user._id);

        // Get info about the beacon status
        try {
          const snapshot = await beaconRef.child(member.user._id).get();
          const beacon = snapshot.val();
          userInfo.isOnline = beacon;
          LOG('userId:', member.user._id, 'beacon:', beacon);
        } catch (err) {
          ERROR('Cannot get beacon status to userId', member.user._id, 'getting:', err);
        }

        const globalRef = await fireRealtime.ref(`user_sessions/global/${member.user._id}`);
        const result = await globalRef.get();
        const logDict = (result && result.exists()) ? result.val() : {};
        LOG(logDict);
        const filteredLogDict = Object.values(logDict)
          .filter((log: any) => log.status === 'offline')
          .filter((log: any) => log.startTimestamp !== undefined)
          .filter((log: any) => log.endTimestamp !== undefined);
        LOG(filteredLogDict.length, 'logs loaded', filteredLogDict);
        setLogs(filteredLogDict as SessionPayload[]);
      } catch (err) {
        ERROR('Cannot get the organization member to orgId and userId:', organization._id, memberId, 'getting:', err);
      }

      setUserInfo(userInfo);
      setIsLoading(false);
    })();
  }, [memberId]);

  const loggedTime = useMemo(() => {
    let divisor = 1;
    let description = 'minuto(s)';
    switch(timeMode) {
      case 'minutes':
        divisor = 60;
        description = 'minuto(s)';
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
        WARN('the prop', timeMode, 'is unknown');
    }
    const time = logs.map((log) => (log.endTimestamp - log.startTimestamp) / 1000 / divisor).reduce((a, b) => a+b, 0);
    return { time, description };    
  }, [logs, timeMode]);

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
    <>
    <Typography.Title>Usuario en {organization.name}</Typography.Title>
    <Card
      title={
        <Space direction='horizontal' style={{justifyContent: 'space-between', display: 'flex'}}>
          <Space direction='horizontal'>
            <Online isOnline={userInfo.isOnline}/>
            <Avatar
              style={{ backgroundColor: '#87d068' }}
              icon={<UserOutlined />}
              src={userInfo.picture}
            >
              {userInfo.name}
            </Avatar>
            <Typography.Text>{userInfo.name}</Typography.Text>
          </Space>
          <Space direction='horizontal'>
            <Typography.Text>Modo:</Typography.Text>
            <Select onChange={(mode) => setTimeMode(mode)} defaultValue={timeMode} style={{minWidth: 120}}>
              <Select.Option value='minutes'>Minutos</Select.Option>
              <Select.Option value='hours'>Horas</Select.Option>
              <Select.Option value='days'>Días</Select.Option>
            </Select>
          </Space>
        </Space>
      }
    >
      <Space
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
      </Space>
      <Space direction='vertical'>
        <Typography.Text>{logs.length} ingresos</Typography.Text>
        <Space direction='horizontal'>
          <Card>{loggedTime.time.toFixed(2)} {loggedTime.description}</Card>
        </Space>
      </Space>
      <Divider/>
      <Space direction='vertical'>
        <Typography.Text>{events.length} registros por área:</Typography.Text>
        {events.length === 0 && (
          <Typography.Text italic>Sin datos.</Typography.Text>
        )}
        {userId && (
          events.map((event, index) => (
            <TimeTrackingByEvent
              key={index}
              eventName={event.name}
              eventId={event._id}
              userId={userId}
              timeMode={timeMode}
            />
          ))
        )}
      </Space>
    </Card>
    </>
  );
};

export default OrganizationTimeTrackingPage;
