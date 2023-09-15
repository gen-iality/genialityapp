/* eslint-disable react/jsx-no-target-blank */
import { Component, useEffect, useState } from 'react';
import Moment from 'moment';
import { Link, withRouter } from 'react-router-dom';
import { Badge, Button, Card, Space, Tag, Tooltip, Typography } from 'antd';
import { imageUtils } from '../../Utilities/ImageUtils';
import { HelperContext } from '@/context/helperContext/helperContext';
import { OrganizationApi } from '@/helpers/request';

const EventImage = imageUtils.EventImage;
const { Meta } = Card;
class EventCard extends Component {
  static contextType = HelperContext;
  render() {
    const {
      event,
      bordered,
      right,
      loading,
      isAdmin,
      buttonBuyOrRegistered,
      textButtonBuyOrRegistered,
      location,
    } = this.props;
    // const { eventIsActive } = this.context;
    const styleNormal = {
      fontWeight: 'bold',
    };

    const styleAdmin = {
      fontWeight: 'bold',
      width: '250px',
    };

    const getDateEvent = () => {
      if (!event) return <></>;
      const MIN_DATES = 1;
      const EVENT_WITH_ONE_DATE = 1;
      const FIRST_DATE = 0;
      if (event.dates?.length >= MIN_DATES) {
        const LAST_DATE = event.dates?.length - 1;
        if (event.dates?.length === EVENT_WITH_ONE_DATE) {
          return (
            <time dateTime={event.dates[FIRST_DATE]?.start}>
              {Moment(event.dates[FIRST_DATE]?.start).format('DD MMM YYYY')}
            </time>
          );
        } else {
          return (
            <>
              <time dateTime={event.dates[FIRST_DATE]?.start}>
                {Moment(event.dates[FIRST_DATE]?.start).format('DD MMM YYYY')}
              </time>
              {'-'}
              <time dateTime={event.dates[LAST_DATE].end}>
                {Moment(event.dates[LAST_DATE].end).format('DD MMM YYYY')}
              </time>
            </>
          );
        }
      }
      if (Moment(event.datetime_from).format('DD MMM YYYY') === Moment(event.datetime_to).format('DD MMM YYYY')) {
        return (
          <>
            <time dateTime={event.datetime_from}>{Moment(event.datetime_from).format('DD MMM YYYY')}</time>
          </>
        );
      }
      return (
        <>
          <time dateTime={event.datetime_from}>{Moment(event.datetime_from).format('DD MMM YYYY')}</time>
          {'-'}
          <time dateTime={event.datetime_to}>{Moment(event.datetime_to).format('DD MMM YYYY')}</time>
        </>
      );
    };

    //Esto sólo va a aplicar para cuando el usuario tiene un plan
    //Se esta validando la fecha en la que se va a bloquear el evento, osea hasta la fecha que tiene acceso
    // let actualDate = new Date(event.datetime_to);
    //aqui  tiene que venir ahora unos minutos en caso de tener plan
    /* let blockedDate = new Date(actualDate.setDate(actualDate.getDate() + blockedEvent));
    let formatDate = Moment(blockedDate).format('DD MMM YYYY'); */
  const fetchOrganizationUser = async () => {
    try {
      const response = await OrganizationApi.getMeUser(event?.organizer?._id);
      const users = response.data;
     
    } catch (error) {
      console.error('Error al obtener el usuario de la organización:', error);
    }
  };
    const getEventInfo = () => {
      const currentPath = location.pathname;

      if (currentPath.startsWith('/organization/')) {
        // Ruta "/organization/[id]/events": Muestra el nombre de la organización o la categoría
        if (event.category_ids && event.category_ids.length > 0) {
          return (
            <Space>
              {event.category_ids.map((category, index) => (
                <Tag key={index}>{category}</Tag>
              ))}
            </Space>
          );
        } else {
          const possibleNames = [
            event.organizer?.name
              ? event.organizer?.name
              : event.author?.displayName
              ? event.author?.displayName
              : event.author?.names,
          ];
          const validNames = possibleNames.filter((name) => name);
          return validNames.map((name, index) => <span key={index}>{name}</span>);
        }
      } else if (currentPath === '/myprofile') {
        // Ruta "/myprofile": Muestra solo el nombre de la organización o del autor
        if (event.organizer?.name) {
          return <span>{event.organizer.name}</span>;
        } else if (event.author?.displayName) {
          return <span>{event.author.displayName}</span>;
        } else if (event.author?.names) {
          return <span>{event.author.names.join(', ')}</span>;
        }
      }
      // En todas las demás rutas, muestra las categorías si están disponibles
      if (event.category_ids && event.category_ids.length > 0) {
        return (
          <Space>
            {event.category_ids.map((category, index) => (
              <Tag key={index}>{category}</Tag>
            ))}
          </Space>
        );
      } else {
        const possibleNames = [
          event.organizer?.name
            ? event.organizer?.name
            : event.author?.displayName
            ? event.author?.displayName
            : event.author?.names,
        ];
        const validNames = possibleNames.filter((name) => name);
        return validNames.map((name, index) => <span key={index}>{name}</span>);
      }
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
                  <Tooltip
                    title={
                      event.type_event === 'onlineEvent'
                        ? ''
                        : event.address
                        ? event.venue
                          ? event.address + ', ' + event.venue
                          : event.address
                        : event.venue
                    }>
                    <span>
                      {event.type_event === 'physicalEvent'
                        ? 'Físico'
                        : event.type_event === 'onlineEvent'
                        ? 'Virtual'
                        : event.type_event === 'hybridEvent'
                        ? 'Híbrido'
                        : 'Tipo de evento desconocido'}
                    </span>
                  </Tooltip>
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
                      {getDateEvent()}
                    </Space>
                  </span>
                  <Link to={{ pathname: `/landing/${event._id}`, state: { event: event } }}>
                    <Typography.Text ellipsis={isAdmin ? true : false} style={isAdmin ? styleAdmin : styleNormal}>
                      {event.name}
                    </Typography.Text>
                  </Link>
                  {getEventInfo()}
                  {buttonBuyOrRegistered ? (
                    textButtonBuyOrRegistered === 'Comprar' && event.payment && event.payment.urlExternalPayment ? (
                      <a href={event.payment.urlExternalPayment} target='_blank'>
                        <Button type='primary'>{textButtonBuyOrRegistered}</Button>
                      </a>
                    ) : (
                      <Link to={{ pathname: `/landing/${event._id}`, state: { event } }}>
                        <Button type='primary'>{textButtonBuyOrRegistered}</Button>
                      </Link>
                    )
                  ) : null}

                  {/* RESTRICIONES */}
                  {/* {!eventIsActive[event._id] && window.location.toString().includes('myprofile') && (
                    <Typography.Paragraph style={{ color: 'red' }}>
                      {blockedEvent && (
                        <small>
                          Tu evento está bloqueado desde el {Moment(event.datetime_to).format('DD MMM YYYY')}
                          <br /> En la landing estará bloqueado a partir de el {formatDate}
                        </small>
                      )}
                    </Typography.Paragraph>
                  )} */}
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
