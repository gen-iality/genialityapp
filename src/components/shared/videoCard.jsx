import React from 'react';
import { Card, Space, Typography, Badge } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import Moment from 'moment';
import './videoCard.css';

import ReactPlayer from 'react-player';
import EventImage from '../../eventimage.png';

const videoCard = ({ activity, event, bordered, right, loading }) => {
  const { Meta } = Card;
  const { Paragraph,Text, Title } = Typography;

  return (
    <Link to={`/landing/${activity.event_id}/activity/${activity._id}`}>
      <div className='animate__animated animate__fadeIn'>
          <Card
            className={'horizontal'}
            bordered={bordered}
            loading={loading}
            style={{ width: '100%' }}
            cover={
              <ReactPlayer
              style={{ paddingTop: '2px' }}
              light={true}
              width={'160px'}
              height={'100px'}
              url={activity.video}
            />
            }
            actions={right}
            bodyStyle={{ paddingRight: '0px' }}>
            <Meta
              style={{}}
              description={
                <div>
                  <Paragraph strong={true} ellipsis={{rows:2}} >{activity.name}</Paragraph>
                    <div size='small' style={{fontSize:'80%'}}>
                      <i className='fas fa-calendar-alt' />
                      <time dateTime={activity.datetime_start}>{Moment(activity.datetime_start).format('DD MMM YYYY')}</time>
                    </div>
                 
                  <Space size='small'>
                  <p>
                    {event.organizer.name
                      ? event.organizer.name
                      : event.author.displayName
                      ? event.author.displayName
                      : event.author.names}
                  </p>
                  </Space>
                </div>
              }
            />
          </Card>
    
      </div>
      {/* <Card
        bordered={true}
        hoverable={true}
        style={{ width: '300px', height: '30vh', boxShadow: ' 1px 3px 2px 2px #cccccc', borderRadius: '10px' }}
        cover={
          <ReactPlayer
            style={{ paddingTop: '2px' }}
            light={true}
            width={'100%'}
            height={'150px'}
            url={activity.video}
          />
        }>
        <Meta
          description={
            <div>
              <Space direction='vertical' size={-10}>
                <Paragraph ellipsis={{ rows: 2 }}>{activity.name}</Paragraph>
                <span style={{ fontSize: '10px' }}>
                  <Space size='small'>
                    <i className='fas fa-calendar-alt' />
                    <time dateTime={activity.datetime_end}>{Moment(activity.datetime_end).format('DD MMM YYYY')}</time>
                  </Space>
                </span>
              </Space>
            </div>
          }
        />
      </Card> */}
    </Link>
  );
};

export default videoCard;
