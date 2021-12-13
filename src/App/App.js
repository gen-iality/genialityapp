import React, { Component, useEffect, useState } from 'react';
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
import { app } from 'helpers/firebase';
import { CurrentUserProvider } from 'Context/userContext';
const queryClient = new QueryClient();

const App = (props) => {
  let [loading, setLoading] = useState(true);
  useEffect(() => {
    //ESTADO NECESARIO PARA QUE RENDERIZE LANDING NUEVAMENTE
    loading = !loading ? true : true;
    if (props.cUser.value !== undefined) {
      setLoading(!loading);
    }
  }, [props.cUser]);
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <CurrentUserProvider>{!loading ? <MainRouter /> : <h1>Cargando</h1>}</CurrentUserProvider>
      </QueryClientProvider>
    </Provider>
  );
};
let AppwithContext = withContext(App);
export default AppwithContext;
