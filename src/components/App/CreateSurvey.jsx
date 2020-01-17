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
import { FormattedMessage } from "react-intl";


class Survey extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        surveys:{}
    };
    this.submit = this.submit.bind(this)
    }
    async componentDidMount(){
        const info = await Actions.getAll(`/api/event/${this.props.eventId}/surveys`);        
        this.setState({ info })
        this.setState({
            dates: {
                database: this.state.info
            }
        })
        
    }

    async submit(e) {
        e.preventDefault();
        e.stopPropagation();

        console.log(this.state)

        try {
            console.log("response create")
            const result = await Actions.post(`/api/events/${this.props.eventId}/surveys`, this.state.surveys);
            console.log(this.state.info)
            this.setState({ loading: false });
            if (result._id) {
                window.location.replace(`${BaseUrl}/event/${this.props.eventId}/surveys`);
                toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
            } else {
                toast.warn(<FormattedMessage id="toast.warning" defaultMessage="Idk" />);
                this.setState({ msg: 'Cant Create', create: false })
            }
            
        }
        catch (error) {
            toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :(" />);
            if (error.response) {
                console.log(error.response);
                const { status, data } = error.response;
                console.log('STATUS', status, status === 401);
                if (status === 401) this.setState({ timeout: true, loader: false });
                else this.setState({ serverError: true, loader: false, errorData: data })
            } else {
                let errorData = error.message;
                console.log('Error', error.message);
                console.log(this.state.surveys)
                if (error.request) {
                    console.log(error.request);
                    errorData = error.request
                };

                this.setState({ serverError: true, loader: false, errorData })
            }
            console.log(error.config);
        }
    }
    
    render() {
      return (
        <React.Fragment>
            <label>Nombre encuesta</label>
            <input type="text" onChange={(save) => { this.setState({ surveys: { ...this.state.surveys, survey: save.target.value } }) }}/>
            <button onClick={this.submit}>Guardar</button>
        </React.Fragment>
      )
    }
  }
  
export default Survey