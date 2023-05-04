import { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { Card, Typography } from 'antd'
import ReactQuill from 'react-quill'
import ReactPlayer from 'react-player'
import { Row, Col } from 'antd'
import { AgendaApi } from '@helpers/request'
import { parseUrl } from '@helpers/constants'
import ActivitiesList from '@components/agenda/components/ActivitiesList'
import AdditionalEventInfo from '@components/agenda/components/AdditionalEventInfo'
import StudentSelfCourseProgress from '../StudentProgress/StudentSelfCourseProgress'
import { activityContentValues } from '@context/activityType/constants/ui'
import QuizApprovedStatus from '../quiz/QuizApprovedStatus'

interface EventLandingProps {
  event: any
  eventUser: any
  setActivitiesAttendee: any
}

const EventLanding: FunctionComponent<EventLandingProps> = (props) => {
  const { event, eventUser, setActivitiesAttendee } = props

  const [activityId, setActivityId] = useState<string | null>(null)
  const [activityDetail, setActivityDetail] = useState<any | null>(null)
  const [thereAreQuizingOrSurveys, setThereAreQuizingOrSurveys] = useState<boolean>(false)

  const isVisible = useMemo(() => {
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
    <div /* style={{ marginBottom: 12 }} */>
      {/* Condiciones de posicionamiento, solo para cuando no tiene contenido*/}
      {event && (
        <>
          <StudentSelfCourseProgress
            hasProgressLabel
            customTitle="Avance"
            activityFilter={(a) =>
              ![activityContentValues.quizing, activityContentValues.survey].includes(
                a.type?.name as any,
              )
            }
            nodeIfCompleted={
              <Link to={`/landing/${event._id}/certificate`}>
                <Typography.Text strong style={{ color: '#FFFFFF' }}>
                  Obtener certificado
                </Typography.Text>
              </Link>
            }
          />
          {event.is_examen_required ? (
            <StudentSelfCourseProgress
              hasProgressLabel
              customTitle="Avance de exámenes"
              activityFilter={(a) =>
                [activityContentValues.quizing, activityContentValues.survey].includes(
                  a.type?.name as any,
                )
              }
            />
          ) : undefined}
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

      {isVisible ? (
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
          {/*Lanzandome un nuevo diseno Sept 2022 */}
          <Row gutter={32}>
            <Col sm={24} md={6} style={{ width: '100%', padding: '0 5px' }}>
              {event && <AdditionalEventInfo event={event} />}
            </Col>
            <Col sm={24} md={18} style={{ padding: '0 5px' }}>
              <div className="activities-main-list">
                <ActivitiesList
                  eventId={event?._id}
                  cEventUserId={eventUser?._id}
                  setActivitiesAttendee={setActivitiesAttendee}
                />
              </div>
            </Col>
          </Row>
          {/* FIN Lanzandome un nuevo diseno Sept 2022 */}
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

          {event.description !== '<p><br></p>' &&
          event.description !== null &&
          event.description !== `<p class="ql-align-center"><br></p>` &&
          event.description !== `<p class="ql-align-right"><br></p>` &&
          event.description !== `<p class="ql-align-justify"><br></p>` ? (
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
