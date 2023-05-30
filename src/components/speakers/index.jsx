import { Route, Switch, withRouter } from 'react-router-dom'
import SpeakersListPage from './SpeakersListPage'
import SpeakerEditPage from './SpeakerEditPage'

function Speakers({ ...props }) {
  const { eventID, matchUrl } = props
  return (
    <Switch>
      <Route
        exact
        path={`${matchUrl}/`}
        render={() => <SpeakersListPage eventID={eventID} parentUrl={matchUrl} />}
      />
      <Route
        exact
        path={`${matchUrl}/speaker`}
        render={() => <SpeakerEditPage eventID={eventID} parentUrl={matchUrl} />}
      />
    </Switch>
  )
}

export default withRouter(Speakers)
