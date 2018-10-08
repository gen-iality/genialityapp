import React, {Component} from 'react';
import { EventsApi } from "../../helpers/request";
import {Link} from "react-router-dom";
import Dialog from "../modal/twoAction";
import * as Cookie from "js-cookie";
import {AuthUrl} from "../../helpers/constants";
import LoadingEvent from "../loaders/loadevent";
import EventCard from "../shared/eventCard";

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
        const resp = await EventsApi.mine();
        console.log(resp);
        this.setState({events:resp.data,loading:false});
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
                    this.setState({message:{},modal:false,events});
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
        this.setState({modal:false,message:{}})
    };

    render() {
        return (
            <React.Fragment>
                <section className="section">
                    {
                        this.state.loading ? <LoadingEvent/>:
                            <div className="columns home is-multiline is-mobile">
                                {
                                    this.state.events.map((event,key)=>{
                                        return <EventCard event={event} key={event._id}
                                                          action={''}
                                                          right={
                                                              <Link className="button is-text is-inverted is-primary" to={`event/${event._id}`}>
                                                                <span>Editar</span>
                                                              </Link>}
                                        />
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