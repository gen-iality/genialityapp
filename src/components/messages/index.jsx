import { Fragment } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import InvitationDetail from './invitationDetail'
import InvitationsList from './list'

function Messages(props) {
  const match = useRouteMatch()

  return (
    <Fragment>
      <Switch>
        <Route
          exact
          path={`${match.url}/`}
          render={() => (
            <InvitationsList eventId={props.event._id} matchUrl={match.url} />
          )}
          event={props.event}
          matchUrl={match.url}
          {...props}
        />
        <Route
          exact
          path={`${match.url}/detail/:id`}
          render={() => (
            <InvitationDetail event={props.event} matchUrl={match.url} {...props} />
          )}
        />
      </Switch>
    </Fragment>
  )
}

export default Messages
