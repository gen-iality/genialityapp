import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import InvitationDetail from './invitationDetail';
import LogOut from '../shared/logOut';
import InvitationsList from './list';

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { timeout } = this.state;
    const { match } = this.props;
    return (
      <div className={'invitations'}>
        <Route exact path={`${match.url}/`} render={() => <InvitationsList eventId={this.props.event._id} />} />
        <Route
          exact
          path={`${match.url}/detail/:id`}
          render={() => <InvitationDetail event={this.props.event} close={this.closeDetail} />}
        />
        {timeout && <LogOut />}
      </div>
    );
  }
}

export default withRouter(Messages);
