import { Component } from 'react';
import { ApiUrl } from '../../helpers/constants';
import IFrame from '../shared/iFrame';
import { GetTokenUserFirebase } from '../../helpers/HelperAuth';

class OrdersEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      iframeUrl: '',
    };
  }

  componentDidMount() {
    async function GetUserToken() {
      let token = await GetTokenUserFirebase();
      return token;
    }

    let evius_token = GetUserToken();
    const { eventId } = this.props;
    if (evius_token) {
      const iframeUrl = `${ApiUrl}/es/event/${eventId}/orders?evius_token=${evius_token}`;
      this.setState({ iframeUrl, loading: false });
    }
  }

  render() {
    return <div>{this.state.loading ? <p>Loading...</p> : <IFrame iframeUrl={this.state.iframeUrl} />}</div>;
  }
}

export default OrdersEvent;
