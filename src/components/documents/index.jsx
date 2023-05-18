import { Fragment } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Documents from './documents'
import Document from './Document'

function DocumentsRoutes(props) {
  const { event, matchUrl } = props
  return (
    <Fragment>
      <Switch>
        <Route
          exact
          path={`${matchUrl}/`}
          render={() => <Documents event={event} parentUrl={matchUrl} />}
        />
        <Route
          exact
          path={`${matchUrl}/document`}
          render={() => <Document event={event} parentUrl={matchUrl} />}
        />
      </Switch>
    </Fragment>
  )
}

export default withRouter(DocumentsRoutes)
