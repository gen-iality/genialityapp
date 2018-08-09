import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import * as Cookie from "js-cookie";
import axios from "axios";
import { parseUrl } from "../helpers/constants";

import Header from "../containers/header";
import ContentContainer from "../containers/content";


class App extends Component {
    componentWillMount() {
        let dataUrl = parseUrl(document.URL);
        if (dataUrl && dataUrl.token) {
            console.log(dataUrl);
            this.setState({ token: dataUrl.token });
            Cookie.set("evius_token", dataUrl.token);
            if (dataUrl.token){
                axios.defaults.params = {}
                axios.defaults.params['evius_token'] = dataUrl.token;
            }
        }
    }
    render() {
        return (
        <Router>
            <div>
                <Header/>
                <ContentContainer/>
            </div>
        </Router>
        );
    }
}

export default App;
