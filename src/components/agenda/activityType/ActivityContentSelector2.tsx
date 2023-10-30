import { ExtendedAgendaType } from '@Utilities/types/AgendaType'
import { StateMessage } from '@context/MessageService'
import { Activity } from '@helpers/request'
import { Alert, Button, Card, Col, Divider, Form, Input, Modal, Row, Select } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'
import InitialSVG from './svg/InitialSVG'
import ActivityContentManagerReborn from './ActivityContentManagerReborn'
import useIsDevOrStage from '@/hooks/useIsDevOrStage'

export type AvailableActivityType =
  | 'live' // Unique
  | 'meeting' // Unique
  | 'video' // YouTube or Vimeo, but this is for link, then unique
  | 'quizing' // Unique
  | 'survey' // Unique
  | 'pdf' // Unique
  | 'html' // Unique

export type AvailableContentType =
  | 'live_url' // Same
  | 'meeting_id' // Same
  | 'meeting_url' // Same
  | 'video_url'
  | 'youtube_url'
  | 'vimeo_url'
  | 'survey_id' // Same
  | 'survey_id' // Same
  | 'pdf_url' // Same
  | 'html_content' // Same
  | 'html_url' // Same

export const availableActivityType: AvailableActivityType[] = [
  'live',
  'meeting',
  'video',
  'quizing',
  'survey',
  'pdf',
  'html',
]

export const availableContentType: AvailableContentType[] = [
  'live_url',
  'meeting_id',
  'meeting_url',
  'video_url',
  'youtube_url',
  'vimeo_url',
  'survey_id',
  'pdf_url',
  'html_content',
  'html_url',
]

export const typeMap: { [key in AvailableActivityType]: AvailableContentType[] } = {
  live: ['live_url'],
  meeting: ['meeting_id', 'meeting_url'],
  video: ['vimeo_url', 'video_url', 'youtube_url'],
  survey: ['survey_id'],
  quizing: ['survey_id'],
  pdf: ['pdf_url'],
  html: ['html_content', 'html_url'],
}

export const humanizedContentTypeMap: { [key in AvailableContentType]: string } = {
  html_content: 'Contenido HTML',
  html_url: 'URL a contenido externo HTML',
  live_url: 'URL a transmisión externa',
  meeting_id: 'ID de reunión GEN.iality',
  meeting_url: 'URL a reunión externa',
  pdf_url: 'URL a PDF externa',
  survey_id: 'ID de cuestionario',
  video_url: 'URL a vídeo externo',
  vimeo_url: 'URL a Vimeo',
  youtube_url: 'URL a YouTube',
}

interface IActivityContentSelectorProps {
  event: any
  activity?: ExtendedAgendaType
}

const ActivityContentSelector: FunctionComponent<IActivityContentSelectorProps> = (
  props,
) => {
  const { activity, event } = props

  if (!activity?._id) {
    return <Alert type="warning" message="No content" />
  }

  const [activityType, setActivityType] = useState<AvailableActivityType | null>(null)
  const [contentType, setContentType] = useState<AvailableContentType | null>(null)
  const [reference, setReference] = useState<string>('')
  const [isAutoSaveType, setIsAutoSaveType] = useState(false)

  const { isNotProd } = useIsDevOrStage()

  const activityTypeOptions: { label: string; value: AvailableActivityType }[] =
    availableActivityType.map((type) => ({
      label: type.toUpperCase(),
      value: type,
    }))

  const contentTypeOptions: { label: string; value: AvailableContentType }[] =
    activityType == null
      ? []
      : typeMap[activityType].map((value) => ({
          label: value.toUpperCase(),
          value,
        }))

  const onSaveContent = () => {
    if (!contentType) {
      StateMessage.show(null, 'error', 'Falta el tipo de contenido')
      return
    }

    if (!reference) {
      StateMessage.show(null, 'error', 'Falta la referencia de contenido')
      return
    }

    Activity.Content.update(activity._id!, {
      type: contentType,
      reference: reference,
    })
      .then(() => StateMessage.show(null, 'success', 'Guardado'))
      .catch((err) => {
        console.error(err)
        StateMessage.show(null, 'error', err.toString())
      })
  }

  const onRemoveContent = () => {
    Activity.Content.delete(activity._id!)
      .then(() => StateMessage.show(null, 'info', 'Se ha eliminar una actividad'))
      .catch((err) => {
        console.error(err)
        StateMessage.show(null, 'error', err.toString())
      })
  }

  const finalContentType = activity.content?.type || contentType || '<vacío>'

  useEffect(() => {
    if (!activity.content) return

    setContentType(activity.content.type as any)
    setReference(activity.content.reference as any)
  }, [activity.content])

  useEffect(() => {
    if (activity.type?.name && activity.type?.name in typeMap) {
      setActivityType(activity.type.name as any)
    }
  }, [activity.type?.name])

  return (
    <>
      {activityType ? (
        <Card>
          <ActivityContentManagerReborn
            event={event}
            activity={activity}
            activityType={activityType}
            reference={reference}
            contentType={contentType}
            onSaveContent={onSaveContent}
            onRemoveContent={onRemoveContent}
            onReferenceChange={(newReference) => setReference(newReference)}
            onContentTypeChange={(newContentType) => setContentType(newContentType)}
            onAutoSaveChange={setIsAutoSaveType}
          />
          {!isAutoSaveType && (
            <>
              <Divider />
              <Button type="primary" disabled={!activity._id} onClick={onSaveContent}>
                Guardar
              </Button>
            </>
          )}

          <Divider />

          <Card>
            {isNotProd && <small>id: {activity._id}</small>}
            <p>Tipo de actividad: {activityType}</p>
            <p>
              Tipo de contenido:{' '}
              {humanizedContentTypeMap[finalContentType as AvailableContentType] as any}
            </p>
            <Button
              danger
              disabled={!activity._id}
              onClick={() => {
                Modal.confirm({
                  title: 'Eliminar?',
                  content: '¿Eliminar el contenido de esta actividad?',
                  onOk: () => {
                    onRemoveContent()
                  },
                })
              }}
            >
              Eliminar
            </Button>
          </Card>
        </Card>
      ) : (
        <Card>
          <Row align="middle" style={{ textAlign: 'center' }}>
            <Col span={24} style={{ marginBottom: '1em' }}>
              <h2>
                Todavía no has agregado el contenido a la actividad
                {activityType && ` de "${activityType}"`}
              </h2>
            </Col>
            <Col span={24} style={{ marginBottom: '1em' }}>
              {/* Button to go to the first tab */}
              {/* <Button onClick={() => {}} type="primary">
              Agregar contenido
            </Button> */}
            </Col>
            <Col span={24} style={{ marginBottom: '1em' }}>
              <InitialSVG style={{ width: '255px', height: '277px' }} />
            </Col>
          </Row>
        </Card>
      )}
    </>
  )
}

export default ActivityContentSelector
