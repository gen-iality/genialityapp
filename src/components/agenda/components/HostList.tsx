import { Divider, List, Typography, Button, Avatar } from 'antd';
import { ReadFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useEventContext } from '@context/eventContext';
import { SpeakersApi, ActivityBySpeaker, CategoriesAgendaApi, ToolsApi } from '@helpers/request';

const dataDuration = [
  {
    title: '1 hora de contenido',
  },
  {
    title: '6 horas de práctica',
  },
];

const dataTooling = [
  {
    title: 'Trello',
  },
  {
    title: 'Excel',
  },
];

const HostList = () => {
  const cEvent = useEventContext();
  const [speakers, setSpeakers] = useState([]);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    let speakersApi = [];

    (async () => {
      speakersApi = await SpeakersApi.byEvent(cEvent.value._id);
      console.log('900.speakers', speakersApi);
      setSpeakers(speakersApi);
    })();
  }, []);

  useEffect(() => {
    let toolsApi = [];

    (async () => {
      toolsApi = await ToolsApi.byEvent(cEvent.value._id);
      console.log('900.tools', toolsApi);
      setTools(toolsApi);
    })();
  }, []);

  return (
    <>
      <List
        size='small'
        header={<h3>DURACIÓN</h3>}
        dataSource={dataDuration}
        renderItem={(item) => (
          <List.Item>
            {
              <>
                <p style={{ margin: 0, padding: 0, lineHeight: 1 }}>{item.title}</p>
              </>
            }
          </List.Item>
        )}
      />
      <List
        size='small'
        header={<h3>HERRAMIENTAS</h3>}
        dataSource={tools}
        renderItem={(item) => (
          <List.Item>
            {
              <>
                <p style={{ margin: 0, padding: 0, lineHeight: 1 }}>{item.name}</p>{' '}
              </>
            }
          </List.Item>
        )}
      />
      <List
        size='small'
        header={<h3>COLABORADORES</h3>}
        dataSource={speakers}
        renderItem={(item: any) => (
          <List.Item className='shadow-box'>
            <List.Item.Meta
              avatar={<Avatar src={item.image} />}
              description={
                <>
                  <p style={{ margin: 0, padding: 0, lineHeight: 1 }}>{item.name}</p>
                  <p style={{ margin: 0, padding: 0, lineHeight: 1 }}>Profesor</p>
                </>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};
export default HostList;
