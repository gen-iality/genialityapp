import { useState, useEffect, useMemo, type FunctionComponent, useCallback } from 'react';
import { Avatar, Card, Divider, Result, Select, Space, Typography, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { fireRealtime } from '@helpers/firebase';
import Logger from '@Utilities/logger';
import Online from '@components/online/Online';
import { OrganizationApi, UsersApi } from '@helpers/request';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { type SessionPayload } from '@components/presence/types';

const { LOG, ERROR, WARN } = Logger('time-tracking-page');

type TimeInfo = {
  time: number,
  description: string,
}

type RowDataByEvent = {
  key: string,
  name: string;
  logCount: number;
  timeInfo: TimeInfo;
};

export interface OrganizationTimeTrackingPageProps {
  match: any,
  org: any,
};

export type OrganizationUserInfo = {
  name: string,
  isOnline?: boolean,
  picture?: string,
};

const columns: ColumnsType<RowDataByEvent> = [
  {
    title: 'Evento',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Ingresos',
    dataIndex: 'logCount',
    key: 'logCount',
  },
  {
    title: 'Tiempo',
    dataIndex: 'timeInfo',
    key: 'timeInfo',
    render: (item: TimeInfo) => {
      return `${item.time.toFixed(3)} ${item.description}`;
    },
  },
];

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
  const [dataSource, setDataSource] = useState<RowDataByEvent[]>([]);

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

  useEffect(() => {
    if (!events.length) return;
    if (!userId) return;

    const request = async () => {
      const localRef = await fireRealtime.ref(`user_sessions/local/${userId}`);
      const result = await localRef.get();
      if (!result.exists()) {
        LOG('no have user sessions for local');
        return;
      }

      const allDocuments: {[x: string]: SessionPayload} = result.val();

      const tableList: typeof dataSource = [];

      // We need all logs that are offline, have time, are type activity
      const filteredAllDocuments = Object.values(allDocuments)
        .filter((document) => document.status === 'offline')
        .filter((document) => document.startTimestamp !== undefined)
        .filter((document) => document.endTimestamp !== undefined)
        .filter((document) => document.data?.type === 'activity')
        .filter((document) => document.data?.eventId !== undefined)
        .filter((document) => document.data?.activityId !== undefined)

      for (const event of events) {
        const logsByEvent = filteredAllDocuments
          .filter((document) => document.data?.eventId === event._id)
        LOG(event._id, 'has', logsByEvent.length, 'logs');

        // Create stats
        const rowData: RowDataByEvent = {
          key: event._id,
          name: event.name,
          logCount: logsByEvent.length,
          timeInfo: processTime(logsByEvent, timeMode),
        }
        tableList.push(rowData);
      }

      const sorttedTableList = tableList.sort((a, b) => {
        if (a.timeInfo.time > b.timeInfo.time) return 1;
        if (a.timeInfo.time < b.timeInfo.time) return -1;
        return 0;
      }).reverse();

      setDataSource(sorttedTableList);
    };
    request().catch((err) => ERROR('error to request events', err));
  }, [events, timeMode]);

  /**
   * Given logs and timeMode, will return an object with information about time
   */
  const processTime = useCallback((_logs: typeof logs, _timeMode: typeof timeMode): TimeInfo => {
    let divisor = 1;
    let description = 'minuto(s)';
    switch(_timeMode) {
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
        WARN('the prop', _timeMode, 'is unknown');
    }
    const time = _logs.map((log) => (log.endTimestamp - log.startTimestamp) / 1000 / divisor).reduce((a, b) => a+b, 0);
    return { time, description };  
  }, []);

  const loggedTime: TimeInfo = useMemo(() => {
    return processTime(logs, timeMode);
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
        {events.length === 0 ? (
          <Typography.Text italic>Sin datos.</Typography.Text>
        ) : (
          <Table columns={columns} dataSource={dataSource} />
        )}
      </Space>
    </Card>
    </>
  );
};

export default OrganizationTimeTrackingPage;
