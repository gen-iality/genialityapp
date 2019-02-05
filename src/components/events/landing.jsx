import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Carousel from "react-slick";
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import { EventsApi } from "../../helpers/request";
import Loading from "../loaders/loading";
import {ApiUrl} from "../../helpers/constants";
import * as Cookie from "js-cookie";
import Slider from "../shared/sliderImage";
import AdditonalDataEvent from "./additionalDataEvent/containers";
Moment.locale('es');
momentLocalizer();

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            tickets:[]
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location === prevProps.location) {
            window.scrollTo(0, 0)
        }
    }

    async componentDidMount() {
        const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
            searchParams = new URLSearchParams( queryParamsString ),
            status = searchParams.get("status");
        const id = this.props.match.params.event;
        const event = await EventsApi.landingEvent(id);
        const evius_token = Cookie.get('evius_token');
        let iframeUrl = `${ApiUrl}/e/${event._id}`;
        if(evius_token) iframeUrl = `${ApiUrl}/e/${event._id}?evius_token=${evius_token}`;
        if(status === '5b859ed02039276ce2b996f0'){
            this.setState({showConfirm:true})
        }
        console.log(event);
        const dateFrom = event.datetime_from.split(' ');
        const dateTo = event.datetime_to.split(' ');
        event.hour_start = Moment(dateFrom[1], 'HH:mm').toDate();
        event.hour_end = Moment(dateTo[1], 'HH:mm').toDate();
        event.date_start = dateFrom[0];
        event.date_end = dateTo[0];
        event.organizer = event.organizer ? event.organizer : event.author;
        const tickets = event.tickets.map(ticket => {
            ticket.options = Array.from(Array(parseInt(ticket.max_per_person))).map((e,i)=>i+1);
            return ticket
        });
        this.setState({event,loading:false,tickets,iframeUrl},this.handleScroll);
    }

    handleScroll = () => {
        const hash = this.props.location.hash;
        if (hash) {
            document.getElementById(hash.substring(1)).scrollIntoView();
        }
    };

    render() {
        const { event, tickets, iframeUrl } = this.state;
        return (
            <section className="section hero landing">
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
                                <div className="columns is-gapless">
                                    <div className="column is-4 info">
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
                                        <div className="nombre item columns is-centered">
                                            <div className="column is-10">
                                                <h2 className="is-size-3">{event.name}</h2>
                                                <span className="is-size-6 has-text-grey">Por: <Link className="has-text-grey" to={`/page/${event.organizer_id}?type=${event.organizer_type}`}>{event.organizer.name?event.organizer.name:event.organizer.email}</Link></span>
                                            </div>
                                        </div>
                                        <div className="descripcion-c item columns is-centered">
                                            <div className="column is-10">
                                                <p className="is-italic has-text-grey">
                                                    {event.description}
                                                    {/*{
                                                        event.description.length >= 160 ?
                                                            event.description.substring(0,160)+'...':
                                                    }*/}
                                                </p>
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
                                                <figure className="image is-3by2">
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
                            <AdditonalDataEvent eventInfo={this.state.event}/>
                            <div className="hero-body">
                                <div className="data container has-text-centered">
                                    {/*<div className="columns is-centered">
                                        <div className="column is-8">
                                            <h2 className="data-title has-text-left has-text-dark is-size-3">Tiquetes</h2>
                                            {
                                                tickets.map((ticket,key)=>{
                                                    return <div className="level is-mobile" key={key}>
                                                            <div className="level-left">
                                                                <div className='level-item'>
                                                                    <p className="subtitle is-5">
                                                                        <strong>{ticket.title}</strong>
                                                                    </p><br/>
                                                                    <p>{ticket.description}</p>
                                                                </div>
                                                            </div>
                                                            <div className="level-right">
                                                                <div className="level-item">
                                                                    <p>{ticket.price}</p>
                                                                </div>
                                                                <div className="level-item">
                                                                    <div className="select">
                                                                        <select onChange={this.handleQuantity} name={`quantity_${ticket._id}`}>
                                                                            {
                                                                                ticket.options.map(item => {
                                                                                    return <option value={item} key={item}>{item}</option>
                                                                                })
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>*/}
                                    <div id={'tickets'}>
                                        <iframe title={'Tiquetes'} src={iframeUrl} width={'100%'} height={'600px'}/>
                                    </div>
                                    <div className="columns is-centered">
                                        {/* <div className="column is-7">
                                <div className="has-shadow">
                                    <p>Acciones</p>
                                    <div className="field is-grouped">
                                        <div className="control">
                                            <button className="button is-primary is-small">
                                                <span className="icon">
                                                    <i className="fas fa-share"/>
                                                </span>
                                                <span>Compartir</span>
                                            </button>
                                        </div>
                                        <div className="control">
                                            <button className="button is-text is-small">
                                                <span className="icon">
                                                    <i className="fas fa-check"/>
                                                </span>
                                                <span>Asistiré</span>
                                            </button>
                                        </div>
                                        <div className="control">
                                            <button className="button is-text is-small">
                                                <span className="icon">
                                                    <i className="fas fa-hearth"/>
                                                </span>
                                                <span>Me gusta</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                   
                                        <div className="column is-8">
                                            <h2 className="data-title has-text-left">
                                                <small className="is-italic has-text-grey-light has-text-weight-300">Encuentra la</small><br/>
                                                <span className="has-text-grey-dark is-size-3">Ubicación</span>
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
                        </React.Fragment>
                }
            </section>
        );
    }
}

const imagenes = [
    "https://storage.googleapis.com/herba-images/evius/events/tRHV2dgzu7geS6O75ubJ6ftkfeDfBjel35iaB8gT.jpeg",
    "https://storage.googleapis.com/herba-images/evius/events/Txf9UtFISnDaO7UAkLIKDZXESsTKXjJm0824KvdO.jpeg",
    "https://storage.googleapis.com/herba-images/evius/events/AoK1u4iDEUaIabKSuZw1OzE1ZsPWhIGn9UZnDcrF.jpeg"
];

const MyMapComponent = withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={12}
        defaultCenter={{ lat: props.lat, lng: props.long }}
    >
        <Marker position={{ lat: props.lat, lng: props.long }} />
    </GoogleMap>
)

export default Landing;