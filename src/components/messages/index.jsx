import { Fragment } from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import InvitationDetail from './invitationDetail'
import InvitationsList from './list'

function Messages(props) {
  return (
    <Fragment>
      <Routes>
        <Route
          path={`/`}
          element={<InvitationsList eventId={props.event._id} />}
          {...props}
        />
        <Route
          path={`/detail/:id`}
          element={<InvitationDetail event={props.event} {...props} />}
        />
      </Routes>
    </Fragment>
  )
}

export default Messages
