import { Component } from 'react';
import Moment from 'moment';
import { Link, withRouter } from 'react-router-dom';
import { Badge, Card, Space, Typography } from 'antd';
import { imageUtils } from '../../Utilities/ImageUtils';
import { HelperContext } from '@/context/helperContext/helperContext';
const EventImage = imageUtils.EventImage;
class EventCard extends Component {
  static contextType = HelperContext;
  render() {
    const { event, bordered, right, loading, isAdmin } = this.props;
    const { eventIsActive } = this.context;

    const { Meta } = Card;

    const styleNormal = {
      fontWeight: 'bold',
    };

    const styleAdmin = {
      fontWeight: 'bold',
      width: '250px',
    };
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
          <Card
            bordered={bordered}
            loading={loading}
            style={{ width: '100%' }}
            cover={
              event.picture ? (
                <Link to={{ pathname: `/landing/${event._id}`, state: { event: event } }}>
                  <img
                    className='animate__animated animate__fadeIn animate__slower'
                    loading='lazy'
                    style={{ objectFit: 'cover', height: '180px', width: '100%' }}
                    src={typeof event.picture === 'object' ? event.picture[0] : event.picture}
                    alt='Evius.co'
                  />
                </Link>
              ) : (
                <Link to={{ pathname: `/landing/${event._id}`, state: { event: event } }}>
                  <img
                    className='animate__animated animate__fadeIn animate__slower'
                    loading='lazy'
                    style={{ objectFit: 'cover', height: '180px', width: '100%' }}
                    src={
                      event.styles
                        ? event.styles.banner_image && event.styles.banner_image !== undefined
                          ? event.styles.banner_image
                          : EventImage
                        : EventImage
                    }
                    alt='Evius.co'
                  />
                </Link>
              )
            }
            actions={right}
            bodyStyle={{ paddingLeft: '0px', paddingRight: '0px' }}>
            <Meta
              style={{}}
              description={
                <Space size={1} direction='vertical'>
                  <span style={{ fontSize: '12px' }}>
                    <Space>
                      <i className='fas fa-calendar-alt' />
                      <time dateTime={event.datetime_from}>{Moment(event.datetime_from).format('DD MMM YYYY')}</time>
                      {'-'}
                      <time dateTime={event.datetime_to}>{Moment(event.datetime_to).format('DD MMM YYYY')}</time>
                    </Space>
                  </span>
                  <Typography.Text ellipsis={isAdmin ? true : false} style={isAdmin ? styleAdmin : styleNormal}>
                    {event.name}
                  </Typography.Text>
                  <span>
                    {event.organizer?.name
                      ? event.organizer?.name
                      : event.author?.displayName
                      ? event.author?.displayName
                      : event.author?.names}
                  </span>
                  {!eventIsActive[event._id] && window.location.toString().includes('myprofile') && (
                    <small style={{ color: 'red' }}>
                      Tu evento está bloqueado desde el {Moment(event.datetime_to).format('DD MMM YYYY')}
                    </small>
                  )}
                </Space>
              }
            />
          </Card>
        </Badge.Ribbon>
      </div>
    );
  }
}

export default withRouter(EventCard);
