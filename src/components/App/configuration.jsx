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
            app_configuration:{},
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
            checkGallery: false
        };
        this.submit = this.submit.bind(this)
        this.checkInput = React.createRef()
        this.enable = this.enable.bind(this)
    }
    async componentDidMount() {
        const info = await Actions.getAll(`/api/events/${this.props.eventId}`);
        this.setState({ info })
        this.setState({
            dates: {
                database: this.state.info.app_configuration
            }
        })

        this.setState({
            app_configuration:{
                app_configuration:{
                    config: this.state.configuration
                }
            }
        })

        if (this.state.dates.database.HomeScreen) {
            this.setState({
                checkHome: true,
            })
        } else {
            this.setState({
                checkHome: false,
            })
        }

        if (this.state.dates.database.CalendarScreen) {
            this.setState({
                checkCalendar: true,
            })
            
        } else {
            this.setState({
                checkCalendar: false,
            })
        }

        if (this.state.dates.database.ProfileScreen) {
            this.setState({
                checkProfile: true,
            })
        } else {
            this.setState({
                checkProfile: false,
            })
        }

        if (this.state.dates.database.EventPlaceScreen !== undefined) {
            this.setState({
                checkEventPlace: true,
            })
        } else {
            this.setState({
                checkEventPlace: false,
            })
        }

        if (this.state.dates.database.SpeakersScreen) {
            this.setState({
                checkSpeaker: true,
            })
        } else {
            this.setState({
                checkSpeaker: false,
            })
        }

        if (this.state.dates.database.NewsScreen) {
            this.setState({
                checkNews: true,
            })
        } else {
            this.setState({
                checkNews: false,
            })
        }

        if (this.state.dates.database.SurveysScreen) {
            this.setState({
                checkSurveys: true,
            })
        } else {
            this.setState({
                checkSurveys: false,
            })
        }

        if (this.state.dates.database.DocumentsScreen) {
            this.setState({
                checkDocuments: true,
            })
        } else {
            this.setState({
                checkDocuments: false,
            })
        }

        if (this.state.dates.database.WallScreen) {
            this.setState({
                checkWall: true,
            })
        } else {
            this.setState({
                checkWall: false,
            })
        }

        if (this.state.dates.database.QuizScreen) {
            this.setState({
                checkQuiz: true,
            })
        } else {
            this.setState({
                checkQuiz: false,
            })
        }

        if (this.state.dates.database.RankingScreen) {
            this.setState({
                checkRanking: true,
            })
        } else {
            this.setState({
                checkRanking: false,
            })
        }

        if (this.state.dates.database.VoteScreen) {
            this.setState({
                checkVote: true,
            })
        } else {
            this.setState({
                checkVote: false,
            })
        }

        if (this.state.dates.database.FaqScreen) {
            this.setState({
                checkFaq: true,
            })
        } else {
            this.setState({
                checkFaq: false,
            })
        }

        if (this.state.dates.database.GalleryScreen) {
            this.setState({
                checkGallery: true,
            })
        } else {
            this.setState({
                checkGallery: false,
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
                console.log("if condition" + this.state.configuration)
                // let array = [];
                // array = Object.keys(this.state.configuration).map(key =>{
                //     return this.state.configuration[key]
                // })
                const info = await Actions.put(`api/events/${this.props.eventId}`, this.state.app_configuration);

                console.log(info)
                this.setState({ loading: false });
                toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
                window.location.replace(`${BaseUrl}/event/${this.props.eventId}/configurationApp`);
            }
            else {
                console.log("response else create")
                const result = await Actions.post(`/api/events/${this.props.eventId}`, this.state.app_configuration);
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
                        ...this.state.configuration, [name]: val  
                }
            })

            await this.setState({
                app_configuration: {
                    app_configuration:{
                        ...this.state.configuration, [name]: val  
                    }
                }
            })
            console.log('por primera vez', this.state.configuration)
            console.log('App_configuration',this.state.app_configuration)
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
            document.getElementById(val.id).disabled = false
        }else{
            document.getElementById(val.id).disabled = true
        }
    }

    render() {
        const { timeout } = this.state;

        const itemsDrawer = [
            { reference: this.checkInput, idCheck:'checkbox',name: 'HomeScreen', checked: this.state.checkHome, title: 'HOME', icon: 'home', key: 1, title_view: 'Modulo Home Visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox2',name: 'CalendarScreen', checked: this.state.checkCalendar, title: 'CALENDAR', icon: 'calendar', key: 2, title_view: 'Modulo Agenda Visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox3',name: 'ProfileScreen', checked: this.state.checkProfile, title: 'PROFILE', icon: 'user', key: 3, title_view: 'Modulo Perfil Visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox4',name: 'EventPlaceScreen', checked: this.state.checkEventPlace, title: 'EVENT PLACE', icon: 'location', key: 4, title_view: 'Modulo lugar del evento visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox5',name: 'SpeakersScreen', checked: this.state.checkSpeaker, title: 'SPEAKERS', icon: 'mic', key: 5, title_view: 'Modulo Conferencistas Visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox6',name: 'NewsScreen', checked: this.state.checkNews, title: 'NEWS', icon: 'news', key: 6, title_view: 'Modulo de Noticias Visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox7',name: 'SurveysScreen', checked: this.state.checkSurveys, title: 'SURVEYS', icon: 'book', key: 7, title_view: 'Modulo de encuestas Visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox8',name: 'DocumentsScreen', checked: this.state.checkDocuments, title: 'DOCUMENTS', icon: 'folder', key: 8, title_view: 'Modulo de documentos Visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox9',name: 'WallScreen', checked: this.state.checkWall, title: 'WALL', icon: 'doc', key: 9, title_view: 'Modulo de Muro Visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox10',name: 'QuizScreen', checked: this.state.checkQuiz, title: 'QUIZ', icon: 'doc', key: 10, title_view: 'Modulo de Quiz Visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox11',name: 'RankingScreen', checked: this.state.checkRanking, title: 'RANKING', icon: 'doc', key: 11, title_view: 'Modulo de Ranking Visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox12',name: 'FaqScreen', checked: this.state.checkFaq, title: 'F.A.Q.', icon: 'doc', key: 12, title_view: 'Modulo de F.A.Q Visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox13',name: 'VoteScreen', checked: this.state.checkVote, title: 'VOTE', icon: 'doc', key: 13, title_view: 'Modulo de Votacion Visible?', desc: 'Nombre en el aplicativo' },
            { reference: this.checkInput, idCheck:'checkbox14',name: 'GalleryScreen', checked: this.state.checkGallery, title: 'GALLERY', icon: 'doc', key: 14, title_view: 'Modulo de Galeria Visible?', desc: 'Nombre en el aplicativo' },
        ]
        return (
            <React.Fragment>
                <div className="columns general">
                    <div className="column is-12">
                        <h2 className="title-section">Configuracion de Aplicativo</h2>
                        {
                            itemsDrawer.map((item, key) => (
                                <div className="column inner-column" key={key}>
                                    <div>
                                        <label className="title-section">{item.title_view}</label>
                                        <input type="checkbox" className="checkbox" checked={item.checked} name={item.name} value={item.key} />
                                    </div>
                                    <br></br><label>Mantener Habilitado?</label>
                                    <input type="checkbox" id={item.idCheck} onClick={(e) => { this.enable({ id: item.key, idCheck: item.idCheck}) }} name={item.name} value={item.key} onChange={(e) => { this.sendInfoToState(e.target.name, { title: item.title, name: item.name, icon: item.icon, key: item.key }) }} />

                                    <label className="label has-text-grey-light">{item.desc}</label>
                                    <input className="input is-primary" id={item.key} ref={item.reference} disabled type="text" placeholder={item.title} onChange={(e) => { this.updateStateTitle(item.name, e.target.value) }} />
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
