import { FunctionComponent, useMemo } from 'react'
import { SurveyQuestion } from './types'
import useResultProps from './hooks/useResultProps'
import { Badge, Button, Result, Typography } from 'antd'
import useIsDevOrStage from '@/hooks/useIsDevOrStage'

interface ISurveyQuestionFeedbackProps {
  question: SurveyQuestion
  answer: any
  isCorrect: boolean
  points: number
  showAsFinished?: boolean
  onClose?: () => void
  forceDevMode?: boolean
}

const SurveyQuestionFeedback: FunctionComponent<ISurveyQuestionFeedbackProps> = (
  props,
) => {
  const { isCorrect, question, answer, points, onClose, showAsFinished, forceDevMode } =
    props

  const { isDev, isStage } = useIsDevOrStage()
  const resultProps = useResultProps(isCorrect ? 'success' : 'error')

  const onCloseClick = () => {
    if (typeof onClose === 'function') {
      onClose()
    }
  }

  const debugQuestionData = useMemo(
    () => ({
      question: question.title,
      answer,
      points,
      choices: question.choices,
      correntAnswer: question.correctAnswer,
      correctAnswerIndex: question.correctAnswerIndex,
    }),
    [question, answer, points],
  )

  return (
    <Result
      className="animate__animated animate__fadeIn"
      {...resultProps}
      extra={[
        <Badge
          count={points > 0 && isCorrect ? `${points}+` : null}
          style={{ backgroundColor: '#52c41a' }}
        >
          <Button key="0" type="primary" danger={showAsFinished} onClick={onCloseClick}>
            {showAsFinished ? 'Finalizar' : 'Siguiente'}
          </Button>
        </Badge>,
      ]}
      subTitle={
        (isDev || isStage || forceDevMode) && (
          <Typography.Text type="secondary">
            <small>
              <small>
                <code>{JSON.stringify(debugQuestionData)}</code>
              </small>
            </small>
          </Typography.Text>
        )
      }
    />
  )
}

export default SurveyQuestionFeedback
