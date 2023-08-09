import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import CertificateListPage from './CertificateListPage'
import CertificateEditorPage from './CertificateEditorPage'

function CertificateRoutes(props: any) {
  const { event, matchUrl } = props
  return (
    <Fragment>
      <Routes>
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
      </Routes>
    </Fragment>
  )
}

export default CertificateRoutes
