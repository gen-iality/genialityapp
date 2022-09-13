import { Divider, List, Typography, Button, Spin } from 'antd';
import { ReadFilled } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { AgendaApi } from '@/helpers/request';
import dayjs from 'dayjs';
import { ExtendedAgendaType } from '@/Utilities/types/AgendaType';
import { activityContentValues } from '@/context/activityType/constants/ui';
import { ActivityType } from '@/context/activityType/types/activityType';

const data = [
  <div>
    <ReadFilled className='list-icon' />
    <span>Racing car sprays burning fuel into crowd.</span>
  </div>,
  'JAPANESE PRICESS MARRIED WITH COMMOONER',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

type TruncatedAgenda = {
  title: string,
  type?: ActivityType.ContentValue,
  timeString?: string,
};

interface ActivitiesListProps {
  eventId: string,
};

const ActivitiesList = (props: ActivitiesListProps) => {
  const {
    eventId, // The event ID
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [truncatedAgendaList, setTruncatedAgendaList] = useState<TruncatedAgenda[]>([]);

  useEffect(() => {
    if (!eventId) return;

    (async () => {
      setIsLoading(true);
      setTruncatedAgendaList([]);
      const { data: agendaList } = await AgendaApi.byEvent(eventId) as { data: ExtendedAgendaType[]};

      setTruncatedAgendaList((previous) => ([
        ...previous,
        ...agendaList.map((agenda) => {
          // Logic here
          let diff = Math.floor(Math.random() * 60*60);

          try {
            diff = dayjs(agenda.datetime_end).diff(dayjs(agenda.datetime_start));
          } catch (err) {
            console.error(err);
          }

          const result: TruncatedAgenda = {
            title: agenda.name,
            type: agenda.type?.name as ActivityType.ContentValue,
            timeString: dayjs(diff).format('h:mm').concat(' min'),
          };
          return result;
        })
      ]))

      setIsLoading(false);
    })();
  }, [eventId]);

  if (isLoading) return <Spin/>

  return (
    <List
      size='small'
      header={<h2>LECCIONES DEL CURSO</h2>}
      bordered
      dataSource={truncatedAgendaList}
      renderItem={(item: TruncatedAgenda) => (
        <List.Item className='shadow-box'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div>
              <ReadFilled className='list-icon' style={{marginRight: '1em'}} />
              <span>{item.title}</span>
            </div>
            <span
              style={{
                fontWeight: '100',
                fontSize: '1.2rem',
              }}
            >{item.timeString}</span>
          </div>
        </List.Item>
      )}
    />
  );
};
export default ActivitiesList;
