import { Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import CertificateListPage from './CertificateListPage';
import Certificado from './certificado';

function CertificateRoutes(props: any) {
  const { event, match } = props;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${match.url}/`} render={() => <CertificateListPage event={event} matchUrl={match.url} />} />
        <Route
          exact
          path={`${match.url}/certificate`}
          render={() => <Certificado event={event} matchUrl={match.url} {...props} />}
        />
      </Switch>
    </Fragment>
  );
}

export default withRouter(CertificateRoutes);
