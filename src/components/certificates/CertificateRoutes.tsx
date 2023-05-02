import { Fragment } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import CertificateListPage from './CertificateListPage'
import CertificateEditor from './CertificateEditor'

function CertificateRoutes(props: any) {
  const { event, match } = props
  return (
    <Fragment>
      <Switch>
        <Route
          exact
          path={`${match.url}/`}
          render={() => <CertificateListPage event={event} matchUrl={match.url} />}
        />
        <Route
          exact
          path={`${match.url}/certificate`}
          render={() => (
            <CertificateEditor event={event} matchUrl={match.url} {...props} />
          )}
        />
      </Switch>
    </Fragment>
  )
}

export default withRouter(CertificateRoutes)
