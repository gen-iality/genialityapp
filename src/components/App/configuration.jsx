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
    }
    async componentDidMount() {
        const info = await Actions.getAll(`/api/event/${this.props.eventId}/configuration`);
        this.setState({ info })
        console.log(info._id)
        this.setState({
            dates: {
                database: this.state.info
            }
        })

        if (info.HomeScreen) {
            this.setState({
                checkHome: true,
            })
        } else {
            this.setState({
                checkHome: false,
            })
        }

        if (info.CalendarScreen) {
            this.setState({
                checkCalendar: true,
            })
            console.log(this.state.checkCalendar)
        } else {
            this.setState({
                checkCalendar: false,
            })
        }

        if (info.ProfileScreen) {
            this.setState({
                checkProfile: true,
            })
        } else {
            this.setState({
                checkProfile: false,
            })
        }

        if (info.EventPlaceScreen !== undefined) {
            this.setState({
                checkEventPlace: true,
            })
        } else {
            this.setState({
                checkEventPlace: false,
            })
        }

        if (info.SpeakersScreen) {
            this.setState({
                checkSpeaker: true,
            })
        } else {
            this.setState({
                checkSpeaker: false,
            })
        }

        if (info.NewsScreen) {
            this.setState({
                checkNews: true,
            })
        } else {
            this.setState({
                checkNews: false,
            })
        }

        if (info.SurveysScreen) {
            this.setState({
                checkSurveys: true,
            })
        } else {
            this.setState({
                checkSurveys: false,
            })
        }

        if (info.DocumentsScreen) {
            this.setState({
                checkDocuments: true,
            })
        } else {
            this.setState({
                checkDocuments: false,
            })
        }

        if (info.WallScreen) {
            this.setState({
                checkWall: true,
            })
        } else {
            this.setState({
                checkWall: false,
            })
        }

        if (info.QuizScreen) {
            this.setState({
                checkQuiz: true,
            })
        } else {
            this.setState({
                checkQuiz: false,
            })
        }

        if (info.RankingScreen) {
            this.setState({
                checkRanking: true,
            })
        } else {
            this.setState({
                checkRanking: false,
            })
        }

        if (info.VoteScreen) {
            this.setState({
                checkVote: true,
            })
        } else {
            this.setState({
                checkVote: false,
            })
        }

        if (info.FaqScreen) {
            this.setState({
                checkFaq: true,
            })
        } else {
            this.setState({
                checkFaq: false,
            })
        }

        if (info.GalleryScreen) {
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
                console.log("if condition" + this.state.info._id)
                // let array = [];
                // array = Object.keys(this.state.configuration).map(key =>{
                //     return this.state.configuration[key]
                // })
                const info = await Actions.put(`api/event/${this.props.eventId}/configuration/${this.state.info._id}`, this.state.configuration);

                console.log(info)
                this.setState({ loading: false });
                toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
                window.location.replace(`${BaseUrl}/event/${this.props.eventId}/configurationApp`);
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

        const itemsDrawer = [
            { name: 'HomeScreen', checked: this.state.checkHome, title: 'Home', icon: 'home', key: 1, title_view: 'Modulo Home Visible?', desc: 'Nombre en el aplicativo' },
            { name: 'CalendarScreen', checked: this.state.checkCalendar, title: 'Calendar', icon: 'calendar', key: 2, title_view: 'Modulo Agenda Visible?', desc: 'Nombre en el aplicativo' },
            { name: 'ProfileScreen', checked: this.state.checkProfile, title: 'Profile', icon: 'user', key: 3, title_view: 'Modulo Perfil Visible?', desc: 'Nombre en el aplicativo' },
            { name: 'EventPlaceScreen', checked: this.state.checkEventPlace, title: 'Event Place', icon: 'location', key: 4, title_view: 'Modulo lugar del evento visible?', desc: 'Nombre en el aplicativo' },
            { name: 'SpeakersScreen', checked: this.state.checkSpeaker, title: 'Speaker', icon: 'mic', key: 5, title_view: 'Modulo Conferencistas Visible?', desc: 'Nombre en el aplicativo' },
            { name: 'NewsScreen', checked: this.state.checkNews, title: 'News', icon: 'news', key: 6, title_view: 'Modulo de Noticias Visible?', desc: 'Nombre en el aplicativo' },
            { name: 'SurveysScreen', checked: this.state.checkSurveys, title: 'Surveys', icon: 'book', key: 7, title_view: 'Modulo de encuestas Visible?', desc: 'Nombre en el aplicativo' },
            { name: 'DocumentsScreen', checked: this.state.checkDocuments, title: 'Documents', icon: 'folder', key: 8, title_view: 'Modulo de documentos Visible?', desc: 'Nombre en el aplicativo' },
            { name: 'WallScreen', checked: this.state.checkWall, title: 'Wall', icon: 'doc', key: 8, title_view: 'Modulo de Muro Visible?', desc: 'Nombre en el aplicativo' },
            { name: 'QuizScreen', checked: this.state.checkQuiz, title: 'Quiz', icon: 'doc', key: 8, title_view: 'Modulo de Quiz Visible?', desc: 'Nombre en el aplicativo' },
            { name: 'RankingScreen', checked: this.state.checkRanking, title: 'Ranking', icon: 'doc', key: 8, title_view: 'Modulo de Ranking Visible?', desc: 'Nombre en el aplicativo' },
            { name: 'FaqScreen', checked: this.state.checkFaq, title: 'Faq', icon: 'doc', key: 8, title_view: 'Modulo de F.A.Q Visible?', desc: 'Nombre en el aplicativo' },
            { name: 'VoteScreen', checked: this.state.checkVote, title: 'Vote', icon: 'doc', key: 8, title_view: 'Modulo de Votacion Visible?', desc: 'Nombre en el aplicativo' },
            { name: 'GalleryScreen', checked: this.state.checkGallery, title: 'Gallery', icon: 'doc', key: 8, title_view: 'Modulo de Galeria Visible?', desc: 'Nombre en el aplicativo' },
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
                                        <input type="checkbox" checked={item.checked} name={item.name} value={item.key} />
                                    </div>
                                    <br></br><label>Mantener Habilitado?</label>
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
