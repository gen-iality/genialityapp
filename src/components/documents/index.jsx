import { Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Documents from './documents';
import Document from './Document';
/* import DocumentsEdit from './edit_old'; */
/* import DocumentsPermission from './filePermission_old'; */

function DocumentsRoutes({ ...props }) {
  const { event, match } = props;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${match.url}/`} render={() => <Documents event={event} matchUrl={match.url} />} />
        <Route
          exact
          path={`${match.url}/document`}
          render={() => <Document event={event} matchUrl={match.url} {...props} />}
        />
      </Switch>
    </Fragment>
  );
}

export default withRouter(DocumentsRoutes);
