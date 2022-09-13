import { Divider, List, Typography, Button, Spin } from 'antd';
import { ReadFilled } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { AgendaApi } from '@/helpers/request';
import AgendaType from '@/Utilities/types/AgendaType';

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
      const { data: agendaList } = await AgendaApi.byEvent(eventId) as { data: AgendaType[]};

      setTruncatedAgendaList((previous) => ([
        ...previous,
        ...agendaList.map((agenda) => {
          // Logic here
          return {
            title: agenda.name
          };
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
        <List.Item className='shadow-box'>{item.title}</List.Item>
      )}
    />
  );
};
export default ActivitiesList;
