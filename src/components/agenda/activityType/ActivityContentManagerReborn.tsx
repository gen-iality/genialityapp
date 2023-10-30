import { ExtendedAgendaType } from '@Utilities/types/AgendaType'
import { FunctionComponent, useCallback, useEffect } from 'react'
import {
  AvailableActivityType,
  AvailableContentType,
  typeMap,
} from './ActivityContentSelector2'
import { Alert, Button, Form, Input, Select, Typography } from 'antd'
import Document from '@components/documents/Document'
import QuizCMS from '@components/quiz/QuizCMS'
import SurveyCMS from '@components/survey/SurveyCMS'
import RichTextEditor from '@components/trivia/RichTextEditor'

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

  const contentTypeOptions: { label: string; value: AvailableContentType }[] =
    activityType == null
      ? []
      : typeMap[activityType].map((value) => ({
          label: value.toUpperCase(),
          value,
        }))

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
              console.info(`Resaving stopped because contentSource = pdfUrl ${pdfUrl}`)
            }
          }}
          onRemoveDocumentContent={() => {
            console.debug('remove content source...')
            onRemoveContent()
          }}
        />
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
    }
  }, [activityType, activity, contentType, reference, onSaveContent, onReferenceChange])

  useEffect(() => {
    if (!contentType) {
      onContentTypeChange(typeMap[activityType][0])
    }
  }, [])

  // Autosave
  useEffect(() => {
    onAutoSaveChange(autoSaveTypes.includes(activityType))
  }, [activityType])
  // Save if autosave
  useEffect(() => {
    if (autoSaveTypes.includes(activityType) && contentType && reference) {
      onSaveContent()
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
