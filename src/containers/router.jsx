import React, {Component} from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import {fetchCategories} from "../redux/categories/actions";
import {fetchTypes} from "../redux/types/actions";
import {fetchRolState} from "../redux/rolstate/actions";
import Header from "./header";
import ContentContainer from "./content";
import Footer from "./footer";
import {ToastContainer} from "react-toastify";

class MainRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount(){
        this.props.dispatch(fetchCategories());
        this.props.dispatch(fetchTypes());
        this.props.dispatch(fetchRolState());
    }

    render() {
        return (
            <Router>
                <div>
                    <Header/>
                    <ContentContainer/>
                    <Footer/>
                    <ToastContainer autoClose={2000} newestOnTop pauseOnVisibilityChange/>
                </div>
            </Router>
        );
    }
}

export default connect()(MainRouter);