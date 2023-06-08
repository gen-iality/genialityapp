import { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import CertificateListPage from './CertificateListPage'
import CertificateEditorPage from './CertificateEditorPage'

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
            <CertificateEditorPage event={event} parentUrl={matchUrl} {...props} />
          )}
        />
      </Switch>
    </Fragment>
  )
}

export default CertificateRoutes
