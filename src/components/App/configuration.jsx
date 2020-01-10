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

const itemsDrawer = [
    { name: 'HomeScreen', title: 'Home', icon: 'home', key: 1, title_view: 'Modulo Home Visible?', desc: 'Nombre en el aplicativo' },
    { name: 'CalendarScreen', title: 'Calendar', icon: 'calendar', key: 2, title_view: 'Modulo Agenda Visible?', desc: 'Nombre en el aplicativo' },
    { name: 'ProfileScreen', title: 'Profile', icon: 'user', key: 3, title_view: 'Modulo Perfil Visible?', desc: 'Nombre en el aplicativo' },
    { name: 'EventPlaceScreen', title: 'Event Place', icon: 'location', key: 4, title_view: 'Modulo lugar del evento visible?', desc: 'Nombre en el aplicativo' },
    { name: 'SpeakersScreen', title: 'Speaker', icon: 'mic', key: 5, title_view: 'Modulo Conferencistas Visible?', desc: 'Nombre en el aplicativo' },
    { name: 'NewsScreen', title: 'News', icon: 'news', key: 6, title_view: 'Modulo de Noticias Visible?', desc: 'Nombre en el aplicativo' },
    { name: 'SurveysScreen', title: 'Surveys', icon: 'book', key: 7, title_view: 'Modulo de encuestas Visible?', desc: 'Nombre en el aplicativo' },
    { name: 'DocumentsScreen', title: 'Documents', icon: 'folder', key: 8, title_view: 'Modulo de documentos Visible?', desc: 'Nombre en el aplicativo' },
    { name: 'WallScreen', title: 'Wall', icon: 'doc', key: 8, title_view: 'Modulo de Muro Visible?', desc: 'Nombre en el aplicativo' },
]

class Configuration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            configuration: {},
            info: {},
            information: {},
            data:{}
        };

        this.submit = this.submit.bind(this)

    }
    async componentDidMount() {
        const info = await Actions.getAll(`/api/event/${this.props.eventId}/configuration`);
        this.setState({ info })

        const Home = this.state.info.HomeScreen.title
        this.setState({Home})

        console.log(this.state.data)

        // console.log(info.data[0]._id)

        for (const info in this.state.info.data) {
            this.setState({
                information: {
                    id: info.data[0]._id,
                    HomeScreen: info.data[0].HomeScreen.title,
                    CalendarScreen: info.data[0].CalendarScreen.title,
                    ProfileScreen: info.data[0].ProfileScreen.title,
                    EventPlaceScreen: info.data[0].EventPlaceScreen.title,
                    SpeakersScreen: info.data[0].SpeakersScreen.title,
                    NewsScreen: info.data[0].NewsScreen.title,
                    SurveysScreen: info.data[0].SurveysScreen.title,
                    DocumentsScreen: info.data[0].DocumentsScreen.title
                }
            })
        }

        // console.log("datos guardados: "+this.state.info.data[0]._id)
        console.log(this.state.info.HomeScreen.title);
    }

    async submit(e) {
        e.preventDefault();
        e.stopPropagation();

        const { event } = this.state;

        const self = this;
        // this.state.data.push(this.state.styles);
        this.state.data = { styles: this.state.configuration };



        try {
            if (this.state.information._id) {
                console.log("if condition" + this.state.information._id)
                // let array = [];
                // array = Object.keys(this.state.configuration).map(key =>{
                //     return this.state.configuration[key]
                // })
                const info = await Actions.put(`api/event/${this.props.eventId}/configuration/${this.state.information._id}`, this.state.configuration);

                console.log(info)
                this.setState({ loading: false });
                toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
            }
            else {
                console.log("response else create")
                const result = await Actions.post(`/api/event/${this.props.eventId}/configuration`, this.state.configuration);
                console.log(this.state.info)
                this.setState({ loading: false });
                if (result._id) {
                    window.location.replace(`${BaseUrl}/event/${this.props.eventId}/configurationApp`);
                    toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
                } else {
                    toast.warn(<FormattedMessage id="toast.warning" defaultMessage="Idk" />);
                    this.setState({ msg: 'Cant Create', create: false })
                }
            }
        }
        catch (error) {
            toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :(" />);
            if (error.response) {
                console.log(this.state.data)
                console.log(error.response);
                const { status, data } = error.response;
                console.log('STATUS', status, status === 401);
                if (status === 401) this.setState({ timeout: true, loader: false });
                else this.setState({ serverError: true, loader: false, errorData: data })
            } else {
                let errorData = error.message;
                console.log('Error', error.message);
                console.log(this.state.styles)
                if (error.request) {
                    console.log(error.request);
                    errorData = error.request
                };

                this.setState({ serverError: true, loader: false, errorData })
            }
            console.log(error.config);
        }
    }

    sendInfoToState = async (name, val) => {

        if (this.state.configuration[name]) {
            delete this.state.configuration[name];
            console.log('ya existe', this.state.configuration);
        } else {
            await this.setState({
                configuration: { ...this.state.configuration, [name]: val }
            })
            console.log('por primera vez', this.state.configuration)
        }

    }

    updateStateTitle = (key_object, val) => {
        let object = this.state.configuration;
        object[key_object].title = val
        this.setState(object)
    }

    render() {
        const { timeout } = this.state;

        return (
            <React.Fragment>
                <div className="columns general">
                    <div className="column is-12">
                        <h2 className="title-section">Configuracion de Aplicativo</h2>
                        {
                            itemsDrawer.map((item, key) => (
                                <div className="column inner-column" key={key}>
                                    <label className="label has-text-grey-light">{item.title_view}</label>
                                    <input type="checkbox" name={item.name} value={item.key} onChange={(e) => { this.sendInfoToState(e.target.name, { title: item.title, name: item.name, icon: item.icon, key: item.key }) }} />

                                    <label className="label has-text-grey-light">{item.desc}</label>
                                    <input className="input is-primary" type="text" placeholder={item.title} onChange={(e) => { this.updateStateTitle(item.name, e.target.value) }} />
                                </div>
                            ))
                        }
                        <button className="button is-primary" onClick={this.submit}>Guardar</button>
                    </div>    
                </div>
                {timeout && (<LogOut />)}
            </React.Fragment>
        );
    }
}

export default Configuration
