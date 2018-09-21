import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import LoadingEvent from "../loaders/loadevent";
import {EventsApi} from "../../helpers/request";
Moment.locale('es');
momentLocalizer();

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true
        }
    }

    async componentDidMount() {
        const resp = await EventsApi.getPublic();
        console.log(resp);
        this.setState({events:resp.data,loading:false});
    }

    render() {
        return (
            <section className="section columns">
                <aside className="column is-2 is-narrow-mobile is-fullheight menu is-hidden-mobile aside">
                    <p className="menu-label">Eventos</p>
                    <ul className="menu-list">
                        <li><a className="is-size-6">Lo más nuevo</a></li>
                        <li><a className="is-size-6">Destacados</a></li>
                        <li><a className="is-size-6">Recomendados</a></li>
                    </ul>
                    <hr className="navbar-divider"/>
                    <p className="menu-label">Tipo de Evento</p>
                    <hr className="navbar-divider"/>
                    <p className="menu-label">Categoría</p>
                </aside>
                <div className="column">
                    <header>
                        <div className="is-pulled-right field is-grouped">
                            <p className="is-size-6">Ciudad</p>
                            <p className="is-size-6">Fecha</p>
                        </div>
                    </header>
                    <section className="section">
                        {
                            this.state.loading ? <LoadingEvent/>:
                                <div className="columns home is-multiline">
                                    {
                                        this.state.events.map((event,key)=>{
                                            return <div className="column is-one-third" key={key}>
                                                <div className="card">
                                                    <div className="card-image">
                                                        <figure className="image is-3by2">
                                                            <img src={event.picture?event.picture:"https://bulma.io/images/placeholders/1280x960.png"} alt="Evius.co"/>
                                                        </figure>
                                                        <div className="header-event">
                                                            <div className="is-pulled-left dates">
                                                                <p className="is-size-7 has-text-white">
                                                                    <time dateTime={event.datetime_from}>{Moment(event.datetime_from).format('DD MMM,YYYY')}</time>
                                                                </p>
                                                                <p className="is-size-7 has-text-white">
                                                                    <time dateTime={event.datetime_to}>{Moment(event.datetime_to).format('DD MMM,YYYY')}</time>
                                                                </p>
                                                            </div>
                                                            <div className="is-pulled-right cats">
                                                                <p className="is-size-7 has-text-white"># Categorías</p>
                                                            </div>
                                                        </div>
                                                        <Link to={`evento/${event._id}`}>
                                                            <button className="button is-primary is-rounded img-see is-small">Ver ></button>
                                                        </Link>
                                                    </div>
                                                    <div className="card-content">
                                                        <div className="media">
                                                            <div className="media-left">
                                                                <p className="title is-6 has-text-grey-darker has-text-weight-bold">{event.name}</p>
                                                                <div className="columns">
                                                                    <div className="column is-one-fifth">
                                                                       <span className="icon is-small has-text-grey">
                                                                           <i className="fas fa-map-marker-alt"/>
                                                                       </span>
                                                                    </div>
                                                                    <div className="column subtitle is-7 has-text-grey has-text-weight-bold">{event.location.FormattedAddress}</div>
                                                                </div>
                                                            </div>
                                                            <div className="media-content">
                                                                <div className="actions is-pulled-right">
                                                                    <p className="is-size-7">Compartir</p>
                                                                    <p className="is-size-7">Asistiré</p>
                                                                    <p className="is-size-7">Me gusta</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                        }
                    </section>
                </div>
            </section>
        );
    }
}

export default Home;