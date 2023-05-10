import { SurveysApi } from '@helpers/request'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { firestore } from '@helpers/firebase'
import { Table, Typography, Spin } from 'antd'
import { ColumnType } from 'antd/lib/table'

type UserResponse = {
  username: string
  questionTitle: string
  questionResponse: string
}

interface ITriviaResponsesSectionProps {
  surveyId: string
  event: any
}

const TriviaResponsesSection: React.FunctionComponent<ITriviaResponsesSectionProps> = (
  props,
) => {
  const { surveyId, event } = props

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

      const responsesRef = firestore
        .collection('surveys')
        .doc(surveyId)
        .collection('answers')
        .doc(questionId)
        .collection('responses')

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
      <Table loading={isLoading} dataSource={dataSource} columns={columns} />
    </>
  )
}

TriviaResponsesSection.propTypes = {
  surveyId: PropTypes.string.isRequired,
  event: PropTypes.object.isRequired,
}

export default TriviaResponsesSection
