import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import Faqs from './faqs'
import Faq from './faq'

function FaqsRoutes(props) {
  const { event, matchUrl } = props
  return (
    <Fragment>
      <Routes>
        <Route
          exact
          path={`${matchUrl}/`}
          render={() => <Faqs event={event} parentUrl={matchUrl} />}
        />
        <Route
          exact
          path={`${matchUrl}/faq`}
          render={() => <Faq event={event} parentUrl={matchUrl} {...props} />}
        />
      </Routes>
    </Fragment>
  )
}

export default FaqsRoutes
