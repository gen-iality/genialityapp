import { ExtendedAgendaType } from '@Utilities/types/AgendaType'
import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  AvailableActivityType,
  AvailableContentType,
  humanizedContentTypeMap,
  typeMap,
} from './ActivityContentSelector2'
import {
  Alert,
  Button,
  ButtonProps,
  Card,
  Col,
  Divider,
  Form,
  Grid,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from 'antd'
import Document from '@components/documents/Document'
import QuizCMS from '@components/quiz/QuizCMS'
import SurveyCMS from '@components/survey/SurveyCMS'
import RichTextEditor from '@components/trivia/RichTextEditor'
import ShareMeetLinkCard from './components/manager/ShareMeetLinkCard'
import GoToMeet, { GoToType } from './components/manager/GoToMeet'
import { Link } from 'react-router-dom'
import VideoPreviewerCard from './components/manager/VideoPreviewerCard'
import { TypeDisplayment } from '@context/activityType/constants/enum'
import { CheckOutlined, DownloadOutlined, ExclamationOutlined } from '@ant-design/icons'
import ActivityExternalUrlField from './components/ActivityExternalUrlField'
import AgendaContext from '@context/AgendaContext'
import ReactPlayer from 'react-player'

type ActivityContentManagerRebornProps = {
  activity: ExtendedAgendaType
  event: any
  activityType: AvailableActivityType
  contentType?: AvailableContentType | null
  reference?: string
  onContentTypeChange: (contentType: AvailableContentType) => void
  onReferenceChange: (reference: string) => void
  onSaveContent: () => void
  onRemoveContent: () => void
  onAutoSaveChange: (isAutoSave: boolean) => void
}

const autoSaveTypes: AvailableActivityType[] = ['pdf', 'survey', 'quizing']

const defaultVideo =
  'https://firebasestorage.googleapis.com/v0/b/geniality-sas.appspot.com/o/public%2Fgeniality-loading-streaming.mp4?alt=media&token=97dc8cbf-dc80-477d-862c-6be0eeb11076'

const ActivityContentManagerReborn: FunctionComponent<
  ActivityContentManagerRebornProps
> = (props) => {
  const {
    event,
    activity,
    activityType,
    reference,
    contentType,
    onReferenceChange = () => {},
    onContentTypeChange = () => {},
    onSaveContent = () => {},
    onRemoveContent = () => {},
    onAutoSaveChange = () => {},
  } = props

  const [temporalReference, setTemporalReference] = useState(reference ?? '')

  const screen = Grid.useBreakpoint()

  const { roomStatus, setRoomStatus, saveConfig } = useContext(AgendaContext)

  const contentTypeOptions: { label: string; value: AvailableContentType }[] =
    activityType == null
      ? []
      : typeMap[activityType].map((value) => ({
          label: humanizedContentTypeMap[value] ?? value.toUpperCase(),
          value,
        }))

  const looksLikeYouTubeOrVimeoLink = useMemo(() => {
    const finalUrl = temporalReference ?? reference ?? defaultVideo
    if (!finalUrl) return false
    if (!activity.content?.reference) return false

    if (
      finalUrl.toLocaleLowerCase().includes('youtube.com') ||
      finalUrl.toLocaleLowerCase().includes('youtu.be') ||
      finalUrl.toLocaleLowerCase().includes('vimeo.com')
    ) {
      return true
    }

    return false
  }, [reference, temporalReference, defaultVideo])

  const SavedChangeIndicator = () =>
    temporalReference === reference ? (
      <CheckOutlined style={{ color: 'green' }} />
    ) : (
      <ExclamationOutlined title="Cambios no guardados" style={{ color: 'red' }} />
    )

  const ButtonUpdate = (props: ButtonProps) => (
    <Button
      type="link"
      style={{ color: temporalReference === reference ? 'green' : 'red' }}
      onClick={() => {
        console.debug('will set url:', temporalReference)
        onReferenceChange(temporalReference)
        // setTemporalReference('')
        if (activityType === 'live') {
          saveConfig({ data: temporalReference })
        }
      }}
      {...props}
    >
      {temporalReference === reference ? 'Actualizado' : 'Actualizar'}
    </Button>
  )

  const switchActivityType = useCallback(() => {
    if (activityType === 'html') {
      return (
        <>
          {contentType === 'html_content' ? (
            <>
              <Button
                onClick={() => {
                  onSaveContent()
                }}
              >
                Forzar actualizar
              </Button>
              <RichTextEditor
                value={reference}
                onChange={(value) => onReferenceChange(value)}
              />
            </>
          ) : contentType === 'html_url' ? (
            <Input
              value={reference}
              placeholder="URL aquí"
              onChange={(event) => onReferenceChange(event.target.value)}
            />
          ) : null}
        </>
      )
    } else if (activityType === 'pdf') {
      return (
        <Row>
          <Col span={24}>
            <Form.Item label="URL del PDF" style={{ width: '100%' }}>
              <Input
                addonBefore={<SavedChangeIndicator />}
                value={temporalReference}
                onChange={(event) => setTemporalReference(event.target.value)}
                placeholder="URL del PDF"
                addonAfter={<ButtonUpdate />}
              />
            </Form.Item>
            <Divider />
            <Document
              simpleMode
              notRecordFileInDocuments
              activityId={activity._id}
              event={event} // Awful, but who are we
              // activityId={activityEdit}
              fromPDFDocumentURL={reference}
              onSave={(pdfUrl: string) => {
                console.debug('call onSave from Document. pdfUrl will be', pdfUrl)
                if (reference !== pdfUrl) {
                  onReferenceChange(pdfUrl)
                } else {
                  console.info(
                    `Resaving stopped because contentSource = pdfUrl ${pdfUrl}`,
                  )
                }
              }}
              onRemoveDocumentContent={() => {
                console.debug('remove content source...')
                onRemoveContent()
              }}
            />
          </Col>
        </Row>
      )
    } else if (activityType === 'quizing' || activityType === 'survey') {
      return (
        <>
          <div style={{ textAlign: 'center', width: '100%' }}>
            <Typography.Title>{activityType}</Typography.Title>
            <Typography.Text>Página de configuración del contenido.</Typography.Text>
          </div>
          {activityType === 'quizing' && (
            <>
              <QuizCMS
                eventId={event._id}
                surveyId={reference}
                activityId={activity._id}
                onSave={(quizId: string) => {
                  onReferenceChange(quizId)
                }}
                onCreated={(quizId: string) => {
                  onReferenceChange(quizId)
                }}
                onDelete={() => {
                  onRemoveContent()
                }}
              />
            </>
          )}
          {activityType === 'survey' && (
            <>
              <SurveyCMS
                eventId={event._id}
                surveyId={reference}
                activityId={activity._id}
                onSave={(surveyId: string) => {
                  onReferenceChange(surveyId)
                }}
                onCreated={(surveyId: string) => {
                  onReferenceChange(surveyId)
                }}
                onDelete={() => {
                  onRemoveContent()
                }}
              />
            </>
          )}
        </>
      )
    } else if (activityType === 'meeting') {
      return (
        <>
          {contentType === 'meeting_id' ? (
            <Row gutter={[16, 16]}>
              <Col span={10}>
                <img
                  style={{ objectFit: 'cover' }}
                  height="250px"
                  src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Freunion.jpg?alt=media&token=79983d40-cb24-4ca2-9a19-794a5eeb825b"
                />
              </Col>
              <Col span={14}>
                <GoToMeet type={GoToType.MEETING} activityId={activity._id!} />
                <ShareMeetLinkCard
                  activityId={activity._id!}
                  onChange={(finalUrl) => {
                    onReferenceChange(finalUrl)
                  }}
                />
              </Col>
            </Row>
          ) : (
            <Row gutter={[16, 16]}>
              <Form.Item label="URL de la reunión externa" style={{ width: '100%' }}>
                <Input
                  value={reference}
                  onChange={(event) => onReferenceChange(event.target.value)}
                  placeholder="URL de la reunión"
                />
              </Form.Item>
              {reference && (
                <Button type="primary">
                  <Link type="primary" to={reference} target="_blank">
                    Ir a la reunión externa
                  </Link>
                </Button>
              )}
            </Row>
          )}
        </>
      )
    } else if (activityType === 'video') {
      if (reference) {
        return (
          <Row gutter={[16, 16]}>
            <Col span={10}>
              <VideoPreviewerCard
                type={TypeDisplayment.VIDEO}
                activityName={activity.name}
                presetContent={reference}
              />
            </Col>

            <Col span={14}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    title="Video cargado"
                    bodyStyle={{ padding: '21' }}
                    style={{ borderRadius: '8px' }}
                  >
                    <Alert type="info" message={`URL: ${reference ?? '<vacía>'}`} />
                    <Button
                      danger
                      type="primary"
                      onClick={() => {
                        onReferenceChange('')
                      }}
                    >
                      Eliminar contenido (para reasginar)
                    </Button>
                    {contentType === 'vimeo_url' && (
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const url = encodeURIComponent(reference)
                          window.open(
                            `https://${
                              import.meta.env.MODE.includes('dev') ? 'devapi' : 'api'
                            }.geniality.com.co/api/vimeo/download?vimeo_url=${url}`,
                            '_blank',
                          )
                        }}
                      >
                        Descargar
                      </Button>
                    )}
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        )
      } else {
        if (contentType === 'video_url') {
          return (
            <Row>
              <Col span={24}>
                <Form.Item style={{ width: '100%' }} label="URL del vídeo">
                  <Input
                    placeholder="URL del vídeo"
                    defaultValue={temporalReference}
                    addonBefore={
                      temporalReference === reference ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <ExclamationOutlined
                          title="Cambios no guardados"
                          style={{ color: 'red' }}
                        />
                      )
                    }
                    onChange={(event) => {
                      const { value } = event.target
                      console.debug('will set', value)
                      setTemporalReference(value)
                    }}
                    addonAfter={<ButtonUpdate />}
                  />
                </Form.Item>
              </Col>
            </Row>
          )
        } else {
          return (
            <Row>
              <Col span={24}>
                <ActivityExternalUrlField
                  type="url"
                  placeholder="Enlace"
                  addonBefore={<SavedChangeIndicator />}
                  onInput={(input) => {
                    console.debug('input is', input)
                    setTemporalReference(input)
                  }}
                  addonAfter={<ButtonUpdate />}
                />
              </Col>
            </Row>
          )
        }
      }
    } else if (activityType === 'live') {
      return (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            {looksLikeYouTubeOrVimeoLink ? (
              <ReactPlayer
                style={{ aspectRatio: '16/9' }}
                muted={false}
                playing
                loop
                width="100%"
                height="100%"
                url={temporalReference || defaultVideo}
                controls={false}
              />
            ) : (
              <div style={{ aspectRatio: screen.xs ? '9/12' : '16/9' }}>
                <iframe
                  width="100%"
                  style={{ height: '100%' }}
                  allow="autoplay; fullscreen; camera *;microphone *"
                  allowFullScreen
                  src={temporalReference || defaultVideo}
                ></iframe>
              </div>
            )}
          </Col>
          <Col span={12}>
            <Col span={24}>
              <Form.Item style={{ width: '100%' }} label="URL de la transmisión">
                <Input
                  placeholder="URL de la transmisión: YouTube / Vimeo / Twitch / Zoom / Meet Google / Teams / Phone Call / etc."
                  defaultValue={temporalReference}
                  addonBefore={<SavedChangeIndicator />}
                  onChange={(event) => {
                    const { value } = event.target
                    console.debug('will set', value)
                    setTemporalReference(value)
                  }}
                  addonAfter={<ButtonUpdate />}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Typography.Text strong>
                  Estado de la actividad para tus asistentes:{' '}
                </Typography.Text>
                <Select
                  value={roomStatus}
                  onChange={(value) => {
                    console.debug('saves value of RoomStatus:', value)
                    setRoomStatus(value)
                    saveConfig({ habilitar_ingreso: value }).then(() =>
                      console.log('config saved - habilitar_ingreso:', value),
                    )
                  }}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="created_meeting_room">
                    Actividad creada
                  </Select.Option>
                  <Select.Option value="closed_meeting_room">
                    Iniciará pronto
                  </Select.Option>
                  <Select.Option value="open_meeting_room">En vivo</Select.Option>
                  <Select.Option value="ended_meeting_room">Finalizada</Select.Option>
                </Select>
              </Space>
            </Col>
          </Col>
        </Row>
      )
    } else {
      return (
        <Alert
          type="warning"
          message={`El tipo de actividad ${activityType} es desconocido`}
        />
      )
    }
  }, [
    activityType,
    activity,
    contentType,
    reference,
    onSaveContent,
    onReferenceChange,
    temporalReference,
    SavedChangeIndicator,
    ButtonUpdate,
  ])

  useEffect(() => {
    if (!contentType) {
      onContentTypeChange(typeMap[activityType][0])
    }

    return () => {
      setTemporalReference('')
    }
  }, [])

  // Autosave
  useEffect(() => {
    onAutoSaveChange(autoSaveTypes.includes(activityType))
  }, [activityType])
  // Save if autosave
  useEffect(() => {
    if (autoSaveTypes.includes(activityType) && contentType && reference) {
      if (contentType !== 'video_url') {
        onSaveContent()
      }
    }
  }, [reference, activityType, contentType])

  return (
    <>
      {!activityType && (
        <Alert type="warning" message="No se ha definido el tipo de activida" />
      )}
      <Form.Item label="Tipo de contenido">
        <Select
          value={contentType}
          onChange={(value) => onContentTypeChange(value)}
          placeholder="Tipo de contenido"
          options={contentTypeOptions}
        />
      </Form.Item>
      {switchActivityType()}
    </>
  )
}

export default ActivityContentManagerReborn