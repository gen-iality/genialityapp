import { Route, Switch, withRouter } from 'react-router-dom'
import SpeakersList from './list'
import Speaker from './speaker'

function Speakers({ ...props }) {
  const { eventID, matchUrl } = props
  return (
    <Switch>
      <Route
        exact
        path={`${matchUrl}/`}
        render={() => <SpeakersList eventID={eventID} parentUrl={matchUrl} />}
      />
      <Route
        exact
        path={`${matchUrl}/speaker`}
        render={() => <Speaker eventID={eventID} parentUrl={matchUrl} />}
      />
    </Switch>
  )
}

export default withRouter(Speakers)
