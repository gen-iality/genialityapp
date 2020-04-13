import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import { fetchCategories } from "../redux/categories/actions";
import { fetchTypes } from "../redux/types/actions";
import Header from "./header";
import ContentContainer from "./content";
import Footer from "./footer";
import { ToastContainer } from "react-toastify";
import { Layout } from "antd";
//const { Header, Footer, Sider, Content } = Layout;

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
      <Router>
        <Layout>
          <Header />
          <ContentContainer />
          <Footer />
          <ToastContainer autoClose={2000} newestOnTop pauseOnVisibilityChange />
        </Layout>
      </Router>
    );
  }
}

export default connect()(MainRouter);
