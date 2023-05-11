import { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import Trivia from './trivia'
import TriviaEdit from './edit'
import TriviaReport from './report'
import ReportQuestion from './reportQuestion'
import Ranking from './ranking'
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
            <Trivia event={event} matchUrl={routeProps.match.url} />
          )}
        />
        <Route
          exact
          path={`${matchUrl}/encuesta`}
          render={() => <TriviaEdit event={event} />}
        />
        <Route
          exact
          path={`${matchUrl}/report`}
          render={(routeProps) => (
            <TriviaReport event={event} matchUrl={routeProps.match.url} />
          )}
        />
        <Route
          exact
          path={`${matchUrl}/report/:id`}
          render={() => <ReportQuestion event={event} />}
        />
        <Route
          exact
          path={`${matchUrl}/ranking/:id`}
          render={() => <Ranking event={event} />}
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
