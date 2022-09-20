import { CurrentEventContext } from '@/context/eventContext';
import { firestore } from '@/helpers/firebase';
import { AgendaApi } from '@/helpers/request';
import { Avatar, Row, Space, Tag, Timeline, Typography, Grid } from 'antd';
import { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import FlagCheckeredIcon from '@2fd/ant-design-icons/lib/FlagCheckered';
import { UserOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

const ActivityBlock = ({ preview }) => {
  const mobilePreview = preview ? preview : '';
  const screens = useBreakpoint();
  const cEvent = useContext(CurrentEventContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const bgColor = cEvent.value?.styles?.toolbarDefaultBg;
  const textColor = cEvent.value?.styles?.textMenu;

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
            color={textColor}
            style={{
              userSelect: 'none',
              color: bgColor,
            }}>
            Video
          </Tag>
        );
      case 'eviusMeet':
      case 'vimeo':
      case 'youTube':
        return (
          <Tag
            color={textColor}
            style={{
              userSelect: 'none',
              color: bgColor,
            }}>
            Transmisión
          </Tag>
        );
      case 'meeting':
        return (
          <Tag
            color={textColor}
            style={{
              userSelect: 'none',
              color: bgColor,
            }}>
            Reunión
          </Tag>
        );
      default:
        return <></>;
    }
  };
  return (
    <Row style={{ height: '100%' }} justify={activities.length < 2 ? 'start' : 'center'} align='middle'>
      <Timeline
        style={{ width: '100%' }}
        mode={screens.xs || mobilePreview === 'smartphone' ? 'left' : activities.length < 2 ? 'left' : 'alternate'}>
        {activities.map((activity, index) => {
          return (
            <Timeline.Item
              color={textColor}
              label={
                activities.length > 1
                  ? !screens.xs || mobilePreview === 'smartphone'
                    ? activity?.type && determineType(activity.type.name)
                    : null
                  : null
              }
              style={index === 0 ? { marginTop: '20px' } : {}}
              dot={
                activities.length === index + 1 && <FlagCheckeredIcon style={{ fontSize: '20px', color: textColor }} />
              }
              key={activity?._id}>
              <Space
                size={4}
                direction='vertical'
                style={{
                  padding: '20px',
                  borderRadius: '5px',
                  transition: 'all 500ms ease-in-out',
                  backgroundColor: 'transparent',
                  width: activities.length < 2 ? '100%' : 'auto',
                }}>
                <Space size={0} direction='vertical'>
                  <Typography.Text
                    style={{
                      userSelect: 'none',
                      color: textColor,
                      fontWeight: '700',
                    }}>
                    {activity?.datetime_start}
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      userSelect: 'none',
                      color: textColor,
                      fontWeight: '500',
                    }}>
                    {activity?.name}
                  </Typography.Text>
                </Space>
                <Avatar.Group maxCount={3} maxStyle={{ color: textColor, backgroundColor: bgColor }}>
                  {activity.hosts.length > 0 &&
                    activity.hosts.map((host) => (
                      <Avatar size={'large'} icon={<UserOutlined />} src={host.image && host.image} />
                    ))}
                </Avatar.Group>
                {activities.length < 2 && (
                  <span style={{ position: 'relative', float: 'right' }}>{determineType(activity?.type?.name)}</span>
                )}
              </Space>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Row>
  );
};

export default ActivityBlock;
