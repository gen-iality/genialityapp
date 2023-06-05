import { Fragment, FunctionComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import Documents from './documents'
import Document from './Document'

interface IDocumentsRoutesProps {
  event: any
  matchUrl: string
}

const DocumentsRoutes: FunctionComponent<IDocumentsRoutesProps> = (props) => {
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

export default DocumentsRoutes
