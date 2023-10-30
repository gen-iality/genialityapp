import { useContext, useMemo, useEffect } from 'react'

import {
  Row,
  Col,
  Affix,
  Card,
  Typography,
  Alert, // to info messages
  Button,
} from 'antd'
import useActivityType from '@context/activityType/hooks/useActivityType'
import AgendaContext from '@context/AgendaContext'
import { CurrentEventContext } from '@context/eventContext'

import VideoPreviewerCard from './components/manager/VideoPreviewerCard'

import ShareMeetLinkCard from './components/manager/ShareMeetLinkCard'
import GoToMeet from './components/manager/GoToMeet'
import { activityContentValues } from '@context/activityType/constants/ui'
import type { ActivityType } from '@context/activityType/types/activityType'

import { TypeDisplayment } from '@context/activityType/constants/enum'
import Document from '@components/documents/Document'

import QuizCMS from '../../quiz/QuizCMS'
import SurveyCMS from '../../survey/SurveyCMS'
import EviusReactQuill from '@components/shared/eviusReactQuill'
import { DownloadOutlined } from '@ant-design/icons'

export interface ActivityContentManagerProps {
  activityName: string
}

/** @deprecated use ActivityContentManagerReborn instead */
function ActivityContentManager(props: ActivityContentManagerProps) {
  const eventContext = useContext(CurrentEventContext)
  const { activityEdit, dataLive, meeting_id, obtenerDetalleActivity } =
    useContext(AgendaContext)

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
  }, [type, meeting_id])

  useEffect(() => {
    console.debug('ActivityContentManager - take:', activityContentType)
    console.debug('ActivityContentManager - with source =', contentSource)
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
          // activityId={activityEdit}
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
        />
      </>
    )
  }

  const updateSurveyIDAsContentSource = (
    id: string,
    contentValue: ActivityType.ContentValue,
  ) => {
    console.debug('survey/quiz ID will be', id)
    if (contentSource !== id) {
      saveActivityContent(contentValue, id)
    } else {
      console.info(
        `Resaving stopped because contentSource = current ID ${id} (for ${contentValue})`,
      )
    }
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
              eventId={eventContext.value._id}
              surveyId={contentSource!}
              activityId={activityEdit}
              onSave={(quizId: string) => {
                updateSurveyIDAsContentSource(quizId, activityContentType)
              }}
              onCreated={(quizId) => {
                updateSurveyIDAsContentSource(quizId, activityContentType)
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
              eventId={eventContext.value._id}
              surveyId={contentSource!}
              activityId={activityEdit}
              onSave={(surveyId: string) => {
                updateSurveyIDAsContentSource(surveyId, activityContentType)
              }}
              onCreated={(surveyId) => {
                updateSurveyIDAsContentSource(surveyId, activityContentType)
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
            {(type == TypeDisplayment.MEETING ||
              (type == TypeDisplayment.EVIUS_MEET && dataLive?.active)) && (
              <Col span={10}>
                <GoToMeet type={type} activityId={activityEdit} />
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
                  <br />
                  <Button
                    type="link"
                    onClick={() => {
                      resetActivityType('video')
                    }}
                  >
                    Eliminar contenido (para reasginar)
                  </Button>
                  <br />
                  {videoURL && (
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        const url = encodeURIComponent(videoURL)
                        window.open(
                          `https://api.geniality.com.co/api/vimeo/download?vimeo_url=${url}`,
                          '_blank',
                        )
                      }}
                    >
                      Descargar
                    </Button>
                  )}
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
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default ActivityContentManager
