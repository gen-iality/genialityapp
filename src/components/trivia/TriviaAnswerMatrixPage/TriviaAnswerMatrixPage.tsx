import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import useFetchSurvey from './hooks/useFetchSurvey'
import { Spin, Typography, Table, Space, Button } from 'antd'
import { ColumnType } from 'antd/es/table'
import useRequestAnswers from './hooks/useRequestAnswers'
import usePrepareDataSource from './hooks/usePrepareDataSource'
import useExportAsXLSX from './hooks/useExportAsXLSX'

type Props = {
  surveyId: string
  event: any
}

const TriviaAnswerMatrixPage: FunctionComponent<Props> = (props) => {
  const { surveyId, event } = props

  const [columns, setColumns] = useState<ColumnType<any>[]>([])

  const survey = useFetchSurvey(event._id, surveyId)

  const questions = useMemo(() => {
    if (survey) return survey.questions as any[]
    return []
  }, [survey])

  const userAnswersPairs = useRequestAnswers(surveyId, questions)

  const dataSource = usePrepareDataSource(userAnswersPairs)

  const onExportAsXLXS = useExportAsXLSX(dataSource, survey, questions)

  useEffect(() => {
    setColumns([
      { title: 'Usuario', dataIndex: 'names' },
      ...questions.map((question: any) => ({
        title: question.title,
        dataIndex: question.id,
      })),
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
      <Table dataSource={dataSource} columns={columns} scroll={{ x: true }} />
    </>
  )
}

export default TriviaAnswerMatrixPage
