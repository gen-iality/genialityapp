import { useState, useContext, useMemo, useEffect } from 'react'

import {
  Row,
  Col,
  Affix,
  Card,
  Typography,
  Statistic,
  Alert, // to info messages
  Button,
} from 'antd'
import useActivityType from '@context/activityType/hooks/useActivityType'
import AgendaContext from '@context/AgendaContext'
import { CurrentEventContext } from '@context/eventContext'
import { obtenerVideos } from '@adaptors/gcoreStreamingApi'
import VideoPreviewerCard from './components/manager/VideoPreviewerCard'
import TransmitionStatusCard from './components/manager/TransmitionStatusCard'
import VideoListCard from './components/manager/VideoListCard'
import LoadingActivityType from './components/LoadingActivityType'
import TransmitionOptionsCard from './components/manager/TransmitionOptionsCard'
import ParticipantRequestsCard from './components/manager/ParticipantRequestsCard'
import RTMPCard from './components/manager/RTMPCard'
import ShareMeetLinkCard from './components/manager/ShareMeetLinkCard'
import GoToMeet from './components/manager/GoToMeet'
import { activityContentValues } from '@context/activityType/constants/ui'
import type { ActivityType } from '@context/activityType/types/activityType'
import ModalListRequestsParticipate from '../roomManager/components/ModalListRequestsParticipate'
import { TypeDisplayment } from '@context/activityType/constants/enum'
import Document from '@components/documents/Document'

import QuizCMS from '../../quiz/QuizCMS'
import SurveyCMS from '../../survey/SurveyCMS'
import EviusReactQuill from '@components/shared/eviusReactQuill'

export interface ActivityContentManagerProps {
  activityName: string
  matchUrl: string
}

