import { Component } from 'react'
import { withRouter } from '@/withRouter'

class InvitedUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="invitations">
        <h1 style={{ color: 'red' }}>
          {' '}
          ***TODO Este link deberia llevar al envio de correos con los usuarios invitados
          preseleccionados.
        </h1>
      </div>
    )
  }
}

export default withRouter(InvitedUsers)
