import { Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Certificados from './certificados';
import Certificado from './certificado';

function CertificadosRoutes(props) {
  const { event, match } = props;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${match.url}/`} render={() => <Certificados event={event} matchUrl={match.url} />} />
        <Route
          exact
          path={`${match.url}/certificado`}
          render={() => <Certificado event={event} matchUrl={match.url} {...props} />}
        />
      </Switch>
    </Fragment>
  );
}

export default withRouter(CertificadosRoutes);
