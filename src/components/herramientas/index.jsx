import { Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Herramientas from './Herramientas';
import Herramienta from './Herramienta';

function HerramientaRoutes(props) {
  const { event, match } = props;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${match.url}/`} render={() => <Herramientas event={event} matchUrl={match.url} />} />
        <Route
          exact
          path={`${match.url}/herramienta`}
          render={() => <Herramienta event={event} matchUrl={match.url} {...props} />}
        />
      </Switch>
    </Fragment>
  );
}

export default withRouter(HerramientaRoutes);
