import { Card, Space, Typography, Badge } from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import './videoCard.css';
import { useEventContext } from '@context/eventContext';
import ReactPlayer from 'react-player';
import { CalendarOutlined } from '@ant-design/icons';
import { useState } from 'react';

const VideoCard = ({ activity, event, bordered, right, loading, shape }) => {
  const { Meta } = Card;
  const { Paragraph } = Typography;
  const forma = shape || 'horizontal';
  const [duration, setDuration] = useState(0);

  const handleDuration = (duration) => {
    console.log('onDuration', duration);
    setDuration(duration);
  };

  function videoDuration(seconds) {
    var hour = Math.floor(seconds / 3600);
    var minute = Math.floor((seconds / 60) % 60);
    var second = seconds % 60;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    if (hour == 0) return minute + ':' + second;
    return hour + ':' + minute + ':' + second;
  }

  return (
    <Link to={`/landing/${activity.event_id}/activity/${activity._id}`}>
      {forma === 'horizontal' ? (
        <div className='animate__animated animate__fadeIn'>
          <Card
            className={'horizontal'}
            bordered={bordered}
            loading={loading}
            style={{ width: '100%' }}
            cover={
              <ReactPlayer
                style={{ paddingTop: '2px' }}
                width={'160px'}
                height={'100px'}
                url={activity.video}
                onDuration={handleDuration}
              />
            }
            actions={right}
            bodyStyle={{ paddingRight: '0px' }}>
            <Meta
              style={{}}
              description={
                <div>
                  <Space direction='vertical' size={2}>
                    <Paragraph strong ellipsis={{ rows: 2 }}>
                      {activity.name}
                    </Paragraph>
                    <span style={{ fontSize: '10px' }}>
                      <Space size='small'>
                        <CalendarOutlined style={{ fontSize: '14px' }} />
                        <time>{dayjs(activity.datetime_end).format('DD MMM YYYY')}</time>
                      </Space>
                    </span>
                    <span
                      style={{
                        padding: '2px 8px 2px 8px',
                        backgroundColor: '#333F44',
                        color: '#ffffff',
                        borderRadius: '2px',
                        fontSize: '12px',
                      }}>
                      {videoDuration(parseInt(duration))}
                    </span>
                  </Space>
                </div>
              }
            />
          </Card>
        </div>
      ) : (
        <Badge.Ribbon text={videoDuration(parseInt(duration))}>
          <Card
            bordered={true}
            hoverable={true}
            bodyStyle={{ padding: '10px 8px 10px 8px' }}
            style={{ width: '100%', borderRadius: '8px' }}
            cover={
              <ReactPlayer
                /* light={duration !== 0 ? true : false} */
                width={'100%'}
                height={'150px'}
                url={activity.video}
                onDuration={handleDuration}
              />
            }>
            <Meta
              description={
                <div>
                  <Space direction='vertical' size={-10}>
                    <Paragraph strong ellipsis={{ rows: 2 }}>
                      {activity.name}
                    </Paragraph>
                    <span style={{ fontSize: '10px' }}>
                      <Space size='small'>
                        <CalendarOutlined style={{ fontSize: '14px' }} />
                        <time>{dayjs(activity.datetime_end).format('DD MMM YYYY')}</time>
                      </Space>
                    </span>
                  </Space>
                </div>
              }
            />
          </Card>
        </Badge.Ribbon>
      )}
    </Link>
  );
};

export default VideoCard;
