/** React's libraries */
import { useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

/** Antd imports */
import { Badge, Card, Modal, Space, Typography } from 'antd'

/** Helpers and utils */
import { imageUtils } from '@Utilities/ImageUtils'

/** Components */
import StudentGeneralCourseProgress from '@components/StudentProgress/StudentGeneralCourseProgress'
import QuizApprovedStatus from '../quiz/QuizApprovedStatus'

const { Meta } = Card

const EventImage = imageUtils.EventImage

const EventCard = ({
  event,
  bordered,
  right,
  loading,
  isAdmin,
  blockedEvent,
  noAvailable,
  moreDetails,
  noDates,
  organizationUser,
  paymentDispatch,
  organization,
}) => {
  let history = useHistory()
  let location = useLocation()

  const [isOpenModal, setIsOpenModal] = useState(false)

  let openModal = () => {
    setIsOpenModal(true)
  }

  let closeModal = () => {
    setIsOpenModal(false)
  }
  const styleNormal = {
    fontWeight: 'bold',
  }

  const styleAdmin = {
    fontWeight: 'bold',
    width: '250px',
  }
  //Esto sólo va a aplicar para cuando el usuario tiene un plan
  //Se esta validando la fecha en la que se va a bloquear el evento, osea hasta la fecha que tiene acceso
  const actualDate = new Date(event.datetime_to)
  //aqui  tiene que venir ahora unos minutos en caso de tener plan
  const blockedDate = new Date(actualDate.setDate(actualDate.getDate() + blockedEvent))
  // const formatDate = dayjs(blockedDate).format('DD MMM YYYY')

  return (
    <div className="animate__animated animate__fadeIn">
      <Badge.Ribbon
        style={{
          maxWidth: '250px',
          height: 'auto',
          overflowWrap: 'break-word',
          whiteSpace: 'normal',
          opacity: '0.8',
        }}
        text={
          <span style={{ fontSize: '12px' }}>
            <div>
              <Space>
                <span>
                  <i className="fas fa-map-marker-alt" />
                </span>
                <span>{event.venue ? event.venue : 'Virtual'}</span>
              </Space>
            </div>
          </span>
        }
      >
        <Card
          bordered={bordered}
          loading={loading}
          style={{ maxWidth: '100%' }}
          cover={
            <>
              {noAvailable ? (
                <Link to={location.pathname} onClick={() => openModal()}>
                  <img
                    className="animate__animated animate__fadeIn animate__slower"
                    loading="lazy"
                    style={{ objectFit: 'cover', height: '180px', width: '100%' }}
                    src={
                      event.picture
                        ? typeof event.picture === 'object'
                          ? event.picture[0]
                          : event.picture
                        : event.styles &&
                          event.styles.banner_image &&
                          event.styles.banner_image !== undefined
                        ? event.styles.banner_image
                        : EventImage
                    }
                    alt="geniality.com.co"
                  />
                </Link>
              ) : (
                <a
                  href={`/landing/${event._id}/evento`}
                  onClick={(e) => {
                    console.log('usuario tipo de organizacion ', organization)
                    if (
                      organization?.access_settings?.type === 'payment' &&
                      //si no esta logueado o si no ha pagado miramos si requiere pago
                      (!organizationUser || !organizationUser?.payment_plan)
                    ) {
                      paymentDispatch({ type: 'REQUIRE_PAYMENT' })
                      e.preventDefault()
                      e.stopPropagation()
                      e.nativeEvent.stopImmediatePropagation()
                    }
                    console.log('organizationUser')

                    return false
                  }}
                >
                  {console.log('imagen grandota', event)}
                  <img
                    className="animate__animated animate__fadeIn animate__slower"
                    loading="lazy"
                    style={{ objectFit: 'cover', minHeight: '220px', width: '100%' }}
                    src={
                      event.picture
                        ? event.picture
                        : event?.styles?.banner_image
                        ? event.styles.banner_image
                        : EventImage
                    }
                    alt="geniality.com.co"
                  />
                  {moreDetails && event._id && (
                    <StudentGeneralCourseProgress eventId={event._id} />
                  )}
                  {moreDetails && (
                    <QuizApprovedStatus
                      eventId={event._id}
                      approvedLink={`/landing/${event._id}/certificate`}
                    />
                  )}
                </a>
              )}
            </>
          }
          actions={right}
          bodyStyle={{ paddingLeft: '0px', paddingRight: '0px' }}
        >
          <Meta
            style={{}}
            description={
              <>
                {noAvailable ? (
                  <Link to={location.pathname} onClick={() => openModal()}>
                    <Space size={1} direction="vertical">
                      <span style={{ fontSize: '12px' }}>
                        {!noDates && (
                          <Space>
                            <i className="fas fa-calendar-alt" />
                            <time dateTime={event.datetime_from}>
                              {dayjs(event.datetime_from).format('DD MMM YYYY')}
                            </time>
                            {'-'}
                            <time dateTime={event.datetime_to}>
                              {dayjs(event.datetime_to).format('DD MMM YYYY')}
                            </time>
                          </Space>
                        )}
                      </span>
                      <Typography.Text
                        ellipsis={!!isAdmin}
                        style={isAdmin ? styleAdmin : styleNormal}
                      >
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
                ) : (
                  <a
                    href={`/landing/${event._id}/evento`}
                    onClick={(e) => {
                      if (
                        !organizationUser?.payment_plan &&
                        organization?.access_settings?.type === 'payment'
                      ) {
                        paymentDispatch({ type: 'REQUIRE_PAYMENT' })
                        e.preventDefault()
                        e.stopPropagation()
                        e.nativeEvent.stopImmediatePropagation()
                      }
                      console.log('organizationUser', organizationUser)

                      return false
                    }}
                  >
                    <Space size={1} direction="vertical">
                      <span style={{ fontSize: '12px' }}>
                        {!noDates && (
                          <Space>
                            <i className="fas fa-calendar-alt" />
                            <time dateTime={event.datetime_from}>
                              {dayjs(event.datetime_from).format('DD MMM YYYY')}
                            </time>
                            {'-'}
                            <time dateTime={event.datetime_to}>
                              {dayjs(event.datetime_to).format('DD MMM YYYY')}
                            </time>
                          </Space>
                        )}
                      </span>
                      <Typography.Text
                        ellipsis={!!isAdmin}
                        style={isAdmin ? styleAdmin : styleNormal}
                      >
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
                  </a>
                )}
              </>
            }
          />
        </Card>
      </Badge.Ribbon>
      {isOpenModal && (
        <Modal
          title="Información importante"
          closable
          footer={false}
          visible
          onCancel={() => closeModal()}
        >
          El evento será habilitado próximamente
        </Modal>
      )}
    </div>
  )
}

export default EventCard
