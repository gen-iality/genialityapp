import React from "react";
import { Provider } from "react-redux";
import "./App.less";
import store from "../redux/store";
import MainRouter from "../containers/router";
import withContext from "../context/withContext";
import { QueryClient, QueryClientProvider } from "react-query";
import {PreloaderApp} from "../PreloaderApp/PreloaderApp";
const queryClient = new QueryClient();

const App = (props) => {
  if (props.cUser.status == "LOADING")
    return (
      <>
        <PreloaderApp />
      </>
    );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MainRouter />
      </QueryClientProvider>
    </Provider>
  );
};
let AppwithContext = withContext(App);
export default AppwithContext;
