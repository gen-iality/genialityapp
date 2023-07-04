/** Hooks and CustomHooks */
import { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import useAsyncPrepareQuizStats from '@components/quiz/useAsyncPrepareQuizStats'
import useSurveyQuery from './hooks/useSurveyQuery'
import { Card, Result, Button, Space, Spin, Col, Row, Alert } from 'antd'
import { connect } from 'react-redux'
import { PreloaderApp } from '@/PreloaderApp/PreloaderApp'

/** Helpers */
import { SurveysApi } from '@helpers/request'

/** Contexts */
import { useCurrentUser } from '@context/userContext'
import { useSurveyContext } from './surveyContext'
import WithEviusContext from '@context/withContext'

/** Components */
import SurveyComponent from './SurveyComponent'
import ResultsPanel from './resultsPanel'
import QuizProgress from '@components/quiz/QuizProgress'

interface SurveyDetailPageProps {
  cEvent: any
  cUser: any
  cEventUser: any
  cHelper: any
  surveyId: string
}

const SurveyDetailPage = ({ surveyId, cEvent }: SurveyDetailPageProps) => {
  const handleGoToCertificate = useCallback(() => {
    history.push(`/landing/${cEvent.value?._id}/certificate`)
  }, [cEvent.value])

  const [enableGoToCertificate, setEnableGoToCertificate] = useState(false)
  const [showingResultsPanel, setShowingResultsPanel] = useState(false)

  const [isResetingSurvey, setIsResetingSurvey] = useState(false)

  const cSurvey = useSurveyContext()
  const currentUser = useCurrentUser()

  const query = useSurveyQuery(cEvent.value?._id, surveyId, isResetingSurvey)
  const history = useHistory()

  useEffect(() => {
    cSurvey.loadSurvey({ ...(query.data as any) })
  }, [query.data])

  function showResultsPanel() {
    setShowingResultsPanel(true)
  }

  useEffect(() => cSurvey.stopAnswering(), [])

  useEffect(() => {
    if (!cEvent.value?._id) return
    if (!currentUser?.value?._id) return
    ;(async () => {
      const surveys = await SurveysApi.byEvent(cEvent.value._id)

      let passed = 0
      let notPassed = 0

      for (let i = 0; i < surveys.length; i++) {
        const survey = surveys[i]
        const stats = await useAsyncPrepareQuizStats(
          cEvent.value._id,
          survey._id,
          currentUser?.value?._id,
          survey,
        )

        console.debug(
          `stats: eventId=${cEvent.value._id},`,
          `surveyId=${survey._id},`,
          `userId=${currentUser?.value?._id},`,
          `survey=${survey}`,
        )
        console.debug('stats object:', stats)
        if (stats.minimum > 0) {
          if (stats.right >= stats.minimum) {
            passed = passed + 1
          } else {
            notPassed = notPassed + 1
          }
        }
      }

      if (passed === surveys.length) {
        setEnableGoToCertificate(true)
      } else {
        setEnableGoToCertificate(false)
      }
    })()
  }, [currentUser?.value?._id, cEvent.value])

  if (!cEvent || !surveyId) {
    return (
      <>
        <Space
          direction="vertical"
          size="middle"
          align="center"
          style={{ display: 'flex' }}
        >
          <h1>CARGANDO ...</h1>
        </Space>
        <PreloaderApp />
      </>
    )
  }

  if (!cSurvey.survey) {
    return <h1>Aún no se ha publicado este contenido {surveyId}</h1>
  }

  /*This is the most important part it loads the full survey status for current attendee */
  if (!cSurvey.surveyStatus === undefined) {
    return (
      <>
        <Space
          direction="vertical"
          size="middle"
          align="center"
          style={{ display: 'flex' }}
        >
          <h1>CARGANDO ...</h1>
        </Space>
        <PreloaderApp />
      </>
    )
  }

  return (
    <>
      {cSurvey.shouldDisplaySurveyAnswered() ? (
        <>
          <Space
            direction="vertical"
            size="middle"
            align="center"
            style={{ display: 'flex' }}
          >
            <Alert
              message={
                cSurvey.shouldDisplaySurveyClosedMenssage()
                  ? 'EXÁMEN CERRADO'
                  : 'EXÁMEN ABIERTO'
              }
              type="warning"
              showIcon
            />
            <Alert message={'Ya has contestado este exámen'} type="success" showIcon />
            {/* <Result
            // style={{ height: '50%', padding: '75px 75px 20px' }}
            status="success"
            title="Ya has contestado este exámen"
          /> */}
            <QuizProgress
              eventId={cEvent.value._id}
              userId={currentUser.value._id}
              surveyId={surveyId}
            />
            <Button onClick={() => showResultsPanel()} type="primary" key="console">
              Ver mis respuestas
            </Button>

            {cSurvey.shouldDisplaySurveyClosedMenssage() ? (
              <Alert message={'EXÁMEN CERRADO'} type="warning" showIcon />
            ) : (
              <>
                {cSurvey.checkThereIsAnotherTry() && (
                  <Button
                    onClick={() => {
                      setIsResetingSurvey(true)
                      cSurvey.resetSurveyStatus(currentUser.value._id).then(() => {
                        cSurvey.startAnswering()
                        setIsResetingSurvey(false)
                      })
                    }}
                    type="primary"
                    key="console"
                    disabled={isResetingSurvey}
                  >
                    Responder de nuevo {isResetingSurvey && <Spin />}
                  </Button>
                )}
              </>
            )}

            {showingResultsPanel && (
              <ResultsPanel
                eventId={cEvent.value?._id}
                currentUser={currentUser}
                idSurvey={surveyId}
              />
            )}

            {enableGoToCertificate && (
              <Button type="primary" onClick={handleGoToCertificate}>
                Descargar certificado
              </Button>
            )}
          </Space>
        </>
      ) : cSurvey.shouldDisplaySurveyClosedMenssage() ? (
        <Result title="Este exámen se  encuentra cerrado" />
      ) : (
        <Card className="surveyCard">
          <SurveyComponent eventId={cEvent.value?._id} queryData={query.data} />
        </Card>
      )}
      <Row>
        <Col span={24} type="flex" align="middle">
          Llevas {cSurvey.surveyStatsString}
        </Col>
      </Row>
    </>
  )
}

const mapStateToProps = (state: any) => ({
  isVisible: state.survey.data.surveyVisible,
})

export default connect(mapStateToProps)(
  WithEviusContext<SurveyDetailPageProps>(SurveyDetailPage),
)
