import React, {Component} from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from "react-redux";
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import LoadingEvent from "../loaders/loadevent";
import EventCard from "../shared/eventCard";
import { EventsApi } from "../../helpers/request";
import API from "../../helpers/request";
import LogOut from "../shared/logOut";
import ErrorServe from "../modal/serverError";
Moment.locale('es');
momentLocalizer();

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            events:[],
            tabEvt:false,
            tabEvtType:false,
            tabEvtCat: false,
            loadingState: false,
            timeout: false,
            serverError: false,
            errorData: {}
        };
        //this.loadMoreItems = this.loadMoreItems.bind(this);
    }

    async componentDidMount() {
        try{
            const resp = await EventsApi.getPublic('?pageSize=30');
            console.log(resp);
            const events = resp.data.filter(item => item.organizer);
            this.setState({events,loading:false,current_page:resp.meta.current_page,total:resp.meta.total});
            /*this.refs.iScroll.addEventListener("scroll", () => {
                if (this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >= this.refs.iScroll.scrollHeight - 20){
                    this.loadMoreItems();
                }
            });*/
        }
        catch (error) {
            // Error
            if (error.response) {
                console.log(error.response);
                const {status} = error.response;
                if(status === 401) this.setState({timeout:true,loader:false});
                else this.setState({serverError:true,loader:false})
            } else {
                console.log('Error', error.message);
                if(error.request) console.log(error.request);
                this.setState({serverError:true,loader:false})
            }
            console.log(error.config);
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
        API.get(`/api/events${query}`)
            .then(({data})=>{
            console.log(data);
            const events = data.data.filter(item => item.organizer);
            this.setState({events,loading:false,type,category});
        })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    const {status,data:{message}} = error.response;
                    console.log('STATUS',status,status === 401);
                    if(status === 401) this.setState({timeout:true,loader:false});
                    else this.setState({serverError:true,loader:false,errorData:{status,message}})
                } else {
                    let errorData = {message:error.message};
                    console.log('Error', error.message);
                    if(error.request) console.log('Request Er ',error.request);
                    errorData.status = 520;
                    this.setState({serverError:true,loader:false,errorData})
                }
                console.log(error.config);
            });
    }

    /*async loadMoreItems() {
        if(!this.state.loadingState && this.state.events.length<this.state.total){
            this.setState({ loadingState: true });
            try{
                const resp = await EventsApi.getPublic(`?pageSize=6&page=${this.state.current_page+1}`);
                let listEvents = [...this.state.events];
                resp.data.map(event => {return listEvents.push(event)});
                this.setState({ events: listEvents, loadingState: false, current_page:resp.meta.current_page });
            }catch (e) {

            }
        }
    }*/

    render() {
        const {category,type,timeout, serverError, errorData, events, loading} = this.state;
        const {match,categories,types} = this.props;
        return (
            <React.Fragment>
                <div className="filter-bar column is-3 is-offset-9">
                    <div className="buttons is-right has-text-weight-bold">
                        <p className="control">
                            <a className="button is-white has-text-grey-light">
                                <span className="icon is-small"><i className="fas fa-map-marker-alt"></i></span>
                                <span>Ciudad</span>
                            </a>
                        </p>
                        <p className="control">
                            <a className="button is-white has-text-grey-light">
                                <span className="icon is-small"><i className="fas fa-calendar-alt"></i></span>
                                <span>Fecha</span>
                            </a>
                        </p>
                    </div>
                </div>
                <div className="submenu-home item columns is-centered">
                    <div className="column">
                        <h2 className="is-size-2 bold-text">Eventos</h2>
                    <nav class="navbar has-text-weight-bold is-hidden" role="navigation" aria-label="main navigation">
                        <div class="navbar-menu">
                            <div class="navbar-start">
                                <div class="navbar-item has-dropdown is-hoverable">
                                    <a class="navbar-link">
                                        Eventos
                                    </a>
                                    <div class="navbar-dropdown">
                                        <a className="is-size-6 has-text-grey-light">Lo màs nuevo</a>
                                    </div>
                                </div>
                                <div class="navbar-item has-dropdown is-hoverable">
                                    <a class="navbar-link">
                                        Tipo de Evento
                                    </a>
                                    <div class="navbar-dropdown">
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
                                    </div>
                                </div>
                                <div class="navbar-item has-dropdown is-hoverable">
                                    <a class="navbar-link">
                                        Categoría
                                    </a>
                                    <div class="navbar-dropdown">
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
                </div>
                <div className="columns">
                    <section className="home column is-12">
                        <div className="dynamic-content">
                            {
                                loading ? <LoadingEvent/> :
                                    <div className="columns home is-multiline">
                                        {
                                            events.length<=0 ? <p className="sin-evento">No hay eventos próximos {(type || category)&&`para está sección`}</p> :
                                            events.map((event,key)=>{
                                                return <EventCard key={event._id} event={event}
                                                                  action={{name:'Ver',url:`landing/${event._id}`}}
                                                                  size={'column is-one-third'}
                                                                  right={<div className="actions">
                                                                      <p className="is-size-7">
                                                                                    <span className="icon is-small has-text-grey">
                                                                                        <i className="fas fa-share"/>
                                                                                    </span>
                                                                          <span>Compartir</span>
                                                                      </p>
                                                                      <p className="is-size-7">
                                                                                    <span className="icon is-small has-text-grey">
                                                                                        <i className="fas fa-check"/>
                                                                                    </span>
                                                                          <span>Asistiré</span>
                                                                      </p>
                                                                      <p className="is-size-7">
                                                                                    <span className="icon is-small has-text-grey">
                                                                                        <i className="fas fa-heart"/>
                                                                                    </span>
                                                                          <span>Me interesa</span>
                                                                      </p>
                                                                  </div>}
                                                />
                                            })
                                        }
                                    </div>
                            }
                        </div>
                    </section>
                </div>
                {timeout&&(<LogOut/>)}
                {serverError&&(<ErrorServe errorData={errorData}/>)}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    categories: state.categories.items,
    types: state.types.items,
    error: state.categories.error
});

export default connect(mapStateToProps)(withRouter(Home));