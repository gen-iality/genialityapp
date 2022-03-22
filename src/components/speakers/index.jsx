import { Route, Switch, withRouter } from 'react-router-dom';
import SpeakersList from './list';
import Speaker from './speaker';

function Speakers({ ...props }) {
  const { eventID, match } = props;
  return (
    <Switch>
      <Route exact path={`${match.url}/`} render={() => <SpeakersList eventID={eventID} matchUrl={match.url} />} />
      <Route exact path={`${match.url}/speaker`} render={() => <Speaker eventID={eventID} matchUrl={match.url} />} />
    </Switch>
  );
}

export default withRouter(Speakers);
