import { FunctionComponent, useEffect, useState } from 'react'
import { IQuestionDisplayer } from '../types'
import { Alert, Radio, Table } from 'antd'
import { ColumnType } from 'antd/lib/table'

interface ILikertScaleQuestionDisplayerProps extends IQuestionDisplayer {}

const LikertScaleQuestionDisplayer: FunctionComponent<
  ILikertScaleQuestionDisplayerProps
> = (props) => {
  const { onAnswer, question } = props

  if (question.type !== 'matrix')
    return <Alert type="warning" message="Encuesta malformada" />

  const [isCorrect, setIsCorrect] = useState<boolean | undefined>()
  const [dataSource, setDataSource] = useState<any[]>([])
  const [columns, setColumns] = useState<ColumnType<any>[]>([])
  const [map, setMap] = useState<{ [x: string]: number }>({})

  useEffect(() => {
    const newColumns: typeof columns = [
      {
        title: '',
        dataIndex: 'text',
      },
      ...question.choices.columns.map(
        (column) =>
          ({
            title: column.text,
            dataIndex: `${column.text}`,
            render: (item: number, record: (typeof dataSource)[number]) => (
              <Radio
                value={item}
                checked={map[record.text] === item}
                onChange={(e) => {
                  const selected = e.target.value
                  setMap({
                    ...map,
                    [record.text]: selected,
                  })
                }}
              />
            ),
          }) satisfies (typeof columns)[number],
      ),
    ]

    setColumns(newColumns)

    const newDataSource: typeof dataSource = [
      ...question.choices.rows.map((row) => {
        const currentRow: (typeof dataSource)[number] = {}
        currentRow.text = row

        question.choices.columns.forEach((column) => {
          currentRow[`${column.text}`] = column.value
        })

        return currentRow
      }),
    ]

    setDataSource(newDataSource)
  }, [question.choices, map])

  useEffect(() => {
    let correctAnswers: { [x: string]: number } = {}

    if (
      Array.isArray(question.correctAnswerIndex) &&
      question.correctAnswerIndex.length > 0
    ) {
      if (question.correctAnswerIndex.length !== question.choices.rows.length) {
        console.warn('length of the correctAnswerIndex and rows are not the same', {
          correctAnswerIndex: question.correctAnswerIndex,
          rows: question.choices.rows,
        })
      }

      question.choices.rows.forEach((row, index) => {
        correctAnswers[row] = question.correctAnswerIndex[index]
      })
      console.log(
        'load correct answer from deprecated correctAnswerIndex (for matrix only)',
      )
    } else if (
      typeof question.correctAnswer !== 'undefined' &&
      !!question.correctAnswer
    ) {
      console.log('load correct answer from raw data')
      correctAnswers = question.correctAnswer
    } else {
      console.error('the question has no correct value', { question })
    }

    if (Object.values(correctAnswers).length === 0) {
      console.warn('no correct answers found')
      return
    }

    let _isCorrect = true

    if (Object.values(correctAnswers).length === Object.values(map).length) {
      Object.entries(correctAnswers).forEach(([key, value]) => {
        console.log(map[key], '!==', value, map[key] !== value)
        if (map[key] !== value) {
          _isCorrect = false
        }
      })
    } else {
      _isCorrect = false
    }

    setIsCorrect(_isCorrect)

    const points =
      typeof question.points === 'number'
        ? question.points
        : parseInt(question.points ?? '0', 10)

    if (typeof onAnswer === 'function') {
      onAnswer(map, _isCorrect, points)
    }
  }, [map])

  return <Table dataSource={dataSource} columns={columns} pagination={false} />
}

export default LikertScaleQuestionDisplayer
