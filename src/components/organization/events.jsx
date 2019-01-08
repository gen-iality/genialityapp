import React, {Component} from 'react';
import EventCard from "../shared/eventCard";
import {Link} from "react-router-dom";
import {OrganizationApi} from "../../helpers/request";

class OrgEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events:[],
            loading:true
        }
    }

    async componentDidMount(){
        let {org} = this.props;
        const resp = await OrganizationApi.events(org._id);
        this.setState({loading:false,events:resp.data});
    }

    render() {
        const {loading,events} = this.state;
        return (
            <div className="profile-data columns">
                <div className="column is-12">
                    <h2 className="data-title">
                        <small className="is-italic has-text-grey-light has-text-weight-300">Tus</small><br/>
                        <span className="has-text-grey-dark is-size-3">Eventos</span>
                    </h2>
                    <div className="columns home is-multiline is-mobile">
                        {
                            events.map((event,key)=>{
                                return  <EventCard event={event} key={event._id} action={''} size={'column is-one-third'} right={
                                    <div className="edit">
                                        <Link className="button-edit has-text-grey-light" to={`/event/${event._id}`}>
                                                                    <span className="icon is-medium">
                                                                        <i className="fas fa-lg fa-pencil-alt"/>
                                                                    </span>
                                            <span className="is-size-7 is-italic">Editar</span>
                                        </Link>
                                    </div>
                                }
                                />
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default OrgEvents;