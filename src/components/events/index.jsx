import React, {Component} from 'react';
import { EventsApi } from "../../helpers/request";
import {Link} from "react-router-dom";
import Loading from "../../containers/loading";
import Dialog from "../modal/twoAction";
import * as Cookie from "js-cookie";
import {AuthUrl} from "../../helpers/constants";

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            message:{
                class:'',
                content:''
            }
        };
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    async componentDidMount() {
        const events = await EventsApi.getAll();
        console.log(events);
        this.setState({events,loading:false});
    }

    async deleteEvent() {
        this.setState({isLoading:'Wait....'});
        try {
            const result = await EventsApi.deleteOne(this.state.eventId);
            console.log(result);
            if(result.data === "True"){
                this.setState({message:{...this.state.message,class:'msg_success',content:'Evento borrado'},isLoading:false});
                const events = await EventsApi.getAll();
                setTimeout(()=>{
                    this.setState({modal:false,events});
                },500)
            }else{
                this.setState({message:{...this.state.message,class:'msg_error',content:'Evento no borrado'},isLoading:false})
            }
        }catch (e) {
            Cookie.remove("token");
            Cookie.remove("evius_token");
            window.location.replace(`${AuthUrl}/logout`);
        }
    }

    closeModal = () => {
        this.setState({modal:false})
    };

    render() {
        return (
            <React.Fragment>
                <section className="section">
                    {
                        this.state.loading ? <Loading/>:
                            <div className="columns is-multiline is-mobile">
                                {
                                    this.state.events.map((event,key)=>{
                                        return <div className="column is-one-third" key={event._id}>
                                            <div className="card">
                                                <div className="card-image">
                                                    <figure className="image is-3by2">
                                                        {
                                                            event.picture ?
                                                                <img src={event.picture} alt={event.name}/>
                                                                : <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Evius.co"/>
                                                        }
                                                    </figure>
                                                </div>
                                                <div className="card-content">
                                                    <div className="media">
                                                        <div className="media-content">
                                                            <p className="title is-4">{event.name}</p>
                                                            <p className="subtitle is-6">{event.location}</p>
                                                        </div>
                                                    </div>
                                                    <div className="content">
                                                        {event.description}
                                                        <br/>
                                                        <time dateTime={event.datetime_from}>{event.datetime_from}</time>
                                                    </div>
                                                </div>
                                                <footer className="card-footer">
                                                    <Link className="card-footer-item" to={'/edit/'+event._id}>Edit</Link>
                                                    <a className="card-footer-item" onClick={(e)=>{this.setState({modal:true,eventId:event._id})}}>Delete</a>
                                                </footer>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                    }
                </section>
                <Dialog modal={this.state.modal} title={'Borrar Evento'}
                        content={<p>Seguro de borrar este evento?</p>}
                        first={{title:'Borrar',class:'is-dark has-text-danger',action:this.deleteEvent}}
                        message={this.state.message} isLoading={this.state.isLoading}
                        second={{title:'Cancelar',class:'',action:this.closeModal}}/>
            </React.Fragment>
        );
    }
}

export default Events;