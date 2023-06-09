import { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Card, Typography } from 'antd'
import ReactQuill from 'react-quill'
import ReactPlayer from 'react-player'
import { Row, Col } from 'antd'
import { AgendaApi } from '@helpers/request'
import { parseUrl } from '@helpers/constants'
import ActivitiesList from '@components/agenda/components/ActivitiesList'
import AdditionalEventInfo from '@components/agenda/components/AdditionalEventInfo'
import QuizApprovedStatus from '../quiz/QuizApprovedStatus'
import { useEventProgress } from '@context/eventProgressContext'
import EventProgress from '@components/StudentProgress/EventProgress'

interface EventLandingProps {
  event: any
  eventUser: any
}

const EventLanding: FunctionComponent<EventLandingProps> = (props) => {
  const { event, eventUser } = props

  const [activityId, setActivityId] = useState<string | null>(null)
  const [activityDetail, setActivityDetail] = useState<any | null>(null)
  const [thereAreQuizingOrSurveys, setThereAreQuizingOrSurveys] = useState<boolean>(false)

  const cEventProgress = useEventProgress()

  const isDescriptionVisible = useMemo(() => {
    if (
      (event.description !== '<p><br></p>' &&
        event.description !== null &&
        event.description !== `<p class="ql-align-center"><br></p>` &&
        event.description !== `<p class="ql-align-right"><br></p>` &&
        event.description !== `<p class="ql-align-justify"><br></p>`) ||
      event ||
      ((event.description === '<p><br></p>' ||
        event.description === null ||
        event.description === `<p class="ql-align-center"><br></p>` ||
        event.description === `<p class="ql-align-right"><br></p>` ||
        event.description === `<p class="ql-align-justify"><br></p>`) &&
        event.video)
    ) {
      return true
    }
    return false
  }, [event])

  useEffect(() => {
    // Utilizada para concatenar parametros
    const currentUrl = window.location.href
    const urlParams = parseUrl(currentUrl) as any
    // Si existe el activity_id por urlParams entonces seteamos el estado
    if (urlParams.activity_id) {
      AgendaApi.getOne(urlParams.activity_id, event._id).then((activity) => {
        setActivityId(urlParams.activity_id)
        setActivityDetail(activity)
      })
    }
  }, [])

  return (
    <div>
      {/* Condiciones de posicionamiento, solo para cuando no tiene contenido*/}
      {event && (
        <>
          <EventProgress
            event={event}
            nodeIfCompleted={
              !event.hide_certificate_link && (
                <Link to={`/landing/${event._id}/certificate`}>
                  <Typography.Text strong style={{ color: '#FFFFFF' }}>
                    Obtener certificado
                  </Typography.Text>
                </Link>
              )
            }
          />
          <Card style={{ display: thereAreQuizingOrSurveys ? 'block' : 'none' }}>
            <Typography.Text>Estado del curso:</Typography.Text>{' '}
            <QuizApprovedStatus
              thereAreExam={(param) => {
                setThereAreQuizingOrSurveys(param)
              }}
              eventId={event._id}
              approvedLink={`/landing/${event._id}/certificate`}
            />
          </Card>
        </>
      )}

      {isDescriptionVisible ? (
        <Card
          className="event-description"
          /* bodyStyle={{ padding: '25px 5px' }} */
          bordered={false}
          style={
            event.styles && event.styles.show_card_banner && event.styles.show_card_banner
              ? { marginTop: '2%' }
              : { marginTop: '0px' }
          }
        >
          <Row gutter={32}>
            <Col sm={24} md={6} style={{ width: '100%', padding: '0 5px' }}>
              {event && <AdditionalEventInfo event={event} />}
            </Col>
            <Col sm={24} md={18} style={{ padding: '0 5px' }}>
              <div className="activities-main-list">
                <ActivitiesList
                  eventId={event?._id}
                  eventUserId={eventUser?._id}
                  eventProgressPercent={cEventProgress.progressFilteredActivities}
                />
              </div>
            </Col>
          </Row>
          {/* Si event video existe */}
          {event?.video_position == 'true' && event.video && (
            <div className="mediaplayer">
              <ReactPlayer
                width="100%"
                height="100%"
                style={{
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                }}
                url={event.video}
                controls
              />
            </div>
          )}

          {isDescriptionVisible ? (
            <Row justify="center">
              <Col span={24} id="img-informative">
                <ReactQuill
                  value={event.description}
                  readOnly
                  className="hide-toolbar ql-toolbar"
                  theme="bubble"
                />
              </Col>
            </Row>
          ) : (
            <></>
          )}
          {(event?.video_position == 'false' || event.video_position == undefined) &&
            event.video && (
              <div className="mediaplayer">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  style={{
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                  }}
                  url={event.video}
                  controls
                />
              </div>
            )}
        </Card>
      ) : (
        <div style={{ height: '150px' }} />
      )}
    </div>
  )
}

export default EventLanding
