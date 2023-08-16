import { SurveysApi } from '@helpers/request'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { firestore } from '@helpers/firebase'
import { Table, Typography, Spin, Space, Button } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { utils, writeFileXLSX } from 'xlsx'
import { FB } from '@helpers/firestore-request'
import { useParams } from 'react-router'

type UserResponse = {
  username: string
  questionTitle: string
  questionResponse: string
}

interface ITriviaResponsesPageProps {
  event: any
}

const TriviaResponsesPage: React.FunctionComponent<ITriviaResponsesPageProps> = (
  props,
) => {
  const { event } = props
  const { surveyId } = useParams<{ surveyId: string }>()

  const [isLoading, setIsLoading] = useState(false)
  const [survey, setSurvey] = useState<any | undefined>()
  const [questions, setQuestions] = useState<any[]>([])
  const [columns] = useState<ColumnType<UserResponse>[]>([
    {
      title: 'Pregunta',
      dataIndex: 'questionTitle',
    },
    {
      title: 'Usuario',
      dataIndex: 'username',
    },
    {
      title: 'Respuesta',
      dataIndex: 'questionResponse',
    },
  ])
  const [dataSource, setDataSource] = useState<UserResponse[]>([])

  const onExportAsXLXS = () => {
    const ws = utils.json_to_sheet(
      dataSource.map((data) => {
        return {
          'Pregunta del cuestionario': data.questionTitle,
          'Nombre de usuario': data.username,
          'Respuesta dada': data.questionResponse,
        }
      }),
    )
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Asistentes')
    writeFileXLSX(wb, `survey_${survey?.survey || 'cuestionario'}.xls`)
  }

  useEffect(() => {
    setIsLoading(true)
    SurveysApi.getOne(event._id, surveyId)
      .then((surveyData) => {
        setSurvey(surveyData)
        // Save the questions too
        setQuestions(surveyData.questions)
      })
      .finally(() => setIsLoading(false))
  }, [surveyId, event._id])

  useEffect(() => {
    const promiseAllQuestionAndResponses = questions.map(async (question) => {
      const questionId = question.id

      const responsesRef = FB.Surveys.Answers.Responses.collection(surveyId!, questionId)

      const responsesSnapshot = await responsesRef.get()

      const questionAndResponses: { question: any; responses: any[] } = {
        question,
        responses: [],
      }

      responsesSnapshot.forEach((doc) => {
        const response = doc.data()
        // console.log(doc.id, ' => ', response)
        questionAndResponses.responses.push(response)
      })

      return questionAndResponses
    })

    Promise.all(promiseAllQuestionAndResponses).then((questionAndResponsesList) => {
      const data: typeof dataSource = []
      questionAndResponsesList.map((questionAndResponses) => {
        questionAndResponses.responses.forEach((response) => {
          data.push({
            username: response.user_name,
            questionResponse: response.response,
            questionTitle: questionAndResponses.question.title,
          })
        })
      })

      setDataSource(data)
    })
  }, [questions])

  return (
    <>
      <Typography.Title>
        Cuestionario: {survey === undefined ? <Spin /> : survey.survey}
      </Typography.Title>
      <Space align="end" size="large">
        <Button onClick={onExportAsXLXS}>Exportar como XLXS</Button>
      </Space>
      <Table loading={isLoading} dataSource={dataSource} columns={columns} />
    </>
  )
}

TriviaResponsesPage.propTypes = {
  surveyId: PropTypes.string.isRequired,
  event: PropTypes.object.isRequired,
}

export default TriviaResponsesPage
