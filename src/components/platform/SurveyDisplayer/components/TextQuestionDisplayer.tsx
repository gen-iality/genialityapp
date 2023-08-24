import { FunctionComponent, useState } from 'react'
import { IQuestionDisplayer } from '../types'
import { Form, Input } from 'antd'

interface ITextQuestionDisplayerProps extends IQuestionDisplayer {}

const TextQuestionDisplayer: FunctionComponent<ITextQuestionDisplayerProps> = (props) => {
  const { onAnswer, question } = props
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>()

  const onChange = (text: string) => {
    let correctAnswer: undefined | string

    if (typeof question.correctAnswer === 'string') {
      correctAnswer = question.correctAnswer
    } else if (typeof question.correctAnswerIndex === 'number') {
      correctAnswer = (question.choices as string[])[question.correctAnswerIndex]
    } else if (
      Array.isArray(question.correctAnswerIndex) &&
      question.correctAnswerIndex.length > 0
    ) {
      correctAnswer = (question.choices as string[])[question.correctAnswerIndex[0]]
    } else {
      console.error(`the question ${question} has no correct value`)
    }

    const _isCorrect = text === correctAnswer
    setIsCorrect(_isCorrect)

    const points =
      typeof question.points === 'number'
        ? question.points
        : parseInt(question.points ?? '0', 10)

    if (typeof onAnswer === 'function') {
      onAnswer(text, _isCorrect, points)
    }
  }

  return (
    <Form>
      <Form.Item name="answer">
        <Input.TextArea
          rows={4}
          placeholder="Escriba un texto"
          onChange={(event) => {
            onChange(event.target.value)
          }}
          style={{
            borderColor: isCorrect === undefined ? '' : isCorrect ? '#71cf57' : '#db4264',
          }}
        />
      </Form.Item>
    </Form>
  )
}

export default TextQuestionDisplayer
