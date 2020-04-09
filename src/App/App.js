import React, { Component } from 'react';
import { Provider } from 'react-redux'
import * as Cookie from "js-cookie";
import { parseUrl } from "../helpers/constants";

import privateInstance, {Actions} from "../helpers/request";
import store from "../redux/store";
import MainRouter from "../containers/router";
import 'bulma-spacing/css/bulma-spacing.min.css'


class App extends Component {
    componentDidMount() {
        let dataUrl = parseUrl(document.URL);
        if (dataUrl && dataUrl.token) {
            console.log(dataUrl);
            if (dataUrl.token){
                Cookie.set("evius_token", dataUrl.token);
                privateInstance.defaults.params = {};
                privateInstance.defaults.params['evius_token'] = dataUrl.token;
            }
            if(dataUrl.refresh_token){
                Actions.put('/api/me/storeRefreshToken',{refresh_token:dataUrl.refresh_token})
                    .then(resp=>{
                        console.log(resp);
                    })
            }
        }
    }
    render() {
        return (
         <Provider store={store}>
             <MainRouter/>
         </Provider>
        );
    }
}

export default App;
