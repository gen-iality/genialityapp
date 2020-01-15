import React, { Component } from 'react';
import axios from "axios/index";
import { toast } from 'react-toastify';
import { Actions } from "../../helpers/request";
import LogOut from "../shared/logOut";
import { app } from '../../helpers/firebase'
import {Link, Redirect, withRouter} from "react-router-dom";
import * as Cookie from "js-cookie";
import privateInstance from "../../helpers/request";
import { parseUrl } from "../../helpers/constants";
import { BaseUrl } from "../../helpers/constants";

class Surveys extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: this.props.event,
            loading: true,
            notifications:{}
        };
        this.submit = this.submit.bind(this)
    }
        //Se realiza una funcion asincrona submit para enviar los datos a la api 
    async submit(e) {
        console.log(this.state.notifications)
 
    }

    render() {
        const { timeout } = this.state;
        return (
            <React.Fragment>
                <div className="columns general">
                    <div className="column is-12">
                        <h2 className="title-section">Encuesta</h2>
                        <Link to={{pathname:`surveys`}}>
                            <button className="button is-primary" style={{marginLeft:"79%"}}>Guardar</button>
                        </Link>
                        
                    </div>
                </div>
                {timeout && (<LogOut />)}
            </React.Fragment>
        );
    }
}
export default Surveys