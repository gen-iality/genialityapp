import { CurrentEventContext } from '@/context/eventContext';
import { firestore } from '@/helpers/firebase';
import { AgendaApi } from '@/helpers/request';
import { Card, Col, Popover, Row, Space, Spin, Tag, Timeline, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import FlagCheckeredIcon from '@2fd/ant-design-icons/lib/FlagCheckered';

const ActivityBlock = () => {
  const cEvent = useContext(CurrentEventContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const mode = 'alternate';

  useEffect(() => {
    if (!cEvent.value) return;
    setLoading(true);
    obtenerActivity();
    async function obtenerActivity() {
      const { data } = await AgendaApi.byEvent(cEvent.value._id);
      const listActivity = [];
      if (data) {
        await Promise.all(
          data.map(async (activity) => {
            const dataActivity = await firestore
              .collection('events')
              .doc(cEvent?.value?._id)
              .collection('activities')
              .doc(activity._id)
              .get();
            if (dataActivity.exists) {
              let { habilitar_ingreso, isPublished, meeting_id, platform } = dataActivity.data();
              const activityComplete = { ...activity, habilitar_ingreso, isPublished, meeting_id, platform };
              listActivity.push(activityComplete);
            } else {
              let updatedActivityInfo = {
                habilitar_ingreso: true,
                isPublished: true,
                meeting_id: null,
                platform: null,
              };
              const activityComplete = { ...activity, updatedActivityInfo };
              listActivity.push(activityComplete);
            }
          })
        );
        //MOSTRAR SOLO ACTIVIDADES PUBLICADAS
        let filterActivity = listActivity?.filter(
          (activity) => activity.isPublished === true || activity.isPublished === undefined
        );
        //ORDENAR ACTIVIDADES
        filterActivity = filterActivity.sort(
          (a, b) => moment(a.datetime_start).toDate() - moment(b.datetime_start).toDate()
        );

        setActivities(filterActivity);
        setLoading(false);
      } else {
        setActivities([]);
        setLoading(false);
      }
      //console.log('DATA NEW==>', data);
    }
  }, [cEvent.value]);

  console.log('activities', activities);

  const determineType = (type) => {
    console.log('type', type);
    switch (type) {
      case 'url':
      case 'cargarvideo':
        return (
          <Tag
            color='#87d068'
            style={{
              userSelect: 'none',
            }}>
            Video
          </Tag>
        );
      case 'eviusMeet':
      case 'vimeo':
      case 'youTube':
        return (
          <Tag
            color='#87d068'
            style={{
              userSelect: 'none',
            }}>
            Transmisión
          </Tag>
        );
      case 'meeting':
        return (
          <Tag
            color='#87d068'
            style={{
              userSelect: 'none',
            }}>
            Reunión
          </Tag>
        );
      default:
        return <></>;
    }
  };
  return (
    <Row style={{ height: '100%' }} justify='center' align='middle'>
      <Timeline style={{ width: '100%' }} mode={mode}>
        {activities.map((activity, index) => {
          return (
            <Timeline.Item
              label={activity?.type && determineType(activity.type.name)}
              style={index === 0 ? { marginTop: '20px' } : {}}
              dot={activities.length === index + 1 && <FlagCheckeredIcon style={{ fontSize: '20px' }} />}
              key={activity?._id}>
              <Popover
                overlayStyle={{ maxWidth: '400px' }}
                content={
                  activity?.description !== '<p><br></p>' && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: activity?.description,
                      }}></div>
                  )
                }
                title={null}>
                <Space
                  className='ant-card-grid-hoverable'
                  size={0}
                  direction='vertical'
                  style={{
                    padding: '10px',
                    border: '1px solid #0000000f',
                    borderRadius: '5px',
                    transition: 'all 500ms ease-in-out',
                  }}>
                  <Typography.Text
                    strong
                    style={{
                      userSelect: 'none',
                    }}>
                    {activity?.datetime_start}
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      userSelect: 'none',
                    }}>
                    {activity?.name}
                  </Typography.Text>
                </Space>
              </Popover>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Row>
  );
};

export default ActivityBlock;
