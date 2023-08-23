import { useState, useEffect, FunctionComponent } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { SurveysApi } from '@helpers/request'
import { getTotalVotes } from './services'

import { List, Card, Spin, Empty, notification } from 'antd'
import Header from '@antdComponents/Header'

type SurveyQuestionType = any // TODO: define ths type, and move to Utilities/types

export interface ITriviaReportPageProps {
  event: any
}

const TriviaReportPage: FunctionComponent<ITriviaReportPageProps> = (props) => {
  const { event } = props

  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestionType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const location = useLocation()

  const loadData = async () => {
    console.log('report:', { report: location.state.report })

    try {
      const response = await SurveysApi.getOne(event._id, location.state.report)
      const promiseOfVotes = Promise.all(
        response.questions.map(async (question: any) => {
          const infoQuestion = await getTotalVotes(location.state.report, question)
          console.log('infoQuestion:', infoQuestion)
          return infoQuestion
        }),
      )

      const questions = await promiseOfVotes
      setSurveyQuestions(questions)
    } catch (err) {
      console.error(err)
      notification.open({
        message: 'No se registran respuestas guardadas',
        description: 'No hay respuestas y/o preguntas para realizar el informe',
      })
    }
  }

  useEffect(() => {
    setIsLoading(true)
    loadData().finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <Spin />

  return (
    <>
      <Header title="Detalle de la Evaluación" back />

      {surveyQuestions.length > 0 ? (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          loading={isLoading}
          dataSource={surveyQuestions}
          renderItem={(item) => (
            <List.Item>
              <Link
                to={`/${item.id}`}
                state={{
                  titleQuestion: item.title,
                  surveyId: location.state.report,
                }}
              >
                <Card title={item.title ? item.title : 'Pregunta sin Titulo'} hoverable>
                  {item.quantityResponses === 0
                    ? 'No se ha respondido aun la pregunta'
                    : `${item.quantityResponses} usuarios han respondido la pregunta`}
                </Card>
              </Link>
            </List.Item>
          )}
        />
      ) : (
        <Empty />
      )}
    </>
  )
}

export default TriviaReportPage
