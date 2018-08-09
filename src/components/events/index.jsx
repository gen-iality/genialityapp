import React, {Component} from 'react';
import {Actions} from "../../helpers/request";
import {Link} from "react-router-dom";
import Loading from "../../containers/loading";

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true
        }
    }

    async componentDidMount() {
        const events = await Actions.getAll('/api/user/events');
        console.log(events);
        this.setState({events,loading:false});
    }

    render() {
        return (
            <section className="section">
                {
                    this.state.loading ? <Loading/>:
                    <div className="columns is-multiline is-mobile">
                        {
                            this.state.events.map((event,key)=>{
                                return <div className="column is-one-third" key={event._id}>
                                    <div className="card">
                                        <div className="card-image">
                                            <figure className="image is-4by3">
                                                <img src={event.picture} alt={event.name}/>
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
                                                <time dateTime="2016-1-1">{event.date_start}</time>
                                            </div>
                                        </div>
                                        <footer className="card-footer">
                                            <Link className="card-footer-item" to={'/edit/'+event._id}>Edit</Link>
                                            <a className="card-footer-item">Delete</a>
                                        </footer>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                }
            </section>
        );
    }
}

export default Events;