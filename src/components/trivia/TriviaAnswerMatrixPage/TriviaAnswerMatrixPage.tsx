import { CSSProperties, FunctionComponent, useEffect, useMemo, useState } from 'react'
import useFetchSurvey from './hooks/useFetchSurvey'
import { Spin, Typography, Table, Space, Button, Badge } from 'antd'
import { ColumnType } from 'antd/es/table'
import useRequestAnswers from './hooks/useRequestAnswers'
import usePrepareDataSource from './hooks/usePrepareDataSource'
import useExportAsXLSX from './hooks/useExportAsXLSX'
import convertAnswer from './utils/convert-answer'

type Props = {
  surveyId: string
  event: any
}

const tonalities = {
  autumn: {
    good: '#d7e2d3',
    bad: '#edb18a',
  },
  pastel: {
    good: '#c5e2c7',
    bad: '#ead2d9',
  },
}

const tonality: keyof typeof tonalities = 'autumn'

const styles: {
  goodAnswer: CSSProperties
  badAnswer: CSSProperties
} = {
  goodAnswer: { backgroundColor: tonalities[tonality].good },
  badAnswer: { backgroundColor: tonalities[tonality].bad },
}

const TriviaAnswerMatrixPage: FunctionComponent<Props> = (props) => {
  const { surveyId, event } = props

  const [isLoading, setIsLoading] = useState(true)
  const [columns, setColumns] = useState<ColumnType<any>[]>([])

  const survey = useFetchSurvey(event._id, surveyId)

  const questions = useMemo(() => {
    if (survey) return survey.questions as any[]
    return []
  }, [survey])

  const userAnswersPairs = useRequestAnswers(surveyId, questions)

  const dataSource = usePrepareDataSource(userAnswersPairs, () => {
    if (isLoading) setIsLoading(false)
  })

  const onExportAsXLXS = useExportAsXLSX(dataSource, survey, questions)

  useEffect(() => {
    // : min. N
    const extraScoreTitle =
      typeof survey?.points === 'number' ? `(min. ${survey?.points})` : ''

    // Set the columns
    setColumns([
      { title: 'Usuario', dataIndex: 'names' },
      {
        title: `Puntos ${extraScoreTitle}`.trim(),
        dataIndex: 'right',
        render: (item) => {
          return {
            props: {
              style: (survey?.points ?? 0) <= item ? styles.goodAnswer : styles.badAnswer,
            },
            children: item,
          }
        },
      },
      { title: 'Intentos', dataIndex: 'tried' },
      ...questions.map(
        (question: any) =>
          ({
            title: question.title,
            dataIndex: question.id,
            render: (item, record) => {
              const currentQuestion = questions.find(
                (_question) => _question.id == question.id,
              )
              if (!currentQuestion) {
                return item
              }
              const isOk =
                convertAnswer(currentQuestion.correctAnswer) == convertAnswer(item)
              return {
                props: {
                  style: isOk ? styles.goodAnswer : styles.badAnswer,
                },
                children: item,
              }
            },
          }) as (typeof columns)[number],
      ),
    ])
  }, [questions])

  return (
    <>
      <Typography.Title>
        Cuestionario: {!survey ? <Spin /> : survey.survey}
      </Typography.Title>
      <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Space data-testid="info-panel-exam-report">
          <Typography.Paragraph>Hay {questions.length} preguntas.</Typography.Paragraph>
        </Space>
        <Space data-testid="btn-export-xlsx-for-exam-report">
          <Button onClick={onExportAsXLXS}>Exportar como XLXS</Button>
        </Space>
      </Space>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 'max-content' }}
      />
    </>
  )
}

export default TriviaAnswerMatrixPage
