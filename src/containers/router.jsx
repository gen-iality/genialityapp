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
import { userContext } from './userContext';
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
          <userContext.Consumer>{(user) => {
            return (
              <>
                <Header user={user} />
                <ContentContainer />
                <Footer />
                <ToastContainer autoClose={2000} newestOnTop pauseOnVisibilityChange />
              </>
            )
          }
          }
          </userContext.Consumer>
        </Layout>
      </Router>);

  }
}

export default connect()(MainRouter);
