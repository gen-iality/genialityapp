import { Route, Switch } from 'react-router-dom'
import SpeakersListPage from './SpeakersListPage'
import SpeakerEditPage from './SpeakerEditPage'
import { FunctionComponent } from 'react'

interface ISpeakersRoutesProps {
  eventID: string
  matchUrl: string
}

const SpeakersRoutes: FunctionComponent<ISpeakersRoutesProps> = (props) => {
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

export default SpeakersRoutes
