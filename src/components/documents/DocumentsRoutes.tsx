import { Fragment, FunctionComponent } from 'react'
import { Route, Routes } from 'react-router-dom'
import Documents from './documents'
import Document from './Document'

interface IDocumentsRoutesProps {
  event: any
}

const DocumentsRoutes: FunctionComponent<IDocumentsRoutesProps> = (props) => {
  const { event } = props

  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Documents event={event} />} />
        <Route path="/document" element={<Document event={event} />} />
      </Routes>
    </Fragment>
  )
}

export default DocumentsRoutes
