import React, { Component } from 'react';
import { Provider } from 'react-redux';
import * as Cookie from 'js-cookie';
import { parseUrl } from '../helpers/constants';
import './App.less';
import privateInstance, { Actions } from '../helpers/request';
import store from '../redux/store';
import MainRouter from '../containers/router';
import 'bulma-spacing/css/bulma-spacing.min.css';
import withContext from '../Context/withContext';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { name: 'albert' },
    };
  }

  componentDidMount() {
    var url = new URL(document.URL);
    var TokenUser = url.searchParams.get('token');
    var refresh_token = url.searchParams.get('refresh_token');
    let dataUrl = parseUrl(document.URL);
    if (dataUrl && TokenUser) {
      Cookie.set('evius_token', TokenUser, { expires: 180 });
      privateInstance.defaults.params = {};
      privateInstance.defaults.params['evius_token'] = TokenUser;

      if (refresh_token) {
        Actions.put('/api/me/storeRefreshToken', { refresh_token: refresh_token });
      }
    }
  }

  render() {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MainRouter />
        </QueryClientProvider>
      </Provider>
    );
  }
}
let AppwithContext = withContext(App);
export default AppwithContext;
