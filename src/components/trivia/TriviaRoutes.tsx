import { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import TriviaListPage from './TriviaListPage'
import TriviaEditPage from './TriviaEditPage'
import TriviaReportPage from './TriviaReportPage'
import ReportQuestionPage from './ReportQuestionPage'
import TriviaRankingPage from './TriviaRankingPage'
import TriviaResponsesPage from './TriviaResponsesPage'

export interface ITriviaRoutesProps {
  event: any
  matchUrl: string
}

const TriviaRoutes: FunctionComponent<ITriviaRoutesProps> = (props) => {
  const { event, matchUrl } = props

  return (
    <>
      <Switch>
        <Route
          exact
          path={`${matchUrl}/`}
          render={(routeProps) => (
            <TriviaListPage event={event} matchUrl={routeProps.match.url} />
          )}
        />
        <Route
          exact
          path={`${matchUrl}/encuesta`}
          render={() => <TriviaEditPage event={event} />}
        />
        <Route
          exact
          path={`${matchUrl}/report`}
          render={(routeProps) => (
            <TriviaReportPage event={event} matchUrl={routeProps.match.url} />
          )}
        />
        <Route
          exact
          path={`${matchUrl}/report/:id`}
          render={(routeProps) => (
            <ReportQuestionPage surveyId={routeProps.match.params.id} />
          )}
        />
        <Route
          exact
          path={`${matchUrl}/ranking/:id`}
          render={(routeProps) => (
            <TriviaRankingPage surveyId={routeProps.match.params.id} />
          )}
        />
        <Route
          // exact
          path={`${matchUrl}/:surveyId`}
          render={(subprops) => (
            <TriviaResponsesPage
              surveyId={subprops.match.params.surveyId}
              event={event}
            />
          )}
        />
      </Switch>
    </>
  )
}

export default TriviaRoutes
