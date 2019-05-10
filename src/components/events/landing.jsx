/*global firebaseui*/
/*global firebase*/
import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import {Actions, EventsApi} from "../../helpers/request";
import Loading from "../loaders/loading";
import {ApiUrl, BaseUrl} from "../../helpers/constants";
import * as Cookie from "js-cookie";
import Slider from "../shared/sliderImage";
import AdditonalDataEvent from "./additionalDataEvent/containers";
import app from "firebase/app";
import {convertFromRaw, Editor, EditorState} from "draft-js";
import Dialog from "../modal/twoAction";
import TicketFree from "../tickets/free";
Moment.locale('es');
momentLocalizer();

const html = document.querySelector("html");

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            auth:false,
            modalTicket:false,
            modal:false,
            editorState:'',
            stage:'',
            stages:[],
            ticket:'',
            tickets:[],
            ticketsOptions:[],
            heightFrame: '480px'
        }
    }

    /*componentDidUpdate(prevProps) {
        if (this.props.location === prevProps.location) {
            window.scrollTo(0, 0)
        }
    }*/

    async componentDidMount() {
        const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
            searchParams = new URLSearchParams( queryParamsString ),
            status = searchParams.get("status");
        const id = this.props.match.params.event;
        const event = await EventsApi.landingEvent(id);
        const sessions = await Actions.getAll(`api/events/${id}/sessions`);
        const evius_token = Cookie.get('evius_token');
        let iframeUrl = `${ApiUrl}/e/${event._id}`;
        if(evius_token) iframeUrl = `${ApiUrl}/e/${event._id}?evius_token=${evius_token}`;
        if(status === '5b859ed02039276ce2b996f0'){
            this.setState({showConfirm:true})
        }
        const dateFrom = event.datetime_from.split(' ');
        const dateTo = event.datetime_to.split(' ');
        event.hour_start = Moment(dateFrom[1], 'HH:mm').toDate();
        event.hour_end = Moment(dateTo[1], 'HH:mm').toDate();
        event.date_start = dateFrom[0];
        event.date_end = dateTo[0];
        event.sessions = sessions;
        event.organizer = event.organizer ? event.organizer : event.author;
        const editorState = typeof event.description === 'object' ? EditorState.createWithContent(convertFromRaw(event.description))
            : EditorState.createEmpty();
        const tickets = event.tickets.map(ticket => {
            ticket.options = Array.from(Array(parseInt(ticket.max_per_person,10))).map((e,i)=>i+1);
            return ticket
        });
        const stages = event.event_stages;
        this.setState({editorState,event,loading:false,tickets,stages,iframeUrl,auth:!!evius_token},()=>{
            this.firebaseUI();
            this.handleScroll();
        });
    }

    firebaseUI = () => {
        //FIREBSAE UI
        const firebaseui = global.firebaseui;
        let ui = firebaseui.auth.AuthUI.getInstance();
        if (!ui) {
            ui = new firebaseui.auth.AuthUI(firebase.auth());
        }
        const uiConfig = {
            //POPUP Facebook/Google
            signInFlow: 'popup',
            //The list of providers enabled for signing
            signInOptions: [app.auth.EmailAuthProvider.PROVIDER_ID,],
            //Allow redirect
            callbacks: {
                signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                    const user = authResult.user;
                    this.closeLogin(user);
                    return false;
                }
            },
            //Disabled accountchooser
            credentialHelper: 'none',
            // Terms of service url.
            tosUrl: `${BaseUrl}/terms`,
            // Privacy policy url.
            privacyPolicyUrl: `${BaseUrl}/privacy`,
        };
        ui.start('#firebaseui-auth-container', uiConfig);
    };
    openLogin = () => {
        html.classList.add('is-clipped');
        this.setState({modal:true,modalTicket:false});
    }
    closeLogin = (user) => {
        html.classList.remove('is-clipped');
        this.setState({modal:false});
        if(user) {
            const {event,stage,ticket} = this.state;
            localStorage.setItem('stage',stage);
            localStorage.setItem('ticket',ticket);
            window.location.replace(`https://api.evius.co/api/user/loginorcreatefromtoken?evius_token=${user.ra}&refresh_token=${user.refreshToken}&destination=${BaseUrl}/landing/${event._id}`);
        }
    };

    handleScroll = () => {
        const hash = this.props.location.hash;
        if (hash) {
            document.getElementById(hash.substring(1)).scrollIntoView();
        }
    };

    changeStage = (e) => {
        const {value} = e.target;
        const {tickets} = this.state;
        const options = tickets.filter(ticket => ticket.stage_id === value);
        this.setState({stage: value, ticketsOptions: options});
    };
    changeTicket = (e) => {
        const {value} = e.target;
        this.setState({ticket:value});
    };

     onLoad = () => {
         if(window.location.hostname === 'evius.co')
            this.setState({heightFrame: `${document.getElementById("idIframe").contentWindow.document.body.scrollHeight}px`});
    };

    handleModal = () => {
        html.classList.add('is-clipped');
        this.setState({modal:false,modalTicket:true})
    }

    closeModal = () => {
        html.classList.remove('is-clipped');
        this.setState({modal:false,modalTicket:false})
    };

    render() {
        const { event, stage, stages, ticket, tickets, ticketsOptions, auth, modal, editorState, modalTicket } = this.state;
        return (
            <section className="section landing">
                {
                    this.state.showConfirm && (
                        <div className="notification is-success">
                            <button className="delete" onClick={(e)=>{this.setState({showConfirm:false})}}/>
                            Tu asistencia ha sido confirmada
                        </div>
                    )
                }
                {
                    this.state.loading?<Loading/> :
                        <React.Fragment>
                            <div className="hero-head">
                                <div className="nombre item columns is-centered">
                                            <div className="column">
                                                <h2 className="is-size-3 bold-text">{event.name}</h2>
                                                <span className="is-size-6 has-text-grey">Por: <Link className="has-text-grey" to={`/page/${event.organizer_id}?type=${event.organizer_type}`}>{event.organizer.name?event.organizer.name:event.organizer.email}</Link></span>
                                            </div>
                                </div>
                                <div className="columns is-gapless">
                                    <div className="column info">
                                        <div className="fecha item columns">
                                            <div className="column fecha-uno has-text-centered">
                                                <span className="title is-size-4">{Moment(event.date_start).format('DD')} <small className="is-size-6">{Moment(event.date_start).format('MMM YY')}</small></span>
                                                <br/>
                                                <span className="subt is-size-6 is-italic has-text-grey">Desde {Moment(event.hour_start).format('HH:mm')}</span>
                                            </div>
                                            <div className="vertical-line"></div>
                                            <div className="column fecha-dos has-text-centered">
                                                <span className="title is-size-4">{Moment(event.date_end).format('DD')} <small className="is-size-6">{Moment(event.date_end).format('MMM YY')}</small></span>
                                                <br/>
                                                <span className="subt is-size-6 is-italic has-text-grey">Hasta {Moment(event.hour_end).format('HH:mm')}</span>
                                            </div>
                                        </div>
                                        <div className="lugar item columns is-centered">
                                            <div className="column is-1">
                                                    <span className="icon is-medium">
                                                        <i className="fas fa-map-marker-alt fa-2x"/>
                                                    </span>
                                            </div>
                                            <div className="column is-9">
                                                <span className="subtitle is-size-6">{event.location.FormattedAddress}</span>
                                            </div>
                                        </div>
                                        <div className="descripcion-c item columns is-centered">
                                            <div className="column is-10">
                                             
                                                { typeof event.description === 'string'?  (<div>{event.description}</div>): <Editor readOnly={true} editorState={editorState}/>  }
                                           
      {event._id === '5cbe5231d74d5c0d251fa1e2' && 
      <div>
          <a target="_blank" rel={'noopener noreferrer'} href='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/LPI%20SABORES%20MENU_PAGINAS_FINAL%20copy%20LASTV2.pdf?alt=media&token=17983443-fcad-46f9-8fc3-a686d7968086'>
                <b> Conoce  la carta de los mejores platos aquí</b>
            </a>
          <br/>
          <br/>
          <p>Un espacio para disfrutar los mejores platos de las regiones que mantienen vivo el legado de la gastronomía tradicional colombiana. Durante 15 días, puede probar y saborear los platos más representativos de las diferentes culturas colombianas, desde el Amazonas hasta San Andrés, platos para deleitar y repetir con la familia.
            </p>
          <br/>
          <p>Sabores Colombia es una experiencia gastronómica para todos, nuestro espacio funciona bajo el concepto de mesas compartidas por lo que es posible que te pidamos compartir tu mesa con otros comensales.</p>
          <br/>
          <p>Bienvenido a Sabores de Colombia,</p>
          <br/>
          <p>Horarios:</p>
          <br/>
          <p>Desde: miércoles 24 de abril.</p>
          <br/>
          <p>Sabores Colombia: 12m – 8 pm</p><br/>
          <p >Aforo: 180 pax</p>
          <br/>
          <a target="_blank" rel={'noopener noreferrer'} href='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/LPI%20SABORES%20MENU_PAGINAS_FINAL%20copy%20LASTV2.pdf?alt=media&token=17983443-fcad-46f9-8fc3-a686d7968086'>
              <b> Conoce  la carta de los mejores platos aquí</b>
          </a>
      </div>
      }
                                           
                                            </div>
                                        </div>
                                        <div className="ver-mas item columns">
                                            {/*<div className="column is-5 is-offset-1">
                                                <div className="aforo">
                                                    <span className="titulo">150/400</span><br/>
                                                    <span className="is-italic has-text-grey">Aforo</span>
                                                </div>
                                            </div>*/}
                                            {/*{
                                                (event.description.length >= 80 && !this.state.showFull) && (
                                                    <div className="column is-5 is-offset-6 button-cont">
                                                        <span className="has-text-weight-semibold has-text-grey">Ver más</span>
                                                        <div className="fav-button has-text-weight-bold" onClick={(e)=>{this.setState({showFull:true})}}>
                                                            <i className="icon fa fa-plus"></i>
                                                        </div>
                                                    </div>
                                                )
                                            }*/}
                                        </div>
                                    </div>
                                    <div className="column banner">
                                        {
                                            (typeof event.picture === 'object') ?
                                                <div style={{width:'134vh'}}>
                                                    <Slider images={event.picture}/>
                                                </div>:
                                                <figure className="image">
                                                    <img src={this.state.loading?"https://bulma.io/images/placeholders/1280x960.png":event.picture} alt="Evius.co"/>
                                                </figure>
                                        }
                                        {
                                            this.state.showFull && (
                                                <div className="info show-full columns is-centered is-hidden-mobile">
                                                    <div className="container column is-12">
                                                        <div className="item is-italic has-text-grey">
                                                            <p>{event.description}</p>
                                                        </div>
                                                        <div className="item">
                                                            <div className="columns is-mobile">
                                                                <div className="button-cont column is-8 is-offset-4">
                                                                    <span className="has-text-weight-semibold has-text-grey">Ver menos</span>
                                                                    <div className="fav-button has-text-weight-bold"
                                                                         onClick={(e)=>{this.setState({showFull:false})}}>
                                                                        <i className="icon fa fa-minus"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            {
                                (this.state.event.speaker.length > 0 || this.state.event.sessions.length > 0) &&
                                   <AdditonalDataEvent eventInfo={this.state.event}/>
                            }
                            <div className="hero-body">
                                <div className="data container has-text-centered">
                                    <h2 className="data-title has-text-left title-frame">
                                        <span className="has-text-grey-dark is-size-3 subtitle">Boletería</span>
                                    </h2>
                                    <TicketFree stages={stages} tickets={tickets} eventId={event._id}/>
                                    {/*<div className="columns is-centered">
                                        <div className="column">
                                            <div className="field">
                                                <p className="title is-4">Fecha</p>
                                                <p className="subtitle is-6 has-text-grey">Elija el día de su reserva</p>
                                                <div className="control">
                                                    <div className="control">
                                                        <div className="select">
                                                            <select value={stage} onChange={this.changeStage} name={'stage'}>
                                                                <option value={''}>Seleccione...</option>
                                                                {
                                                                    stages.map((item,key)=>{
                                                                        return <option key={key} value={item.stage_id}>{item.title}</option>
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="field">
                                                <p className="title is-4">Hora</p>
                                                <p className="subtitle is-6 has-text-grey">Elija la hora que desee</p>
                                                <div className="control">
                                                    <div className="control">
                                                        <div className="select">
                                                            <select value={ticket} onChange={this.changeTicket} name={'stage'}>
                                                                <option value={''}>Seleccione...</option>
                                                                {
                                                                    ticketsOptions.map((item,key)=>{
                                                                        return <option key={key} value={item._id}>{item.title}</option>
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>*/}
                                    {/*<div id={'tickets'}>
                                        {!auth && <div style={{height:heightFrame,width:'100%',position:'absolute'}} onClick={this.handleModal}/>}
                                        <iframe title={'Tiquetes'} id={'idIframe'} src={iframeUrl} width={'100%'} height={heightFrame} onLoad={this.onLoad}/>
                                    </div>*/}
                                    {
                                        event._id === '5cbe5231d74d5c0d251fa1e2' &&
                                        <React.Fragment>
                                            <div className="columns is-centered">
                                                <div className="column">
                                                    <h2 className="data-title has-text-left">
                                                        <small className="is-italic has-text-grey-light has-text-weight-300">Conoce nuestro delicioso</small><br/>
                                                        <span className="has-text-grey-dark is-size-3 subtitle">Menú</span>
                                                    </h2>
                                                </div>
                                            </div>
                                            <div className="columns">
                                                <figure className="column image">
                                                    <img alt={'image1'} className="image-4-1"src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Menu-Sabores-A.jpg?alt=media&token=021c44eb-1666-4102-93f5-d91c1698bbb2"/>
                                                </figure>
                                                <figure className="column image">
                                                    <img alt={'image2'} className="image-4-1"src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Menu-Sabores-B.jpg?alt=media&token=690ffb6e-fa76-4a29-ac33-8c0d400933dd"/>
                                                </figure>
                                            </div>
                                            <div className="columns">
                                                <figure className="column image">
                                                    <img alt={'image3'} className="image-4-1"src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Menu-Sabores-C.jpg?alt=media&token=069e022f-33bb-4c9a-b6fc-76cefdde812a"/>
                                                </figure>
                                                <figure className="column image">
                                                    <img alt={'image4'} className="image-4-1"src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Menu-Sabores-D.jpg?alt=media&token=c774d1e6-9bca-412d-8b7f-8117bbfafbb9"/>
                                                </figure>
                                            </div>
                                            <div className="columns">
                                                <figure className="column image">
                                                    <img alt={'image5'} className="image-4-1"src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Menu-Sabores-E.jpg?alt=media&token=d4382a7e-e5f0-4898-a83d-5dbab648f224"/>
                                                </figure>
                                                <figure className="column image">
                                                    <img alt={'image6'} className="image-4-1"src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Menu-Sabores-F.jpg?alt=media&token=ebb81af5-e137-460a-8bfb-8d70af51ea8a"/>
                                                </figure>
                                            </div>
                                            <div className="columns">
                                                <figure className="column image">
                                                    <img alt={'image7'} className="image-4-1"src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Menu-Sabores-G.jpg?alt=media&token=61519097-68d7-458a-b260-2720516d64e2"/>
                                                </figure>
                                                <figure className="column image">
                                                    <img alt={'image8'} className="image-4-1"src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Menu-Sabores-H.jpg?alt=media&token=3932df58-b6e7-49b4-a546-4b20c17fbc99"/>
                                                </figure>
                                            </div>
                                        </React.Fragment>
                                    }
                                    <div className="columns is-centered">
                                        <div className="column">
                                            <h2 className="data-title has-text-left">
                                                <small className="is-italic has-text-grey-light has-text-weight-300">Encuentra la</small><br/>
                                                <span className="has-text-grey-dark is-size-3 subtitle">Ubicación</span>
                                            </h2>
                                            {
                                                !this.state.loading&&(
                                                    <MyMapComponent
                                                        lat={event.location.Latitude} long={event.location.Longitude}
                                                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                                                        loadingElement={<div style={{height: `100%`}}/>}
                                                        containerElement={<div style={{height: `400px`}}/>}
                                                        mapElement={<div style={{height: `100%`}}/>}
                                                    />
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`modal ${modal?'is-active':''}`}>
                                <div className="modal-background"></div>
                                <div className="modal-content"><div id="firebaseui-auth-container"/></div>
                                <button className="modal-close is-large" aria-label="close" onClick={e =>{this.closeLogin()} }/>
                            </div>
                            <Dialog modal={modalTicket} title={'Atención!!'}
                                    content={<p className='has-text-weight-bold'>Para seleccionar tiquetes debes iniciar sesión !!</p>}
                                    first={{title:'Iniciar Sesión',class:'is-info',action:this.openLogin}}
                                    second={{title:'Cancelar',class:'',action:this.closeModal}}/>
                        </React.Fragment>
                }
            </section>
        );
    }
}

const MyMapComponent = withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={12}
        defaultCenter={{ lat: props.lat, lng: props.long }}
    >
        <Marker position={{ lat: props.lat, lng: props.long }} />
    </GoogleMap>
)

export default withRouter(Landing);