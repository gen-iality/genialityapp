import { Fragment } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import CertificateListPage from './CertificateListPage'
import CertificateEditor from './CertificateEditor'

function CertificateRoutes(props: any) {
  const { event, matchUrl } = props
  return (
    <Fragment>
      <Switch>
        <Route
          exact
          path={`${matchUrl}/`}
          render={() => <CertificateListPage event={event} parentUrl={matchUrl} />}
        />
        <Route
          exact
          path={`${matchUrl}/certificate`}
          render={() => (
            <CertificateEditor event={event} parentUrl={matchUrl} {...props} />
          )}
        />
      </Switch>
    </Fragment>
  )
}

export default withRouter(CertificateRoutes)
