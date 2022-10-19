import { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import MyAgenda from './myAgenda';
import { userRequest } from './services';
import { Spin } from 'antd';
import { GetTokenUserFirebase } from '@helpers/HelperAuth';
import withContext from '@context/withContext';

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
    let evius_token = await GetTokenUserFirebase();
    if (this.props.cUser) {
      let eventUserList = await userRequest.getEventUserList(
        this.props.cEvent.value._id,
        evius_token,
        this.props.cUser
      );

      this.setState({
        users: eventUserList,
        loading: false,
      });
    }
  }

  render() {
    const { users, loading } = this.state;
    return (
      <Fragment>
        {loading ? (
          <Spin />
        ) : (
          <MyAgenda
            event={this.props.cEvent.value}
            eventUser={this.props.cEventUser.value}
            currentEventUserId={this.props.cEventUser.value._id}
            eventUsers={users}
          />
        )}
      </Fragment>
    );
  }
}

let AgendaIndepentWithContext = withContext(AgendaIndepent);
export default withRouter(AgendaIndepentWithContext);
