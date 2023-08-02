import { useState, useEffect, FunctionComponent } from 'react'
import { Alert, Card, Space, Typography } from 'antd'
import SurveyAnswers from './services/surveyAnswersService'
import { LoadingOutlined } from '@ant-design/icons'
import useSurveyQuery from './hooks/useSurveyQuery'

interface IResultsPanelProps {
  eventId: string
  surveyId: string
  currentUser: any
}

const ResultsPanel: FunctionComponent<IResultsPanelProps> = (props) => {
  const { eventId, surveyId, currentUser } = props

  const query = useSurveyQuery(eventId, surveyId)
  // The first question is not a real question!!
  const realQuestions: any[] = ((query?.data as undefined | any).questions || []).filter(
    (question: any) => !!question.id,
  )

  const [userAnswers, setUserAnswers] = useState<undefined | any[]>(undefined)

  async function getUserAnswers(questionId: string) {
    const userAnswer = await SurveyAnswers.getAnswersQuestionV2(
      surveyId, // survey ID
      questionId, // current question
      currentUser.value._id, // who
    )
    //console.log('respusuario userAnswer', userAnswer)

    return userAnswer
  }

  useEffect(() => {
    //console.log('respusuario', currentUser, query)
    if (!query.data) return
    if (!surveyId || !currentUser.value._id) return

    console.debug(
      'got questions to see its answers:',
      (query.data as undefined | any).questions,
      'but real ones:',
      realQuestions,
    )

    Promise.all(
      realQuestions.map(async (question: any) => {
        if (!question.id) return null
        // Search the answer
        const userAnswer = await getUserAnswers(question.id)

        const basicAnswerReport = {
          exists: false,
          id: question.id,
          correctAnswer: question.correctAnswer,
          title: question.title,
        }

        // Save the current question, and the correct answer
        if (userAnswer !== undefined) {
          return {
            ...basicAnswerReport,
            exists: true,
            answer: userAnswer.response,
            isCorrectAnswer: userAnswer.correctAnswer,
          }
        } else {
          console.debug('no answer found for question.id:', question.id, question)
          return {
            ...basicAnswerReport,
            exists: false,
            answer: undefined,
            isCorrectAnswer: undefined,
          }
        }
      }),
    ).then((userAnswersLocalList) => {
      const newUserAnswers = userAnswersLocalList.filter((report) => report !== null)
      setUserAnswers(newUserAnswers)
    })
  }, [currentUser.value._id, surveyId, query.data])

  return (
    <div>
      {userAnswers === undefined && (
        <Space direction="vertical" size="middle" align="center">
          <p style={{ fontWeight: '700' }}>Cargando resultados...</p>
          <LoadingOutlined style={{ fontSize: '50px', color: '#808080' }} />
        </Space>
      )}
      {userAnswers !== undefined && (
        <>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Alert
              type="info"
              message={`Se han obtenido ${realQuestions.length} preguntas`}
            />
            {userAnswers.map((answer, index) => (
              <Card key={index}>
                <Typography.Paragraph strong>
                  {`${index + 1}. ${answer.title}`}
                </Typography.Paragraph>
                <Typography.Paragraph>
                  {'Respuesta correcta: '}
                  <Typography.Text strong>{answer.correctAnswer}</Typography.Text>
                </Typography.Paragraph>
                {answer.exists ? (
                  <Alert
                    type={answer.isCorrectAnswer ? 'success' : 'error'}
                    message={`Tu respuesta: ${answer.answer || '<vacío>'}`}
                  />
                ) : (
                  <Alert type="warning" message="La pregunta no fue respondida" />
                )}
              </Card>
            ))}
          </Space>
        </>
      )}
    </div>
  )
}

export default ResultsPanel
