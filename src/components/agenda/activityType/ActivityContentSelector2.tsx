import AgendaType from '@Utilities/types/AgendaType'
import { StateMessage } from '@context/MessageService'
import { Activity } from '@helpers/request'
import { Alert, Button, Card, Divider, Form, Input, Modal, Select } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'

type AvailableActivityType =
  | 'live' // Unique
  | 'meeting' // Unique
  | 'video' // YouTube or Vimeo, but this is for link, then unique
  | 'quizing' // Unique
  | 'survey' // Unique
  | 'pdf' // Unique
  | 'html' // Unique

type AvailableContentType =
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

const availableActivityType: AvailableActivityType[] = [
  'live',
  'meeting',
  'video',
  'quizing',
  'survey',
  'pdf',
  'html',
]

const availableContentType: AvailableContentType[] = [
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

const typeMap: { [key in AvailableActivityType]: AvailableContentType[] } = {
  live: ['live_url'],
  meeting: ['meeting_id', 'meeting_url'],
  video: ['video_url', 'youtube_url', 'vimeo_url'],
  survey: ['survey_id'],
  quizing: ['survey_id'],
  pdf: ['pdf_url'],
  html: ['html_content', 'html_url'],
}

interface IActivityContentSelectorProps {
  activityId?: string
  activity?: AgendaType
}

const ActivityContentSelector: FunctionComponent<IActivityContentSelectorProps> = (
  props,
) => {
  const { activity, activityId } = props

  if (!activity || !activityId) {
    return <Alert type="warning" message="No content" />
  }

  const [activityType, setActivityType] = useState<AvailableActivityType | null>(null)
  const [contentType, setContentType] = useState<AvailableContentType | null>(null)
  const [reference, setReference] = useState<string>('')

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

  useEffect(() => {
    if (!activity.content) return

    setContentType(activity.content.type as any)
    setReference(activity.content.reference as any)
  }, [activity.content])

  return (
    <>
      <Card>
        <small>id: {activity._id}</small>
        <p>tipo: {activityType}</p>
        <p>Guardada content-type: {activity.content?.type || '<vacío>'}</p>
        <p>Guardada content-reference: {activity.content?.reference || '<vacío>'}</p>
        <Button
          danger
          onClick={() => {
            Modal.confirm({
              title: 'Eliminar?',
              content: '¿Eliminar el contenido de esta actividad?',
              onOk: () => {
                Activity.Content.delete(activityId)
                  .then(() =>
                    StateMessage.show(null, 'info', 'Se ha eliminar una actividad'),
                  )
                  .catch((err) => {
                    console.error(err)
                    StateMessage.show(null, 'error', err.toString())
                  })
              },
            })
          }}
        >
          Eliminar
        </Button>
        <Divider />
        <Form.Item label="Tipo de actividad">
          <Select
            options={activityTypeOptions}
            onChange={(value) => {
              setActivityType(value)
              setContentType(null)
            }}
            value={activityType}
            placeholder="Tipo de actividad"
          />
        </Form.Item>
        <Form.Item label="Tipo de contenido">
          <Select
            value={contentType}
            onChange={(value) => setContentType(value)}
            placeholder="Tipo de contenido"
            options={contentTypeOptions}
          />
        </Form.Item>
      </Card>

      <Divider />

      <Card>
        <Form.Item label="Referencia de contenido">
          <Input.TextArea
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="Referencia del contenido"
          />
        </Form.Item>
        <Button
          type="primary"
          onClick={() => {
            if (!contentType) {
              StateMessage.show(null, 'error', 'Falta el tipo de contenido')
              return
            }

            if (!reference) {
              StateMessage.show(null, 'error', 'Falta la referencia de contenido')
              return
            }

            Activity.Content.update(activityId, {
              type: contentType,
              reference: reference,
            })
              .then(() => StateMessage.show(null, 'success', 'Guardado'))
              .catch((err) => {
                console.error(err)
                StateMessage.show(null, 'error', err.toString())
              })
          }}
        >
          Guardar
        </Button>
      </Card>
    </>
  )
}

export default ActivityContentSelector
