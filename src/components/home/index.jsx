import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
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
            typeEvent:"next",
            events:[],
            tabEvt:false,
            tabEvtType:false,
            tabEvtCat: false,
            loadingState: false,
            timeout: false,
            serverError: false,
            errorData: {}
        };
        this.fetchEvent = this.fetchEvent.bind(this);
    }

    componentDidMount() {
        this.fetchEvent("next")
    }

    async fetchEvent(type) {
        try{
            this.setState({loading:true,typeEvent:type});
            const resp = type === 'next' ?  await EventsApi.getPublic('?pageSize=30') : await EventsApi.getOldEvents('?pageSize=60');
            const events = resp.data.filter(item => item.organizer);
            this.setState({events,loading:false,current_page:resp.meta.current_page,total:resp.meta.total});
        }
        catch (error) {
            if (error.response) {
                const {status} = error.response;
                if(status === 401) this.setState({timeout:true,loader:false});
                else this.setState({serverError:true,loader:false})
            } else {
                if(error.request) console.log(error.request);
                this.setState({serverError:true,loader:false})
            }
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

    render() {
        const {timeout, typeEvent, serverError, errorData, events, loading} = this.state;
        return (
            <React.Fragment>
                <h2 className="is-size-2 bold-text">Eventos</h2>
                <section className="home">
                    <div className="tabs">
                        <ul>
                            <li onClick={e=>this.fetchEvent('next')} className={typeEvent==="next"?"is-active":""}><a>Próximos</a></li>
                            <li onClick={e=>this.fetchEvent('prev')} className={typeEvent==="prev"?"is-active":""}><a>Pasados</a></li>
                        </ul>
                    </div>
                    <div className="dynamic-content">
                        {
                            loading ? <LoadingEvent/> :
                                <div className="columns home is-multiline">
                                    {
                                        events.length<=0 ? <p className="sin-evento">No hay eventos próximos</p> :
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
                {timeout&&(<LogOut/>)}
                {serverError&&(<ErrorServe errorData={errorData}/>)}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    categories: state.categories.items,
    loginInfo: state.user.data,
    types: state.types.items,
    error: state.categories.error
});

export default connect(mapStateToProps)(withRouter(Home));
