import { FunctionComponent, useMemo, useState } from 'react'
import { IQuestionDisplayer } from '../types'
import { Alert, Col, Row, Slider } from 'antd'

interface IRatingQuestionDisplayerProps extends IQuestionDisplayer {}

const RatingQuestionDisplayer: FunctionComponent<IRatingQuestionDisplayerProps> = (
  props,
) => {
  const { onAnswer, question } = props

  if (question.type !== 'rating')
    return <Alert type="warning" message="Encuesta malformada" />

  const [isCorrect, setIsCorrect] = useState<boolean | undefined>()

  const points = useMemo(
    () =>
      typeof question.points === 'number'
        ? question.points
        : parseInt(question.points ?? '0', 10),
    [question],
  )

  const onChange = (value: number) => {
    let correctAnswer: undefined | number

    console.log(question.correctAnswer)

    if (typeof question.correctAnswer === 'string') {
      correctAnswer = parseInt(question.correctAnswer, 10)
    } else if (typeof question.correctAnswer === 'number') {
      correctAnswer = question.correctAnswer
    } else if (
      Array.isArray(question.correctAnswerIndex) &&
      question.correctAnswerIndex.length > 0
    ) {
      correctAnswer =
        typeof question.correctAnswerIndex[0] === 'number'
          ? question.correctAnswerIndex[0]
          : parseInt(question.correctAnswerIndex[0], 10)
    } else {
      console.error('the question has no correct value', { question })
    }

    const normalizedValue = typeof value !== 'number' ? parseInt(value, 10) : value
    const _isCorrect =
      typeof correctAnswer === 'number'
        ? correctAnswer === normalizedValue
        : typeof correctAnswer === 'string'
        ? parseInt(correctAnswer, 10) === normalizedValue
        : false

    setIsCorrect(_isCorrect)

    if (typeof onAnswer === 'function') {
      onAnswer(value, _isCorrect, points)
    }
  }

  return (
    <Row>
      <Col span={2}>{question.minRateDescription}</Col>
      <Col span={12}>
        <Slider min={question.rateMin} max={question.rateMax} onChange={onChange} />
      </Col>
      <Col span={2}>{question.maxRateDescription}</Col>
    </Row>
  )
}

export default RatingQuestionDisplayer
