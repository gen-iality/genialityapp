import { FunctionComponent, useState } from 'react'
import { IQuestionDisplayer } from '../types'
import { Checkbox, Col, Form, Radio, RadioChangeEvent, Space } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'

interface IOptionsQuestionDisplayerProps extends IQuestionDisplayer {
  multiple?: boolean
}

const OptionsQuestionDisplayer: FunctionComponent<IOptionsQuestionDisplayerProps> = (
  props,
) => {
  const { onAnswer, question, multiple } = props
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>()

  const onSelect = (checked: CheckboxValueType[]) => {
    console.debug('multiple options:', checked)
    let correctAnswers: string[] = []

    if (multiple) {
      if (Array.isArray(question.correctAnswer) && question.correctAnswer.length > 0) {
        correctAnswers = question.correctAnswer
      } else if (
        Array.isArray(question.correctAnswerIndex) &&
        question.correctAnswerIndex.length > 0
      ) {
        correctAnswers = question.correctAnswerIndex.map(
          (index) => (question.choices as string[])[index],
        )
      } else {
        console.error(`the question ${question} has no correct value`)
      }
    } else {
      //
      if (typeof question.correctAnswer === 'string') {
        correctAnswers = [question.correctAnswer]
      } else if (typeof question.correctAnswerIndex === 'number') {
        correctAnswers = [(question.choices as string[])[question.correctAnswerIndex]]
      } else if (
        Array.isArray(question.correctAnswerIndex) &&
        question.correctAnswerIndex.length > 0
      ) {
        correctAnswers = [(question.choices as string[])[question.correctAnswerIndex[0]]]
      } else {
        console.error(`the question ${question} has no correct value`)
      }
      //
    }

    const normalizedCorrectAnswers = correctAnswers.map((value) =>
      value.toString().toLowerCase(),
    )
    const normalizeAnswers = checked.map((value) => value.toString().toLowerCase())
    console.log({ normalizeAnswers, normalizedCorrectAnswers })

    // Eval if the answers is in the correct answers
    const _isCorrect =
      normalizedCorrectAnswers.length === normalizeAnswers.length &&
      normalizedCorrectAnswers.every((correct) => normalizeAnswers.includes(correct))

    setIsCorrect(_isCorrect)

    const points =
      typeof question.points === 'number'
        ? question.points
        : parseInt(question.points ?? '0', 10)

    if (typeof onAnswer === 'function') {
      onAnswer(checked, _isCorrect, points)
    }
  }

  const onRadioSelect = (e: RadioChangeEvent) => {
    onSelect([e.target.value])
  }

  return (
    <Form>
      <Form.Item name="answer">
        {multiple ? (
          <Checkbox.Group onChange={onSelect} style={{ width: '100%' }}>
            {question.choices.map((choice, index) => (
              <Col key={index} span={8}>
                <Checkbox value={choice}>{choice as string}</Checkbox>
              </Col>
            ))}
          </Checkbox.Group>
        ) : (
          <Radio.Group onChange={onRadioSelect} size="large">
            <Space direction="vertical" style={{ width: '100%' }}>
              {question.choices.map((choice, index) => (
                <Radio key={index} value={choice}>
                  {choice as string}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}
      </Form.Item>
    </Form>
  )
}

export default OptionsQuestionDisplayer
