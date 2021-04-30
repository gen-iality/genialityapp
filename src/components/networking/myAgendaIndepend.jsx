import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import MyAgenda from './myAgenda';
import { getCurrentUser, getCurrentEventUser, userRequest } from './services';
import * as Cookie from 'js-cookie';
import { Spin } from 'antd';

class AgendaIndepent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      eventUserId: null,
      loading: true,
    };
  }

  async componentDidMount() {
    const { event } = this.props;
    let currentUser = Cookie.get('evius_token');

    if (currentUser) {
      let eventUserList = await userRequest.getEventUserList(event._id, Cookie.get('evius_token'), currentUser);
      let user = await getCurrentUser(currentUser);
      const eventUser = await getCurrentEventUser(event._id, user._id);

      this.setState({
        users: eventUserList,
        eventUser,
        eventUserId: eventUser._id,
        currentUserName: eventUser.names || eventUser.email,
        loading: false,
      });
    }
  }

  render() {
    const { event } = this.props;
    const { eventUserId, users, loading, eventUser } = this.state;
    return (
      <Fragment>
        {loading ? (
          <Spin />
        ) : (
          <MyAgenda
            event={event}
            eventUser={eventUser}
            currentEventUserId={eventUserId}
            eventUsers={users}
            {...this.props}
          />
        )}
      </Fragment>
    );
  }
}

export default withRouter(AgendaIndepent);
