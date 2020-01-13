import React, { Component } from 'react';
import ImageInput from "../shared/imageInput";
import axios from "axios/index";
import { toast } from 'react-toastify';
import { Actions } from "../../helpers/request";
import { FormattedMessage } from "react-intl";
import { EventsApi } from "../../helpers/request";
import { Link } from "react-router-dom";
import LoadingEvent from "../loaders/loadevent";
import EventCard from "../shared/eventCard";
import LogOut from "../shared/logOut";
import { app } from '../../helpers/firebase';
import ImageUploader from 'react-images-upload';
import * as Cookie from "js-cookie";
import privateInstance from "../../helpers/request";
import { parseUrl } from "../../helpers/constants";
import { BaseUrl } from "../../helpers/constants";

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: this.props.event,
            loading: true,
            notifications:{}
        };
        this.submit = this.submit.bind(this)
    }
        //Se consulta la api para traer los datos ya guardados y enviarlos al state
    async componentDidMount() {
    
    }
        //Se envia la peitcion a la api para reconocer el token 
    componentWillMount() {
        
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
                        <h2 className="title-section">Notificaciones</h2>
                                <div className="column inner-column">
                                    <div className="column inner-column">
                                        <label className="label has-text-grey-light">Las noificaciones se envian a todos los usuarios del evento de forma automatica</label>
                                    </div>
                                </div>

                                <div className="column inner-column">
                                    <label className="label has-text-grey-light">Informacion</label>
                                    <textarea name="textNotifications" onChange={(save) => {this.setState({notifications:{...this.state.notifications, textNotifications: save.target.value} }) } } class="textarea" ></textarea>    
                                </div>
                        <button className="button is-primary" onClick={this.submit}>Guardar</button>
                    </div>
                </div>
                {timeout && (<LogOut />)}
            </React.Fragment>
        );
    }
}
export default Notifications