import { FunctionComponent, useEffect, useState } from 'react'
import { firestore } from '@helpers/firebase'
import {
  getAnswersRef,
  getQuestionsRef,
  getUserProgressRef,
} from '@components/events/surveys/services/surveys'
import { getRef as getSurveyStatusRef } from '@components/events/surveys/services/surveyStatus'
import { Button } from 'antd'
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'

interface BasePropsType {
  userId: string
  eventId: string
  // activityId?: string
  // surveyId?: string
  onDelete?: () => void
  /**
   * Optional text to show in the button
   */
  textDelete?: string
  /**
   * Optional text to show when the answers were deleted
   */
  textDeleted?: string
}

type WithActivityIdType = BasePropsType & {
  activityId: string
  surveyId?: undefined
}

type WithSurveyIdType = BasePropsType & {
  activityId?: undefined
  surveyId: string
}

type IButtonToDeleteSurveyAnswersProps = WithActivityIdType | WithSurveyIdType

const ButtonToDeleteSurveyAnswers: FunctionComponent<
  IButtonToDeleteSurveyAnswersProps
> = (props) => {
  const { userId, eventId, onDelete } = props

  const [surveyId, setSurveyId] = useState<string | undefined>()
  const [isDeleted, setIsDeleted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function deleteSurveyAnswers(surveyId: string, userId: string) {
    // No se eliminan las respuestas, con solo eliminar el userProgress y surveyStatus el usuario puede volver a contestar la encuesta, sobreescribiendo las anteriores respuestas.

    await getUserProgressRef(surveyId, userId).delete()
    await getSurveyStatusRef(surveyId, userId).delete()
    await getAnswersRef(surveyId, userId).delete()
    await getQuestionsRef(surveyId, userId).delete()
  }

  const requestActivityData = async () => {
    const document = await firestore
      .collection('events')
      .doc(eventId)
      .collection('activities')
      .doc(props.activityId)
      .get()
    const activityData = document.data()
    console.log('This activity is', activityData)
    if (!activityData) return
    const meetingId = activityData?.meeting_id as undefined | string
    if (!meetingId) {
      console.warn(
        'without meetingId eventId',
        eventId,
        ', agendaId',
        props.activityId,
        ', activity',
        activityData,
        ', meetingId',
        meetingId,
      )
      return
    }
    return meetingId
  }

  useEffect(() => {
    if (props.surveyId === undefined && props.activityId !== undefined) {
      console.debug('request activity data from activityId because it is available')
      requestActivityData().then((id) => setSurveyId(id))
    } else if (props.surveyId !== undefined) {
      console.debug('only set surveyId from prop because it is available')
      setSurveyId(props.surveyId)
    }
  }, [props.surveyId, props.activityId])

  if (!userId || !surveyId) return <>{userId}</>

  return (
    <Button
      style={{
        background: isDeleted ? '#947A7A' : '#B8415A',
        color: '#fff',
        border: 'none',
        fontSize: '12px',
        height: '20px',
        lineHeight: '20px',
        borderRadius: '10px',
        marginLeft: '2px',
      }}
      disabled={isDeleted}
      size="small"
      icon={<DeleteOutlined />}
      onClick={(e) => {
        e.stopPropagation()
        setIsDeleting(true)
        deleteSurveyAnswers(surveyId, userId).then(() => {
          setIsDeleted(true)
          setIsDeleting(false)
          if (typeof onDelete === 'function') onDelete()
        })
      }}
    >
      {isDeleted
        ? props.textDeleted ?? 'Respuestas eliminadas'
        : props.textDelete ?? 'Eliminar respuestas'}
      {isDeleting && (
        <LoadingOutlined
          style={{
            fontSize: '12px',
            color: '#FFF',
            marginLeft: '10px',
          }}
        />
      )}
    </Button>
  )
}

export default ButtonToDeleteSurveyAnswers
