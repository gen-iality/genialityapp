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


class Configuration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            configuration: {},
            app_configuration: {},
            dates: {},
            checkHome: false,
            checkCalendar: false,
            checkProfile: false,
            checkEventPlace: false,
            checkSpeaker: false,
            checkNews: false,
            checkSurveys: false,
            checkDocuments: false,
            checkWall: false,
            checkQuiz: false,
            checkRanking: false,
            checkVote: false,
            checkFaq: false,
            checkGallery: false,
            checkWebScreen:false,
            checkRegister:false,
            checkRankingScreen: false,
            information: {}
        };
        this.submit = this.submit.bind(this)
        this.checkInput = React.createRef()
        this.enable = this.enable.bind(this)
    }
    async componentDidMount() {
        const info = await Actions.getAll(`/api/events/${this.props.eventId}`);
        this.setState({ information: info.app_configuration })
        this.setState({info})
        console.log(info)
        this.setState({
            dates: {
                database: this.state.information
            }
        })

        this.setState({
            configuration:{
                ...this.state.info.app_configuration
            }
        })
        if (this.state.dates.database.HomeScreen) {
            this.setState({
                checkHome: true
            })
        } else {
            this.setState({
                checkHome: false
            })
        }

        if (this.state.dates.database.RegisterScreen) {
            this.setState({
                checkRegister: true
            })
        } else {
            this.setState({
                checkRegister: false
            })
        }

        if (this.state.dates.database.CalendarScreen) {
            this.setState({
                checkCalendar: true
            })

        } else {
            this.setState({
                checkCalendar: false
            })
        }

        if (this.state.dates.database.ProfileScreen) {
            this.setState({
                checkProfile: true
            })
        } else {
            this.setState({
                checkProfile: false
            })
        }

        if (this.state.dates.database.EventPlaceScreen !== undefined) {
            this.setState({
                checkEventPlace: true
            })
        } else {
            this.setState({
                checkEventPlace: false
            })
        }

        if (this.state.dates.database.SpeakerScreen) {
            this.setState({
                checkSpeaker: true
            })
        } else {
            this.setState({
                checkSpeaker: false
            })
        }

        if (this.state.dates.database.NewsScreen) {
            this.setState({
                checkNews: true
            })
        } else {
            this.setState({
                checkNews: false
            })
        }

        if (this.state.dates.database.SurveyScreen) {
            this.setState({
                checkSurveys: true
            })
        } else {
            this.setState({
                checkSurveys: false
            })
        }

        if (this.state.dates.database.DocumentsScreen) {
            this.setState({
                checkDocuments: true
            })
        } else {
            this.setState({
                checkDocuments: false
            })
        }

        if (this.state.dates.database.WallScreen) {
            this.setState({
                checkWall: true
            })
        } else {
            this.setState({
                checkWall: false
            })
        }

        if (this.state.dates.database.QuizScreen) {
            this.setState({
                checkQuiz: true
            })
        } else {
            this.setState({
                checkQuiz: false
            })
        }

        if (this.state.dates.database.RankingScreen) {
            this.setState({
                checkRanking: true
            })
        } else {
            this.setState({
                checkRanking: false
            })
        }

        if (this.state.dates.database.VoteScreen) {
            this.setState({
                checkVote: true
            })
        } else {
            this.setState({
                checkVote: false
            })
        }

        if (this.state.dates.database.FaqsScreen) {
            this.setState({
                checkFaq: true
            })
        } else {
            this.setState({
                checkFaq: false
            })
        }

        if (this.state.dates.database.GalleryScreen) {
            this.setState({
                checkGallery: true
            })
        } else {
            this.setState({
                checkGallery: false
            })
        }

        if (this.state.dates.database.RankingScreen) {
            this.setState({
                checkRankingScreen: true
            })
        } else {
            this.setState({
                checkRankingScreen: false
            })
        }

        if (this.state.dates.database.RankingScreen) {
            this.setState({
                checkRankingScreen: true
            })
        } else {
            this.setState({
                checkRankingScreen: false
            })
        }
    }
    componentWillMount() {
        let dataUrl = parseUrl(document.URL);
        if (dataUrl && dataUrl.token) {
            console.log(dataUrl);
            if (dataUrl.token) {
                Cookie.set("evius_token", dataUrl.token);
                privateInstance.defaults.params = {};
                privateInstance.defaults.params['evius_token'] = dataUrl.token;
            }
            if (dataUrl.refresh_token) {
                Actions.put('/api/me/storeRefreshToken', { refresh_token: dataUrl.refresh_token })
                    .then(resp => {
                        console.log(resp);
                    })
            }
        }
    }

    async submit(e) {
        e.preventDefault();
        e.stopPropagation();

        const { event } = this.state;

        const self = this;
        // this.state.data.push(this.state.styles);
        this.state.data = { styles: this.state.configuration };
        try {
            if (this.state.info._id) {
                console.log("entro a if")
                console.log(this.state.configuration)
                // const info = await Actions.put(`api/events/${this.props.eventId}`, this.state.app_configuration);
                
                // console.log(info)
                // this.setState({ loading: false });
                // toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
                // window.location.replace(`${BaseUrl}/event/${this.props.eventId}/configurationApp`);
            }
            else {
                // console.log("entro a else")
                // const result = await Actions.post(`/api/events/${this.props.eventId}`, this.state.app_configuration);
                // console.log(this.state.info)
                // this.setState({ loading: false });
                // if (result._id) {
                //     window.location.replace(`${BaseUrl}/event/${this.props.eventId}/configurationApp`);
                //     toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
                // } else {
                //     toast.warn(<FormattedMessage id="toast.warning" defaultMessage="Idk" />);
                //     this.setState({ msg: 'Cant Create', create: false })
                // }
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
               configuration: {
                   app_configuration:{
                    ...this.state.configuration, [name]: val
                   }
                }
            })

            await this.setState({
                app_configuration:{
                    app_configuration:{
                        ...this.state.configuration
                    }
                }
            })
            console.log('por primera vez', this.state.configuration)
        }
    }

    updateStateTitle = (key_object, val) => {
        let object = this.state.configuration;
        object[key_object].title = val
        this.setState(object)
    }

    enable = (val) => {
        var isChecked = document.getElementById(val.idCheck).checked;
        if (isChecked) {
            document.getElementById(val.id).disabled = false;
        } else {
            document.getElementById(val.id).disabled = true;
        }
    }

    render() {
        const { timeout } = this.state;

        const itemsDrawer = [
            { reference: this.checkInput, id: 1,idCheck: 'checkbox0', title:'Home', name: 'HomeScreen', checked: this.state.checkHome, type:this.state.type, titles: this.state.information.HomeScreen ? 'Editar Home' : 'Habilitar Home', icon: 'home', key: 0, title_view: 'Modulo Home Visible', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, id: 2,idCheck: 'checkbox1', title:'Profile',name: 'ProfileScreen', checked: this.state.checkProfile,type:this.state.type, titles: this.state.information.ProfileScreen ? 'Editar Perfil' : 'Habilitar Perfil', icon: 'user', key: 1, title_view: 'Modulo Perfil Visible', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, id: 3,idCheck: 'checkbox2', title:'Calendar',name: 'CalendarScreen', checked: this.state.checkCalendar, type:this.state.type,titles: this.state.information.CalendarScreen ? 'Editar Agenda' : 'Habilitar Agenda', icon: 'calendar', key: 2, title_view: 'Modulo Agenda Visible', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, id: 4,idCheck: 'checkbox3', title:'News', name: 'NewsScreen', checked: this.state.checkNews, type:this.state.type,titles: this.state.information.NewsScreen ? 'Editar Noticias' : 'Habilitar Noticias', icon: 'news', key: 3, title_view: 'Modulo de Noticias Visible', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, id: 5,idCheck: 'checkbox4', title:'EventPlace',name: 'EventPlaceScreen', checked: this.state.checkEventPlace,type:this.state.type, titles: this.state.information.EventPlaceScreen ? 'Editar Lugar de evento' : 'Habilitar lugar de evento', icon: 'location', key: 4, title_view: 'Modulo lugar del evento visible', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, id: 6,idCheck: 'checkbox5', title:'Speakers', name: 'SpeakerScreen', checked: this.state.checkSpeaker,type:this.state.type, titles: this.state.information.SpeakerScreen ? 'Editar Conferencistas' : 'Habilitar Conferencistas', icon: 'mic', key: 5, title_view: 'Modulo Conferencistas Visible', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, id: 7,idCheck: 'checkbox6', title:'Survey', name: 'SurveyScreen', checked: this.state.checkSurveys, type:this.state.type,titles: this.state.information.SurveyScreen ? 'Editar Encuestas' : 'Habilitar Encuestas', icon: 'book', key: 6, title_view: 'Modulo de encuestas Visible', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, id: 8,idCheck: 'checkbox7', title:'Documents', name: 'DocumentsScreen', checked: this.state.checkDocuments, type:this.state.type,titles: this.state.information.DocumentsScreen ? 'Editar Document' : 'Habilitar Document', icon: 'folder', key: 7, title_view: 'Modulo de documentos Visible', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, id: 9,idCheck: 'checkbox8', title:'Wall', name: 'WallScreen', checked: this.state.checkWall,type:this.state.type, titles: this.state.information.WallScreen ? 'Editar Wall' : 'Habilitar Wall', icon: 'doc', key: 8, title_view: 'Modulo de Muro Visible', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, id: 10,idCheck: 'checkbox9', title:'Conteo Regresivo', name: 'WebScreen', checked: this.state.checkWebScreen, type:this.state.type, titles: this.state.information.WebScreen ? 'Editar Web Screen' : 'Habilitar Web Screen', icon: 'doc', key: 9, title_view: 'Modulo de Web Screen', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, id: 11,idCheck: 'checkbox10', title:'RankingScreen', name: 'RankingScreen', checked: this.state.checkRankingScreen, type:this.state.type, titles: this.state.information.RankingScreen ? 'Editar Ranking' : 'Habilitar Ranking', icon: 'doc', key: 10, title_view: 'Modulo Ranking', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, id: 12,idCheck: 'checkbox11', title:'F.A.Q', name: 'FaqsScreen', checked: this.state.checkFaq, type:this.state.type,titles: this.state.information.FaqsScreen ? 'Editar FAQ' : 'Habilitar FAQ', icon: 'doc', key: 11, title_view: 'Modulo de F.A.Q Visible', desc: 'Nombre en el aplicativo' },
        ]
        return (
            <React.Fragment>
                <div className="columns general">
                    <div className="column is-5">
                        <h2 className="title-section">Configuracion de Aplicativo</h2>
                        {
                            itemsDrawer.map((item, key) => (
                                <div className="column inner-column" key={key}>

                                    <br /><label>{item.titles}</label>
                                    <input type="checkbox" id={item.idCheck} onClick={(e) => { this.enable({ id: item.key, idCheck: item.idCheck }) }} name={item.name} value={item.key} onChange={(e) => { this.sendInfoToState(e.target.name, { title: item.title, name: item.name, icon: item.icon, key: item.key }) }} />

                                    <label className="label has-text-grey-light">{item.desc}</label>
                                    <input className="input is-primary" id={item.key} ref={item.reference} disabled type="text" placeholder={item.title} onChange={(e) => { this.updateStateTitle(item.name, e.target.value) }} />
                                </div>
                            ))
                        }
                        <button id="button" className="button is-primary" onClick={this.submit}>Guardar</button>
                    </div>
                </div>
                {timeout && (<LogOut />)}
            </React.Fragment>
        );
    }
}

export default Configuration
