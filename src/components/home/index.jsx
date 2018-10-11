import React, {Component} from 'react';
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import LoadingEvent from "../loaders/loadevent";
import EventCard from "../shared/eventCard";
import {CategoriesApi, EventsApi, TypesApi} from "../../helpers/request";
Moment.locale('es');
momentLocalizer();

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            categories:[],
            types:[]
        }
    }

    async componentDidMount() {
        try{
            const categories = await CategoriesApi.getAll();
            const types = await TypesApi.getAll();
            const resp = await EventsApi.getPublic();
            console.log(resp);
            this.setState({events:resp.data,loading:false,categories,types});
        }catch (e) {
            console.log(e);
        }
    }

    render() {
        const {categories,types} = this.state;
        return (
            <section className="section home">
                <aside className="is-narrow-mobile is-fullheight menu is-hidden-mobile aside">
                    <p className="menu-label">Eventos</p>
                    <ul className="menu-list">
                        <li><a className="is-size-6">Lista</a></li>
                        {/*<li><a className="is-size-6">Destacados</a></li>
                        <li><a className="is-size-6">Recomendados</a></li>*/}
                    </ul>
                    <hr className="navbar-divider"/>
                    <p className="menu-label">Tipo de Evento</p>
                    <ul className="menu-list">
                        {
                            types.map((item,key)=>{
                                return <li key={key}><a className="is-size-6">{item.label}</a></li>
                            })
                        }
                    </ul>
                    <hr className="navbar-divider"/>
                    <p className="menu-label">Categoría</p>
                    <ul className="menu-list">
                        {
                            categories.map((item,key)=>{
                                return <li key={key}><a className="is-size-6">{item.label}</a></li>
                            })
                        }
                    </ul>
                </aside>
                <div className="dynamic-content">
                    {/*<header>
                        <div className="is-pulled-right field is-grouped">
                            <p className="is-size-6">Ciudad</p>
                            <p className="is-size-6">Fecha</p>
                        </div>
                    </header>*/}
                    <section className="section">
                        {
                            this.state.loading ? <LoadingEvent/>:
                                <div className="columns home is-multiline">
                                    {
                                        this.state.events.map((event,key)=>{
                                            return <EventCard key={event._id} event={event}
                                                              action={{name:'Ver >',url:`landing/${event._id}`}}
                                                              right={<div className="actions is-pulled-right">
                                                                  <p className="is-size-7"></p>
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