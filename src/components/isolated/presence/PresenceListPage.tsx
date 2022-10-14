import { useState, useEffect } from 'react';
import { List, Typography, Button } from 'antd';
import { LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { fireRealtime } from '@helpers/firebase';
import dayjs from 'dayjs';

export interface IPresenceListPageProps {
}

function hasTwoDate(item: any) {
  return (item.startTimestamp && item.endTimestamp);
}

function calcTime(item: any) {
  if (!item.startTimestamp) return 'bad finalize';
  if (!item.endTimestamp) return dayjs.unix(item.startTimestamp/1000).format('YYYY-MM-DD HH:mm:ss');
  return `${(item.endTimestamp - item.startTimestamp)/1000} seconds`;
}

export function PresenceListPage (props: IPresenceListPageProps) {
  const [isDeletingAllLogs, setIsDeletingAllLogs] = useState(false);

  const [beaconList, setBeaconList] = useState<any[]>([]);
  const [globalList, setGlobalList] = useState<any[]>([]);
  const [localList, setLocalList] = useState<any[]>([]);

  const onDeleteAllLogs = async () => {
    setIsDeletingAllLogs(true);
    const ref = fireRealtime.ref(`/user_sessions`);
    await ref.remove();
    setIsDeletingAllLogs(false);
  };

  const onDelete = async (collection: string, id: string) => {
    const ref = fireRealtime.ref(`/user_sessions/${collection}/paco`).child(`${id}`);
    await ref.remove();
  };

  const onDeleteBeacon = async (id: string) => {
    const ref = fireRealtime.ref(`/user_sessions/beacon`).child(`${id}`);
    await ref.remove();
  }

  useEffect(() => {
    const beaconRef = fireRealtime.ref(`/user_sessions/beacon`);
    const globalRef = fireRealtime.ref(`/user_sessions/global/paco`);
    const localRef = fireRealtime.ref(`/user_sessions/local/paco`);

    beaconRef.on('value', (snapshot) => {
      const data = snapshot.val() || {};
      setBeaconList(Object.entries(data));
    })

    globalRef.on('value', (snapshot) => {
      const data = snapshot.val() || {};
      setGlobalList(
        Object.entries(data)
          .map((entry: [string, any]) => ({ ...entry[1], _id: entry[0] }))
      );
    })

    localRef.on('value', (snapshot) => {
      const data = snapshot.val() || {};
      setLocalList(
        Object.entries(data)
          .map((entry: [string, any]) => ({ ...entry[1], _id: entry[0] }))
      );
    })
  }, []);

  return (
    <div>
      <Button
        danger
        onClick={onDeleteAllLogs}
      >
        Delete all logs
        {isDeletingAllLogs ? (<LoadingOutlined/>) : (<DeleteOutlined/>)}
      </Button>
      <List
        bordered
        header={'Beacon list'}
        dataSource={beaconList}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <Typography.Text>{item[0]}:</Typography.Text>
            {' '}
            <Typography.Text
              style={{ backgroundColor: item[1] ? '#33984A' : '#C53840' }}
            >
              {JSON.stringify(item[1])}
            </Typography.Text>
            <Button danger onClick={() => onDeleteBeacon(item[0])}><DeleteOutlined/></Button>
          </List.Item>
        )}
      />

      <List
        bordered
        header={'Global list'}
        dataSource={globalList}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <Typography.Text
              style={{
                textDecorationLine: hasTwoDate(item) ? 'line-through' : undefined,
              }}
            >
              {item.status}: {item.userId} ({calcTime(item)})
            </Typography.Text>
            <Button danger onClick={() => onDelete('global', item._id)}><DeleteOutlined/></Button>
          </List.Item>
        )}
      />
      
      <List
        bordered
        header={'Local list'}
        dataSource={localList}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <Typography.Text
              style={{
                textDecorationLine: hasTwoDate(item) ? 'line-through' : undefined,
              }}
            >
              {item.status}: {item.userId} ({calcTime(item)})
            </Typography.Text>
            <Button danger onClick={() => onDelete('local', item._id)}><DeleteOutlined/></Button>
          </List.Item>
        )}
      />
    </div>
  );
}
