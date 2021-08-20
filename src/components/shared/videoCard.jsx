import { Card, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import Moment from 'moment';
import React from 'react';
import ReactPlayer from 'react-player';

const videoCard = ({ activity }) => {
  const { Meta } = Card;
  const { Paragraph } = Typography;
  return (
    <Link to={`/landing/${activity.event_id}/activity/${activity._id}`}>
      <Card
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
      </Card>
    </Link>
  );
};

export default videoCard;
