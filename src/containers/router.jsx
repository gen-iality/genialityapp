import React, {Component} from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import {fetchCategories} from "../redux/categories/actions";
import {fetchTypes} from "../redux/types/actions";
import Header from "./header";
import ContentContainer from "./content";
import Footer from "./footer";
import {ToastContainer} from "react-toastify";
import {Helmet} from "react-helmet";

class MainRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount(){
        this.props.dispatch(fetchCategories());
        this.props.dispatch(fetchTypes());
    }

    render() {
        const language = navigator.language.slice(0, 2);
        return (
            <Router>
                <div>
                    <Helmet>
                        <script src={`https://www.gstatic.com/firebasejs/ui/3.4.1/firebase-ui-auth__${language}.js`}/>
                        <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/3.4.1/firebase-ui-auth.css" />
                    </Helmet>
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