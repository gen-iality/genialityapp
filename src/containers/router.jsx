import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCategories } from '../redux/categories/actions';
import { fetchTypes } from '../redux/types/actions';
import Header from './header';
import ContentContainer from './content';

import { Layout } from 'antd';
//const { Header, Footer, Sider, Content } = Layout;

class MainRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log("thispropsmainrouter",this.props)
    this.props.dispatch(fetchCategories());
    this.props.dispatch(fetchTypes());
  }

  render() {
    return (
      <Router basename='/'>
        <Layout>
          <Header />
          <ContentContainer />
        </Layout>
      </Router>
    );
  }
}

export default connect()(MainRouter);
