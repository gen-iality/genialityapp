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
  cEvent: any
  cEventUser: any
  setActivitiesAttendee: any
}

const EventLanding: FunctionComponent<EventLandingProps> = (props) => {
  const { cEvent, cEventUser, setActivitiesAttendee } = props

  const [activityId, setActivityId] = useState<string | null>(null)
  const [activityDetail, setActivityDetail] = useState<any | null>(null)
  const [thereAreQuizingOrSurveys, setThereAreQuizingOrSurveys] = useState<boolean>(false)

  const isVisible = useMemo(() => {
    if (
      (cEvent.value.description !== '<p><br></p>' &&
        cEvent.value.description !== null &&
        cEvent.value.description !== `<p class="ql-align-center"><br></p>` &&
        cEvent.value.description !== `<p class="ql-align-right"><br></p>` &&
        cEvent.value.description !== `<p class="ql-align-justify"><br></p>`) ||
      cEvent.value ||
      ((cEvent.value.description === '<p><br></p>' ||
        cEvent.value.description === null ||
        cEvent.value.description === `<p class="ql-align-center"><br></p>` ||
        cEvent.value.description === `<p class="ql-align-right"><br></p>` ||
        cEvent.value.description === `<p class="ql-align-justify"><br></p>`) &&
        cEvent.value.video)
    ) {
      return true
    }
    return false
  }, [cEvent])

  useEffect(() => {
    // Utilizada para concatenar parametros
    const currentUrl = window.location.href
    const urlParams = parseUrl(currentUrl) as any
    // Si existe el activity_id por urlParams entonces seteamos el estado
    if (urlParams.activity_id) {
      AgendaApi.getOne(urlParams.activity_id, cEvent.value._id).then((activity) => {
        setActivityId(urlParams.activity_id)
        setActivityDetail(activity)
      })
    }
  }, [])

  return (
    <div /* style={{ marginBottom: 12 }} */>
      {/* Condiciones de posicionamiento, solo para cuando no tiene contenido*/}
      {cEvent.value && (
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
              <Link to={`/landing/${cEvent.value._id}/certificate`}>
                <Typography.Text strong style={{ color: '#FFFFFF' }}>
                  Obtener certificado
                </Typography.Text>
              </Link>
            }
          />
          {cEvent.value.is_examen_required ? (
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
              eventId={cEvent.value._id}
              approvedLink={`/landing/${cEvent.value._id}/certificate`}
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
            cEvent.value.styles &&
            cEvent.value.styles.show_card_banner &&
            cEvent.value.styles.show_card_banner
              ? { marginTop: '2%' }
              : { marginTop: '0px' }
          }
        >
          {/*Lanzandome un nuevo diseno Sept 2022 */}
          <Row gutter={32}>
            <Col sm={24} md={6} style={{ width: '100%', padding: '0 5px' }}>
              {cEvent.value && <AdditionalEventInfo event={cEvent.value} />}
            </Col>
            <Col sm={24} md={18} style={{ padding: '0 5px' }}>
              <div className="activities-main-list">
                <ActivitiesList
                  eventId={cEvent.value?._id}
                  cEventUserId={cEventUser.value?._id}
                  setActivitiesAttendee={setActivitiesAttendee}
                />
              </div>
            </Col>
          </Row>
          {/* FIN Lanzandome un nuevo diseno Sept 2022 */}
          {/* Si event video existe */}
          {cEvent.value?.video_position == 'true' && cEvent.value.video && (
            <div className="mediaplayer">
              <ReactPlayer
                width="100%"
                height="100%"
                style={{
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                }}
                url={cEvent.value.video}
                controls
              />
            </div>
          )}

          {cEvent.value.description !== '<p><br></p>' &&
          cEvent.value.description !== null &&
          cEvent.value.description !== `<p class="ql-align-center"><br></p>` &&
          cEvent.value.description !== `<p class="ql-align-right"><br></p>` &&
          cEvent.value.description !== `<p class="ql-align-justify"><br></p>` ? (
            <Row justify="center">
              <Col span={24} id="img-informative">
                <ReactQuill
                  value={cEvent.value.description}
                  readOnly
                  className="hide-toolbar ql-toolbar"
                  theme="bubble"
                />
              </Col>
            </Row>
          ) : (
            <></>
          )}
          {(cEvent.value?.video_position == 'false' ||
            cEvent.value.video_position == undefined) &&
            cEvent.value.video && (
              <div className="mediaplayer">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  style={{
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                  }}
                  url={cEvent.value.video}
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
