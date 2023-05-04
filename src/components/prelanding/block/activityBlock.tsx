import { CurrentEventContext } from '@/context/eventContext';
import { Avatar, Row, Space, Tag, Timeline, Typography, Grid } from 'antd';
import { useContext, useEffect, useState } from 'react';
import FlagCheckeredIcon from '@2fd/ant-design-icons/lib/FlagCheckered';
import { UserOutlined } from '@ant-design/icons';
import { PropsPreLanding } from '../types/Prelanding';
import { Agenda } from '../types';
import { obtenerActivity } from '../services';

const { useBreakpoint } = Grid;

const ActivityBlock = ({ preview }: PropsPreLanding) => {
  const mobilePreview = preview ? preview : '';
  const screens = useBreakpoint();
  const cEvent = useContext(CurrentEventContext);
  const [activities, setActivities] = useState<Agenda[]>([]);

  const bgColor = cEvent.value?.styles?.toolbarDefaultBg;
  const textColor = cEvent.value?.styles?.textMenu;

  useEffect(() => {
    if (!cEvent.value) return;
    obtenerActivity(cEvent?.value?._id, setActivities);
  }, [cEvent.value]);

  const determineType = (type: string) => {
    switch (type) {
      case 'url':
      case 'cargarvideo':
        return 'Video'

      case 'eviusMeet':
      case 'vimeo':
      case 'youTube':
        return 'Transmisión'
        
      case 'meeting':
        return 'Reunión'
      default:
        return '';
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
                    activity.hosts.map((host,index) => (
                      <Avatar key={`key-${index}`} size={'large'} icon={<UserOutlined />} src={host.image || ''} />
                    ))}
                </Avatar.Group>
                {activities.length < 2 && (
                  <span style={{ position: 'relative', float: 'right' }}>
                    <Tag
                      color={textColor}
                      style={{
                        userSelect: 'none',
                        color: bgColor,
                      }}>
                      {determineType(activity?.type?.name)}
                    </Tag>
                  </span>
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
