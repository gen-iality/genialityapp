import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import CertificateListPage from './CertificateListPage'
import CertificateEditorPage from './CertificateEditorPage'

function CertificateRoutes(props: any) {
  const { event } = props
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<CertificateListPage event={event} />} />
        <Route
          path="/certificate"
          element={<CertificateEditorPage event={event} {...props} />}
        />
      </Routes>
    </Fragment>
  )
}

export default CertificateRoutes
