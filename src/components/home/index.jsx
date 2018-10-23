import React, {Component} from 'react';
import { withRouter, Link } from 'react-router-dom';
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import LoadingEvent from "../loaders/loadevent";
import EventCard from "../shared/eventCard";
import {CategoriesApi, EventsApi, TypesApi} from "../../helpers/request";
import API from "../../helpers/request";
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

    componentWillReceiveProps(nextProps){
        const search = nextProps.location.search;
        const params = new URLSearchParams(search);
        const type = params.get('type');
        const category = params.get('category');
        let query = '?';
        let queryFilter = [];
        if(type){
            queryFilter.push({"id":"event_type_id","value":type,"comparator":"like"})
        }
        if(category){
            queryFilter.push({"id":"category_ids","value":category,"comparator":"like"})
        }
        queryFilter = JSON.stringify(queryFilter);
        query = query+`filtered=${queryFilter}`;
        this.setState({loading:true});
        API.get(`/api/events${query}`).then(({data})=>{
            console.log(data);
            this.setState({events:data.data,loading:false,type,category});
        }).catch(e=>{
            console.log(e.response);
            this.setState({timeout:true,loading:false,events:[],type,category});
        });
    }

    render() {
        const {categories,types,category,type} = this.state;
        const {match} = this.props;
        return (
            <div>
                <div className="filter-bar column is-3 is-offset-9">
                    <div class="buttons is-right has-text-weight-bold">
                        <p class="control">
                            <a class="button is-white has-text-grey-light">
                                <span class="icon is-small"><i class="fas fa-map-marker-alt"></i></span>
                                <span>Ciudad</span>
                            </a>
                        </p>
                        <p class="control">
                            <a class="button is-white has-text-grey-light">
                                <span class="icon is-small"><i class="fas fa-calendar-alt"></i></span>
                                <span>Fecha</span>
                            </a>
                        </p>
                    </div>
                </div>
                <div className="columns">
                    <aside className="menu aside column is-2 has-text-centered-mobile has-text-weight-bold">
                        <p className="menu-label has-text-grey-dark">Eventos</p>
                        <ul className="menu-list">
                            <li><a className="is-size-6 has-text-grey-light">Lo mas nuevo</a></li>
                            {/*<li><a className="is-size-6 has-text-grey-light">Destacados</a></li>
                            <li><a className="is-size-6 has-text-grey-light">Recomendados</a></li>*/}
                        </ul>
                        <hr className="navbar-divider"/>
                        <p className="menu-label has-text-grey-dark">Tipo de Evento</p>
                        <ul className="menu-list">
                            {
                                types.map((item,key)=>{
                                    return <li key={key}>
                                        <Link className={`has-text-grey-light is-size-6 ${type===item.value?'active':''}`}
                                            to={`${match.url}?type=${item.value}`}>
                                            {item.label}
                                        </Link>
                                    </li>
                                })
                            }
                        </ul>
                        <hr className="navbar-divider"/>
                        <p className="menu-label has-text-grey-dark">Categoría</p>
                        <ul className="menu-list">
                            {
                                categories.map((item,key)=>{
                                    return <li key={key}>
                                        <Link className={`has-text-grey-light is-size-6 ${category===item.value?'active':''}`}
                                            to={`${match.url}?category=${item.value}`}>
                                            {item.label}
                                        </Link>
                                    </li>
                                })
                            }
                        </ul>
                    </aside>

                    <section className="home column is-10">
                        <div className="dynamic-content">
                            {/*<header>
                                <div className="is-pulled-right field is-grouped">
                                    <p className="is-size-6">Ciudad</p>
                                    <p className="is-size-6">Fecha</p>
                                </div>
                            </header>*/}
                            <section className="">
                                {
                                    this.state.loading ? <LoadingEvent/>:
                                        <div className="columns home is-multiline">
                                            {
                                                this.state.events.map((event,key)=>{
                                                    return <EventCard key={event._id} event={event}
                                                                    action={{name:'Ver',url:`landing/${event._id}`}}
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
                </div>
            </div>
        );
    }
}

export default withRouter(Home);