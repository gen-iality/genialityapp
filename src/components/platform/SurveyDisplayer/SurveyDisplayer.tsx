import { FunctionComponent, ReactNode, useEffect, useMemo } from 'react'
import { ISurveyDisplayerUIProps, SurveyPreModel } from './types'
import { Result } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { setCurrentPage } from '@components/events/surveys/services/surveys'
import { FB } from '@helpers/firestore-request'
import {
  addRightPoints,
  addTriesNumber,
} from '@components/events/surveys/services/surveyStatus'

interface ISurveyDisplayerProps {
  user: any
  eventId?: string
  survey?: SurveyPreModel
  surveyStatus?: any
  onFinish?: () => void
  render: (props: ISurveyDisplayerUIProps) => ReactNode
  onReset: ISurveyDisplayerUIProps['welcomeAction']
}

const SurveyDisplayer: FunctionComponent<ISurveyDisplayerProps> = (props) => {
  const {
    survey,
    surveyStatus,
    eventId,
    user,
    render,
    onFinish: onHereFinish,
    onReset,
  } = props

  const isGradable = useMemo(
    () =>
      !!survey
        ? typeof survey.allow_gradable_survey === 'boolean'
          ? survey.allow_gradable_survey
          : survey.allow_gradable_survey === 'true'
        : false,
    [survey],
  )

  const onChangeQuestionIndex: ISurveyDisplayerUIProps['onChangeQuestionIndex'] = async (
    questionIndex,
  ) => {
    if (!user?._id || !eventId || !survey) {
      console.error('cannot set the current page for invalid data', {
        user,
        eventId,
        survey,
      })
      return
    }
    /**
     * use /surveys/:surveyId/userProgress/:userId to save the progress
     */
    await setCurrentPage(survey._id!, user._id, questionIndex)
  }

  const onAnswer: ISurveyDisplayerUIProps['onAnswer'] = async (
    question,
    answer,
    isCorrect,
    points,
    noMoreQuestion,
  ) => {
    /**
     * Save the response
     */
    const data: any = {
      response: answer,
      created: new Date(),
      id_user: user._id,
      user_email: user.email,
      user_name: user.names,
      id_survey: survey?._id,
      isCorrect, // It is new!!
    }
    if (question.correctAnswer !== undefined) {
      data['correctAnswer'] = question.correctAnswer
    }
    FB.Surveys.Answers.Responses.edit(survey?._id!, question.id, user._id, data, {})

    if (isCorrect) addRightPoints(survey?._id!, user._id, points)

    const status = 'completed'

    if (noMoreQuestion) {
      await addTriesNumber(
        survey?._id!,
        user._id,
        surveyStatus?.tried || 0, // Tried amount
        survey?.tries ?? 1, // Max tries
        status,
      )
    }
  }

  const onFinish = () => {
    // setCurrentPage(survey?._id!, user._id, 0)
    if (typeof onHereFinish === 'function') {
      onHereFinish()
    }
  }

  if (!eventId) {
    return <Result icon={<LoadingOutlined />} title="Esperando datos del curso" />
  }

  if (!user?._id) {
    return <Result icon={<LoadingOutlined />} title="Esperando datos del usuario" />
  }

  if (!survey) {
    return <Result icon={<LoadingOutlined />} title="Esperando datos de la encuesta" />
  }

  return render({
    questions: survey.questions,
    title: survey.survey,
    questionIndex: 0,
    minimumScore: survey.minimumScore ?? 0,
    finishMessage: survey.neutral_Message,
    welcomeMessage: survey.initialMessage,
    welcomeAction: onReset,
    winMessage: survey.win_Message,
    loseMessage: survey.lose_Message,
    isGradable: isGradable,
    onAnswer: onAnswer,
    onChangeQuestionIndex: onChangeQuestionIndex,
    onFinish: onFinish,
    // status="initial"
  })
}

export default SurveyDisplayer
