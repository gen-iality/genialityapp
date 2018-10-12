import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import EventCard from "../shared/eventCard";
import LoadingEvent from "../loaders/loadevent";
import {Actions} from "../../helpers/request";

class HomeProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            user: {},
            loadingEvents: true
        }
    }

    async componentDidMount(){
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const id = this.props.match.params.id;
        let type = params.get('type');
        type = type.split('\\')[1];
        //Make the request
        const query = (type === 'USER') ? 'users' : 'organizations';
        const resp = await Actions.get(`/api/${query}/${id}/events`,true);
        //const user = (type === 'USER') ? {} : await OrganizationApi.getOne(id,true);
        this.setState({events:resp.data,loadingEvents:false});
    }

    render() {
        const {events,user,loadingEvents} = this.state;
        return (
            <section className="section home">
                <aside className="is-narrow-mobile is-fullheight menu is-hidden-mobile aside">
                    <p className="menu-label">Menú</p>
                </aside>
                <div className="dynamic-content">
                    <div>
                        <div className="columns">
                            <div className="column is-4">
                                <figure className="image is-128x128">
                                    <img className="is-rounded"
                                         src="https://bulma.io/images/placeholders/128x128.png"/>
                                </figure>
                                <div>
                                    <h3 className="title">{user.name}</h3>
                                </div>
                            </div>
                            <div className="column is-7">

                            </div>
                            <div className="column">

                            </div>
                        </div>
                    </div>
                    {
                        loadingEvents ? <LoadingEvent/> :
                            <div className="columns home is-multiline is-mobile">
                                {
                                    events.map((event,key)=>{
                                    return <EventCard key={event._id} event={event}
                                                      action={{name:'Ver >',url:`landing/${event._id}`}}
                                                      right={<div className="actions is-pulled-right">
                                                          <p className="is-size-7"></p>
                                                      </div>}/>})
                                }
                            </div>
                    }
                </div>
            </section>
        );
    }
}

export default withRouter(HomeProfile);