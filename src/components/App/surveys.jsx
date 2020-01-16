import React, { Component } from 'react';
import axios from "axios/index";
import { toast } from 'react-toastify';
import { Actions } from "../../helpers/request";
import LogOut from "../shared/logOut";
import { app } from '../../helpers/firebase'
import * as Cookie from "js-cookie";
import privateInstance from "../../helpers/request";
import { parseUrl } from "../../helpers/constants";
import { BaseUrl } from "../../helpers/constants";
import {Link, Redirect, withRouter} from "react-router-dom";

const question = [
    {question:"Encuesta1"},
    {question:"Encuesta2"},
    {question:"Encuesta3"}
]

class SurveysCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: this.props.event,
            loading: true,
            surveys:{},
            info:{},
            dates:{}
        };
        this.submit = this.submit.bind(this)
    }
    async componentDidMount(){
        const info = await Actions.getAll(`/api/events/${this.props.eventId}/surveys`);
        
        this.setState({ info })
        this.setState({
            dates: {...this.state.info.data}
        })

        console.log(this.state.dates)
    }

    async submit(){
        console.log("no entra")
        for (let i = 0; i < this.state.dates.length; i++) {
            console.log("En el índice '" + i + "' hay este valor: " + this.state.dates[i]);
        }

        for (var i=0; i< this.state.dates.length; i++) { 
           console.log("Hola"+this.state.dates.database[i] + ' - '); 
        }
    }

    render() {
        const { timeout } = this.state;

        return (
            <React.Fragment>
                <div className="columns general">
                    <div className="column is-12">
                        <h2 className="title-section" style={{marginBottom:"4%"}}>Listado de Encuestas</h2>
                        <Link to={{pathname:`Createsurvey`}}>
                            <button className="button is-primary">Crear Encuesta</button>
                        </Link>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Encuesta</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{this.state.dates.survey}</td>
                                    <td>
                                        <Link to={{pathname:`Createsurvey`}}>
                                            <button><span className="icon has-text-grey"><i className="fas fa-edit"/></span></button>
                                        </Link>
                                        <button>
                                            <span className="icon has-text-grey"onClick={(e)=>{this.remove()}}><i className="far fa-trash-alt"/></span>
                                        </button>
                                    </td>
                                </tr>                                
                            </tbody>
                        </table>
                        <button onClick={this.submit}>iterar</button>
                    </div>
                </div>
                {timeout && (<LogOut />)}
            </React.Fragment>
        );
    }
}
export default SurveysCreate