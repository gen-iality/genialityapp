import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import LoadingEvent from "../loaders/loadevent";
import {EventsApi} from "../../helpers/request";
import EventCard from "../shared/eventCard";
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
                                            return <EventCard key={key} event={event}
                                                              action={{name:'Ver >',url:`evento/${event._id}`}}
                                                              right={<div className="actions is-pulled-right">
                                                                  <p className="is-size-7">Compartir</p>
                                                                  <p className="is-size-7">Asistiré</p>
                                                                  <p className="is-size-7">Me gusta</p>
                                                              </div>}
                                            />
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