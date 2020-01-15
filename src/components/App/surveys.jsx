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
        const surveys = [
            { survey:"Como te parecio el evento", surveyId:"1"},
            { survey:"Solucionaste tus dudas", surveyId:"2"}
        ]

        const surveySelect =[
            { surveySelect:"De 1 a 5 puntua la atencion que recibiste", type:"radio", name:"surveySelect"}
        ]

        return (
            <React.Fragment>
                <div className="columns general">
                    <div className="column is-12">
                        <h2 className="title-section">Encuestas</h2>
                        {
                            surveys.map((item, key)=>(
                                <div className="column inner-column" key={key}>
                                    <div>
                                        <label className="title-section">{item.survey}</label>
                                        <br/>
                                        <textarea/>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            surveySelect.map((item1,key)=>(
                                <div className="column inner-column" key={key}>
                                    <label className="title-section">{item1.surveySelect}</label><br/>

                                    <label>1</label>
                                    <input type={item1.type} style={{marginLeft:"2%"}} name={item1.name}/><br/>

                                    <label>2</label>
                                    <input type={item1.type} style={{marginLeft:"2%"}} name={item1.name}/><br/>
                                    
                                    <label>3</label>
                                    <input type={item1.type} checked style={{marginLeft:"2%"}} name={item1.name}/><br/>
                                    
                                    <label>4</label>
                                    <input type={item1.type} style={{marginLeft:"2%"}} name={item1.name}/><br/>
                                    
                                    <label>5</label>
                                    <input type={item1.type} style={{marginLeft:"2%"}} name={item1.name}/><br/>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {timeout && (<LogOut />)}
            </React.Fragment>
        );
    }
}
export default Surveys