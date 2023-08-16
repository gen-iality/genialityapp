import { FunctionComponent } from 'react'
import { Route, Routes } from 'react-router-dom'
import TriviaListPage from './TriviaListPage'

import ImprovedTriviaEditPage from './ImprovedTriviaEditPage'
import TriviaReportPage from './TriviaReportPage'
import ReportQuestionPage from './ReportQuestionPage'
import TriviaRankingPage from './TriviaRankingPage'
import TriviaResponsesPage from './TriviaResponsesPage'
import TriviaAnswerMatrixPage from './TriviaAnswerMatrixPage'

export interface ITriviaRoutesProps {
  event: any
}

const TriviaRoutes: FunctionComponent<ITriviaRoutesProps> = (props) => {
  const { event } = props

  return (
    <>
      <Routes>
        <Route path="/" element={<TriviaListPage event={event} />} />
        <Route path="/edit" element={<ImprovedTriviaEditPage event={event} />} />
        <Route
          path="/edit/:surveyId"
          element={<ImprovedTriviaEditPage event={event} />}
        />
        <Route path="/report" element={<TriviaReportPage event={event} />} />
        <Route path="/report/:surveyId" element={<ReportQuestionPage />} />
        <Route path="/ranking/:surveyId" element={<TriviaRankingPage />} />
        <Route
          path="/all-answers/:surveyId"
          element={<TriviaAnswerMatrixPage event={event} />}
        />
        <Route path="/:surveyId" element={<TriviaResponsesPage event={event} />} />
      </Routes>
    </>
  )
}

export default TriviaRoutes
