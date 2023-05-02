/** React's libraries */
import { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

/** Antd imports */
import { Badge, Card, Modal, Space, Typography } from 'antd'

/** Helpers and utils */
import { imageUtils } from '@Utilities/ImageUtils'

/** Context */
import { HelperContext } from '@context/helperContext/helperContext'

/** Components */
import StudentGeneralCourseProgress from '@components/StudentProgress/StudentGeneralCourseProgress'
import QuizApprovedStatus from '../quiz/QuizApprovedStatus'

const { Meta } = Card

const EventImage = imageUtils.EventImage

class EventCard extends Component {
  static contextType = HelperContext

  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpenModal: false,
    }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({ isOpenModal: true })
  }

  closeModal() {
    this.setState({ isOpenModal: false })
  }

  render() {
    const {
      event,
      bordered,
      right,
      loading,
      isAdmin,
      blockedEvent,
      noAvailable,
      location,
      history,
    } = this.props
    const { eventIsActive } = this.context

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
    const formatDate = dayjs(blockedDate).format('DD MMM YYYY')

    return (
      <div className="animate__animated animate__fadeIn">
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
                    <i className="fas fa-map-marker-alt" />
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
                <>
                  {noAvailable ? (
                    <>
                      <Link to={location.pathname} onClick={() => this.openModal()}>
                        <img
                          className="animate__animated animate__fadeIn animate__slower"
                          loading="lazy"
                          style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                          src={
                            typeof event.picture === 'object'
                              ? event.picture[0]
                              : event.picture
                          }
                          alt="geniality.com.co"
                        />
                      </Link>
                    </>
                  ) : (
                    <Link to={`/landing/${event._id}/evento`}>
                      {/* <a href={`/landing/${event._id}/evento`}> */}
                      <img
                        className="animate__animated animate__fadeIn animate__slower"
                        loading="lazy"
                        style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                        src={
                          typeof event.picture === 'object'
                            ? event.picture[0]
                            : event.picture
                        }
                        alt="geniality.com.co"
                      />
                      {this.props.moreDetails && event._id && (
                        <StudentGeneralCourseProgress eventId={event._id} />
                      )}
                      {this.props.moreDetails && (
                        <QuizApprovedStatus
                          eventId={event._id}
                          approvedLink={`/landing/${event._id}/certificate`}
                        />
                      )}
                      {/* </a> */}
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {noAvailable ? (
                    <Link to={location.pathname} onClick={() => this.openModal()}>
                      <img
                        className="animate__animated animate__fadeIn animate__slower"
                        loading="lazy"
                        style={{ objectFit: 'cover', height: '180px', width: '100%' }}
                        src={
                          event.styles
                            ? event.styles.banner_image &&
                              event.styles.banner_image !== undefined
                              ? event.styles.banner_image
                              : EventImage
                            : EventImage
                        }
                        alt="geniality.com.co"
                      />
                    </Link>
                  ) : (
                    <a href={`/landing/${event._id}/evento`}>
                      <img
                        className="animate__animated animate__fadeIn animate__slower"
                        loading="lazy"
                        style={{ objectFit: 'cover', height: '180px', width: '100%' }}
                        src={
                          event.styles
                            ? event.styles.banner_image &&
                              event.styles.banner_image !== undefined
                              ? event.styles.banner_image
                              : EventImage
                            : EventImage
                        }
                        alt="geniality.com.co"
                      />
                      {this.props.moreDetails && event._id && (
                        <StudentGeneralCourseProgress eventId={event._id} />
                      )}
                      {this.props.moreDetails && (
                        <QuizApprovedStatus
                          eventId={event._id}
                          approvedLink={`/landing/${event._id}/certificate`}
                        />
                      )}
                    </a>
                  )}
                </>
              )
            }
            actions={right}
            bodyStyle={{ paddingLeft: '0px', paddingRight: '0px' }}>
            <Meta
              style={{}}
              description={
                <>
                  {noAvailable ? (
                    <Link to={location.pathname} onClick={() => this.openModal()}>
                      <Space size={1} direction="vertical">
                        <span style={{ fontSize: '12px' }}>
                          {!this.props.noDates && (
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
                          style={isAdmin ? styleAdmin : styleNormal}>
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
                    <a href={`/landing/${event._id}/evento`}>
                      <Space size={1} direction="vertical">
                        <span style={{ fontSize: '12px' }}>
                          {!this.props.noDates && (
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
                          style={isAdmin ? styleAdmin : styleNormal}>
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
        {this.state.isOpenModal && (
          <Modal
            title="Información importante"
            closable
            footer={false}
            visible
            onCancel={() => this.closeModal()}>
            El evento será habilitado próximamente
          </Modal>
        )}
      </div>
    )
  }
}

export default withRouter(EventCard)
