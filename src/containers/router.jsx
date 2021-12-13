import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCategories } from '../redux/categories/actions';
import { fetchTypes } from '../redux/types/actions';
import Header from './header';
import ContentContainer from './content';
import { Layout } from 'antd';
import { CurrentUserProvider } from '../Context/userContext';
import { HelperContextProvider } from '../Context/HelperContext';
import { CurrentEventProvider } from '../Context/eventContext';
import { CurrentUserEventProvider } from '../Context/eventUserContext';
import { UseCurrentUser } from 'Context/userContext';

const MainRouter = (props) => {
  let cUser = UseCurrentUser();
  useEffect(() => {
    props.dispatch(fetchCategories());
    props.dispatch(fetchTypes());

    console.log('1. CUSER MAIN ROUTER==>', cUser.value);
  }, [cUser.value]);

  return (
    <Router basename='/'>
      <Layout>
        <CurrentEventProvider>
          <CurrentUserProvider>
            <CurrentUserEventProvider>
              <HelperContextProvider>
                <Header />
              </HelperContextProvider>
            </CurrentUserEventProvider>
          </CurrentUserProvider>
        </CurrentEventProvider>
        <ContentContainer />
      </Layout>
    </Router>
  );
};

export default connect()(MainRouter);