function ActivityContentManager(props: ActivityContentManagerProps) {
  const eventContext = useContext(CurrentEventContext)
  const {
    activityEdit,
    roomStatus,
    setRoomStatus,
    dataLive,
    meeting_id,
    obtainUrl,
    getRequestByActivity,
    recordings,
    startRecordTransmition,
    stopRecordTransmition,
    request,
    loadingRecord,
    record,
    platform,
    obtenerDetalleActivity,
  } = useContext(AgendaContext)

  const [viewModal, setViewModal] = useState(false)
  const [videos, setVideos] = useState<any[] | null>(null)

  const refActivity: string = useMemo(
    () => `request/${eventContext.value?._id}/activities/${activityEdit}`,
    [eventContext, activityEdit],
  )
  const refActivityViewers = useMemo(
    () => `viewers/${eventContext.value?._id}/activities/${activityEdit}`,
    [eventContext, activityEdit],
  )

  const {
    contentSource,
    setContentSource,
    translateActivityType,
    activityContentType,
    saveActivityContent,
    resetActivityType,
  } = useActivityType()

  const type = useMemo<ActivityType.TypeAsDisplayment | null>(() => {
    if (activityContentType) return translateActivityType(activityContentType)
    return null
  }, [activityContentType])

  const videoURL = useMemo(() => {
    if (type !== TypeDisplayment.VIDEO) return contentSource
    if (contentSource?.includes('youtube')) {
      return contentSource
    }
    return contentSource?.split('*')[0]
  }, [type, contentSource])

  const getVideoList = async () => {
    setVideos(null)
    try {
      const videoList = await obtenerVideos(props.activityName, meeting_id)
      if (videoList) {
        setVideos(videoList)
      }
    } catch (err) {
      // Convert url and cargarvideo to VIDEO was an error I did think
      // pd: cargarvideo is a awful name
      console.error('Not watch if VIDEO is url or cargarvideo, then error', err)
    }
  }

  useEffect(() => {
    // Force to get data from Firebase (because it is not realtime by evius design),
    // this next line checks if the activity type is survey-like and the `contentSource`
    // and meeting_id are null both. Then it calls to `obtenerDetalleActivity` from
    // AgendaContext to get meeting_id again.
    // NOTE: if this does not work, move it to an useEffect that watches the contentSource changes.
    if (!meeting_id && ['quiz', 'quizing', 'survey'].includes(activityContentType!)) {
      if (!contentSource) {
        console.log(
          'ActivityContentManager forces to request meeting_id from Firebase with `obtenerDetalleActivity`',
        )
        obtenerDetalleActivity()
      }
    }
    meeting_id &&
      !['quiz', 'quizing', 'survey'].includes(activityContentType!) &&
      getVideoList()

    if (type !== TypeDisplayment.EVIUS_MEET) return
    getRequestByActivity(refActivity)
  }, [type, meeting_id])

  useEffect(() => {
    console.debug('ActivityContentManager - take:', activityContentType)
    console.debug('ActivityContentManager - with source =', contentSource)
    console.debug('ActivityContentManager - dataLive:', JSON.stringify(dataLive))
    console.debug('ActivityContentManager - roomStatus:', JSON.stringify(roomStatus))
    console.debug('ActivityContentManager - platform:', JSON.stringify(platform))
  }, [])

  if (!type) {
    return <Typography.Title>Tipo de contenido no soportado aún</Typography.Title>
  }

  if (activityContentValues.html === activityContentType) {
    return (
      <>
        <Button
          onClick={() => {
            saveActivityContent(activityContentType, contentSource)
          }}
        >
          Forzar actualizar
        </Button>
        <EviusReactQuill
          name="html"
          data={contentSource || ''}
          handleChange={(value: string) => setContentSource(value)}
        />
      </>
    )
  }

  if (activityContentValues.pdf === activityContentType) {
    return (
      <>
        {!contentSource && <Alert type="info" message="Cargando contenido..." />}
        <Document
          simpleMode
          notRecordFileInDocuments
          event={eventContext.value} // Awful, but who are we
          matchUrl={props.matchUrl}
          location={{ location: { state: { edit: false } } }} // Awful, but who are we
          activityId={activityEdit}
          fromPDFDocumentURL={contentSource}
          onSave={(pdfUrl: string) => {
            console.debug('call onSave from Document. pdfUrl will be', pdfUrl)
            if (contentSource !== pdfUrl) {
              saveActivityContent(activityContentType, pdfUrl)
            } else {
              console.info(`Resaving stopped because contentSource = pdfUrl ${pdfUrl}`)
            }
          }}
          onRemoveDocumentContent={() => {
            // Maybe does not work, but this will be fixed by anybody else
            console.debug('remove content source...')
            setContentSource('')
            setTimeout(() => {
              saveActivityContent(activityContentType, 'empty')
            }, 3000)
          }}
          inserted
        />
      </>
    )
  }

  if (
    [activityContentValues.survey, activityContentValues.quizing].includes(
      activityContentType as ActivityType.ContentValue,
    )
  ) {
    return (
      <>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Typography.Title>{activityContentType}</Typography.Title>
          <Typography.Text>Página de configuración del contenido.</Typography.Text>
        </div>
        {activityContentType === activityContentValues.quizing && (
          <>
            {!contentSource && <Alert type="info" message="Cargando contenido..." />}
            <QuizCMS
              title="Evaluación"
              activityId={activityEdit}
              event={eventContext.value}
              matchUrl={props.matchUrl}
              savedSurveyId={contentSource!}
              inserted
              onSave={(quizId: string) => {
                console.debug('call onSave from QuizCMS. quizId will be', quizId)
                if (contentSource !== quizId) {
                  saveActivityContent(activityContentType, quizId)
                } else {
                  console.info(
                    `Resaving stopped because contentSource = quizId ${quizId}`,
                  )
                }
              }}
              onDelete={() => {
                console.debug('quiz will delete')
                resetActivityType('quizing2')
              }}
            />
          </>
        )}
        {activityContentType === activityContentValues.survey && (
          <>
            {!contentSource && <Alert type="info" message="Cargando contenido..." />}
            <SurveyCMS
              title="Encuesta"
              activityId={activityEdit}
              event={eventContext.value}
              matchUrl={props.matchUrl}
              savedSurveyId={contentSource!}
              inserted
              onSave={(surveyId: string) => {
                console.debug('call onSave from SurveyCMS. surveyId will be', surveyId)
                if (contentSource !== surveyId) {
                  saveActivityContent(activityContentType, surveyId)
                } else {
                  console.info(
                    `Resaving stopped because contentSource = surveyId ${surveyId}`,
                  )
                }
              }}
              onDelete={() => {
                console.debug('survey will delete')
                resetActivityType('survey2')
              }}
            />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={10}>
          <Affix offsetTop={80}>
            <VideoPreviewerCard type={type} activityName={props.activityName} />
          </Affix>
        </Col>

        <Col span={14}>
          <Row gutter={[16, 16]}>
            {(type == TypeDisplayment.TRANSMISSION ||
              type == TypeDisplayment.EVIUS_MEET) &&
              !dataLive?.active && (
                <Col span={24}>
                  <TransmitionStatusCard type={type} />
                </Col>
              )}

            {(type === TypeDisplayment.TRANSMISSION ||
              type === TypeDisplayment.EVIUS_MEET) &&
              !dataLive?.active &&
              (videos ? (
                <Col span={24}>
                  <VideoListCard
                    refreshData={getVideoList}
                    videos={videos}
                    toggleActivitySteps={() => console.log('¿esto cuándo se usa?')}
                  />
                </Col>
              ) : (
                <Col span={24}>
                  <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
                    <LoadingActivityType />
                  </Card>
                </Col>
              ))}

            {(type == TypeDisplayment.MEETING ||
              (type == TypeDisplayment.EVIUS_MEET && dataLive?.active)) && (
              <Col span={10}>
                <GoToMeet type={type} activityId={activityEdit} />
              </Col>
            )}

            {(((type === TypeDisplayment.EVIUS_MEET ||
              type === TypeDisplayment.TRANSMISSION) &&
              dataLive?.active) ||
              (type !== TypeDisplayment.EVIUS_MEET &&
                type !== TypeDisplayment.TRANSMISSION)) && (
              <Col
                span={
                  type !== TypeDisplayment.EVIUS_MEET && type !== TypeDisplayment.MEETING
                    ? 24
                    : 14
                }
              >
                <TransmitionOptionsCard type={type} />
              </Col>
            )}

            {type == TypeDisplayment.VIDEO && (
              <Col span={24}>
                <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
                  <Card.Meta
                    title={
                      <Typography.Text style={{ fontSize: '20px' }} strong>
                        Video cargado
                      </Typography.Text>
                    }
                    description="Esta es la url cargada"
                  />
                  <br />
                  <strong>URL:</strong> {videoURL}
                </Card>
              </Col>
            )}

            {type == TypeDisplayment.MEETING ? (
              <Col span={24}>
                <ShareMeetLinkCard activityId={activityEdit} />
              </Col>
            ) : (
              type == TypeDisplayment.EVIUS_MEET &&
              dataLive?.active && (
                <Col span={24}>
                  <ShareMeetLinkCard activityId={activityEdit} />
                </Col>
              )
            )}

            {type == TypeDisplayment.EVIUS_MEET && dataLive?.active && (
              <Col span={24}>
                <ParticipantRequestsCard request={request} setViewModal={setViewModal} />
              </Col>
            )}

            {(type == TypeDisplayment.TRANSMISSION ||
              type == TypeDisplayment.EVIUS_MEET) &&
              dataLive?.active && (
                <Col span={24}>
                  <RTMPCard />
                </Col>
              )}
          </Row>
        </Col>
      </Row>
      <ModalListRequestsParticipate
        handleModal={setViewModal}
        visible={viewModal}
        refActivity={refActivity}
      />
    </>
  )
}

export default ActivityContentManager
