import { Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Espacios from './Espacios';
import Espacio from './Espacio';

function EspacioRoutes(props) {
  const { event, match } = props;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${match.url}/`} render={() => <Espacios event={event} matchUrl={match.url} />} />
        <Route
          exact
          path={`${match.url}/espacio`}
          render={() => <Espacio event={event} matchUrl={match.url} {...props} />}
        />
      </Switch>
    </Fragment>
  );
}

export default withRouter(EspacioRoutes);
