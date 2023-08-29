import { Alert, Progress, Space, Tooltip, Typography } from 'antd'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { AvailableSurveyStatus, ISurveyDisplayerUIProps } from './types'

import WelcomeSurvey from './sections/WelcomeSurvey'
import QuestionDisplayer from './components/QuestionDisplayer'
import SurveyQuestionFeedback from './SurveyQuestionFeedback'
import FinishSurvey from './sections/FinishSurvey'
import useIsDevOrStage from '@/hooks/useIsDevOrStage'

const SurveyDisplayerUI: FunctionComponent<ISurveyDisplayerUIProps> = (props) => {
  const {
    title,
    questionIndex: incomingQuestionIndex,
    status: incomingStatus,
    onChangeQuestionIndex,
    onAnswer,
    onFinish,
    questions,
    welcomeMessage,
    finishMessage,
    winMessage,
    loseMessage,
    isGradable,
  } = props

  const { isDev, isStage } = useIsDevOrStage()
  /**
   * It is used to hides the welcome message and shows the questions
   */
  const [status, setStatus] = useState<AvailableSurveyStatus>(incomingStatus ?? 'initial')
  const [questionIndex, setQuestionIndex] = useState<typeof incomingQuestionIndex>(0)
  const [isFeedbackShown, setIsFeedbackShown] = useState(false)
  const [lastAnswerReport, setLastAnswerReport] = useState<
    | {
        answer: any
        isCorrect: boolean
        points: number
        question: (typeof questions)[number]
      }
    | undefined
  >(undefined)
  const [isSwitchingQuestion, setIsSwitchingQuestion] = useState(false)

  const nextPageIsTheEnd = useMemo(() => {
    return questionIndex == questions.length - 1
  }, [questions, questionIndex])

  const question = useMemo(() => {
    if (!Array.isArray(questions)) return
    if (questions.length === 0) return
    if (questionIndex >= questions.length) return

    return questions[questionIndex]
  }, [questionIndex, questions])

  const onStartSurvey = () => {
    setStatus('started')
  }

  const onEachAnswer = async (answer: any, isCorrect: boolean, points: number) => {
    setIsSwitchingQuestion(true)

    setLastAnswerReport({
      answer,
      isCorrect,
      points,
      question: question!,
    })

    if (isGradable) {
      // Show that feedback component
      setIsFeedbackShown(true)
    } else {
      // Pass as shown
      onFeedbackClose()
    }

    if (typeof onAnswer === 'function') {
      try {
        await onAnswer(
          question!,
          answer,
          isCorrect,
          points,
          questionIndex === questions.length - 1,
        )
      } catch (err) {
        console.error(err)
      } finally {
        if (isGradable) {
          // Show that feedback component
          setIsFeedbackShown(true)
        }
        setIsSwitchingQuestion(false)
      }
    }
  }

  const onNextPage = () => {
    setIsFeedbackShown(false)

    const newQuestionIndex = questionIndex + 1

    if (newQuestionIndex >= questions.length) {
      setQuestionIndex(0)
      setStatus('finished')
    } else {
      setQuestionIndex(newQuestionIndex)
      // if (typeof onChangeQuestionIndex === 'function') {
      //   onChangeQuestionIndex(newQuestionIndex)
      // }
    }
  }

  const onFeedbackClose = () => {
    setLastAnswerReport(undefined)
    onNextPage()
  }

  /**
   * If the parent updates the questionIndex, we update the local questionIndex
   */
  useEffect(() => {
    if (incomingQuestionIndex !== questionIndex) {
      setQuestionIndex(incomingQuestionIndex)
    }
  }, [incomingQuestionIndex])

  /**
   * If the questionIndex is updated, call the callback function if exists
   */
  useEffect(() => {
    if (questionIndex !== incomingQuestionIndex) {
      if (typeof onChangeQuestionIndex === 'function') {
        onChangeQuestionIndex(questionIndex, questionIndex == questions.length - 1)
      }
    }
  }, [questionIndex])

  return (
    <section>
      <Space.Compact block size={'large'} direction="vertical">
        <Typography.Title style={{ textAlign: 'center' }} level={5}>
          {title}
        </Typography.Title>

        {status === 'initial' ? (
          <WelcomeSurvey extraMessage={welcomeMessage} onStart={onStartSurvey} />
        ) : status === 'started' ? (
          typeof question === 'undefined' ? (
            <Alert type="error" message="No hay preguntas" />
          ) : (
            <Space.Compact block direction="vertical">
              <section
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Tooltip title="Progreso de la encuesta">
                  <Progress
                    percent={100 * (questionIndex / questions.length)}
                    style={{ display: 'block' }}
                    showInfo={false}
                  />
                </Tooltip>
                <Typography.Text>
                  Pregunta {questionIndex + 1} de {questions.length}
                </Typography.Text>
              </section>
              {isSwitchingQuestion ? (
                <Alert closable type="info" message="Cambiando de pregunta..." />
              ) : undefined}
              {isFeedbackShown && lastAnswerReport ? (
                <SurveyQuestionFeedback
                  answer={lastAnswerReport.answer}
                  isCorrect={!!lastAnswerReport.isCorrect}
                  extraMessage={!!lastAnswerReport.isCorrect ? winMessage : loseMessage}
                  points={lastAnswerReport.points}
                  question={question}
                  showAsFinished={nextPageIsTheEnd}
                  onClose={onFeedbackClose}
                />
              ) : (
                <QuestionDisplayer question={question} onAnswer={onEachAnswer} />
              )}
              {(isDev || isStage) && question && (
                <Alert
                  type="info"
                  message={`depuración: ${JSON.stringify(
                    question.correctAnswer,
                  )}* (${JSON.stringify(question.correctAnswerIndex)})`}
                />
              )}
            </Space.Compact>
          )
        ) : (
          <FinishSurvey extraMessage={finishMessage} onFinish={onFinish} />
        )}

        <Space></Space>
      </Space.Compact>
    </section>
  )
}

export default SurveyDisplayerUI
