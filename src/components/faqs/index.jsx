import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import Faqs from './faqs'
import Faq from './faq'

function FaqsRoutes(props) {
  const { event, matchUrl } = props
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Faqs event={event} parentUrl={matchUrl} />} />
        <Route
          path="faq"
          element={<Faq event={event} parentUrl={matchUrl} {...props} />}
        />
      </Routes>
    </Fragment>
  )
}

export default FaqsRoutes
