import React, { Component } from 'react';
import Moment from 'moment';
import { Link, withRouter } from 'react-router-dom';
import EventImage from '../../eventimage.png';
import { Badge, Card, Space } from 'antd';

const FriendLyUrl = (url) => {
  let slug = url.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ').toLowerCase();
  slug = url.replace(/^\s+|\s+$/gm, '');
  slug = url.replace(/\s+/g, '-');
  return slug;
};

class EventCard extends Component {
  render() {
    const { event, bordered, right, loading } = this.props;
    const { Meta } = Card;
    return (
      <div className='animate__animated animate__fadeIn'>
        <Badge.Ribbon
          style={{
            maxWidth: '250px',
            height: 'auto',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
          }}
          text={
            <span style={{ fontSize: '12px' }}>
              <div>
                <Space>
                  <span>
                    <i className='fas fa-map-marker-alt' />
                  </span>
                  <span>{event.venue ? event.venue : 'Virtual'}</span>
                </Space>
              </div>
            </span>
          }>
          <Link
            // onClick={() => Cookies.set('idevent', event._id)}
            to={
              event._id == '6123f3b76eac227949514a82'
                ? { pathname: `/event/${FriendLyUrl(event.name)}`, state: { event: event } }
                : { pathname: `/landing/${event._id}`, state: { event: event } }
            }>
            <Card
              bordered={bordered}
              loading={loading}
              style={{ width: '100%' }}
              cover={
                event.picture ? (
                  <img
                    className='animate__animated animate__fadeIn animate__slower'
                    loading='lazy'
                    style={{ objectFit: 'cover', height: 180 }}
                    src={typeof event.picture === 'object' ? event.picture[0] : event.picture}
                    alt='Evius.co'
                  />
                ) : (
                  <img
                    className='animate__animated animate__fadeIn animate__slower'
                    loading='lazy'
                    style={{ objectFit: 'cover', height: 180 }}
                    src={
                      event.styles
                        ? event.styles.banner_image && event.styles.banner_image !== undefined
                          ? event.styles.banner_image
                          : EventImage
                        : EventImage
                    }
                    alt='Evius.co'
                  />
                )
              }
              actions={right}
              bodyStyle={{ paddingLeft: '0px', paddingRight: '0px' }}>
              <Meta
                style={{}}
                description={
                  <div>
                    <span style={{ fontSize: '12px' }}>
                      <Space>
                        <i className='fas fa-calendar-alt' />
                        <time dateTime={event.datetime_from}>{Moment(event.datetime_from).format('DD MMM YYYY')}</time>
                        {'-'}
                        <time dateTime={event.datetime_from}>{Moment(event.datetime_from).format('DD MMM YYYY')}</time>
                      </Space>
                    </span>
                    <h3 style={{ fontWeight: 'bold' }}>{event.name}</h3>
                    <span>
                      {event.organizer?.name
                        ? event.organizer?.name
                        : event.author?.displayName
                        ? event.author?.displayName
                        : event.author?.names}
                    </span>
                  </div>
                }
              />
            </Card>
          </Link>
        </Badge.Ribbon>
      </div>
    );
  }
}

export default withRouter(EventCard);
