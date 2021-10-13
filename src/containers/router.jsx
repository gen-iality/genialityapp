import React, { Component } from 'react';
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

class MainRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch(fetchCategories());
    this.props.dispatch(fetchTypes());
  }

  render() {
    return (
      <Router basename='/'>
        <Layout>
          <CurrentEventProvider>
            <CurrentUserEventProvider>
              <CurrentUserProvider>
                <HelperContextProvider>
                  <Header />
                </HelperContextProvider>
              </CurrentUserProvider>
            </CurrentUserEventProvider>
          </CurrentEventProvider>
          <ContentContainer />
        </Layout>
      </Router>
    );
  }
}

export default connect()(MainRouter);
