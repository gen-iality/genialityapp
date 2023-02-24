import { Component } from 'react';
import dayjs from 'dayjs';
import { Link, withRouter } from 'react-router-dom';
import { Badge, Card, Space, Typography } from 'antd';
import { imageUtils } from '@Utilities/ImageUtils';
import { HelperContext } from '@context/helperContext/helperContext';

import StudentGeneralCourseProgress from '@components/StudentProgress/StudentGeneralCourseProgress';
import QuizApprovedStatus from '../quiz/QuizApprovedStatus';

const { Meta } = Card;

const EventImage = imageUtils.EventImage;

class EventCard extends Component {
  static contextType = HelperContext;
  render() {
    const { event, bordered, right, loading, isAdmin, blockedEvent } = this.props;
    const { eventIsActive } = this.context;

    const styleNormal = {
      fontWeight: 'bold',
    };

    const styleAdmin = {
      fontWeight: 'bold',
      width: '250px',
    };

    //Esto sólo va a aplicar para cuando el usuario tiene un plan
    //Se esta validando la fecha en la que se va a bloquear el evento, osea hasta la fecha que tiene acceso
    const actualDate = new Date(event.datetime_to);
    //aqui  tiene que venir ahora unos minutos en caso de tener plan
    const blockedDate = new Date(actualDate.setDate(actualDate.getDate() + blockedEvent));
    const formatDate = dayjs(blockedDate).format('DD MMM YYYY');

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
                    alt='geniality.com.co'
                  />
                  {this.props.moreDetails && event._id && (
                    <StudentGeneralCourseProgress eventId={event._id} />
                  )}
                  {this.props.moreDetails && (
                    <QuizApprovedStatus eventId={event._id} approvedLink={`/landing/${event._id}/certificate`} />
                  )}
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
                    alt='geniality.com.co'
                  />
                  {this.props.moreDetails && event._id && (
                    <StudentGeneralCourseProgress eventId={event._id} />
                  )}
                  {this.props.moreDetails && (
                    <QuizApprovedStatus eventId={event._id} approvedLink={`/landing/${event._id}/certificate`} />
                  )}
                </Link>
              )
            }
            actions={right}
            bodyStyle={{ paddingLeft: '0px', paddingRight: '0px' }}>
            <Meta
              style={{}}
              description={
                <Link to={`/landing/${event._id}`}>
                <Space size={1} direction='vertical'>
                  <span style={{ fontSize: '12px' }}>
                    {this.props.noDates && <Space>
                      <i className='fas fa-calendar-alt' />
                      <time dateTime={event.datetime_from}>{dayjs(event.datetime_from).format('DD MMM YYYY')}</time>
                      {'-'}
                      <time dateTime={event.datetime_to}>{dayjs(event.datetime_to).format('DD MMM YYYY')}</time>
                    </Space>}
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
                </Space>
                </Link>
              }
            />
          </Card>
        </Badge.Ribbon>
      </div>
    );
  }
}

export default withRouter(EventCard);
