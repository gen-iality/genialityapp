import React, {Component} from 'react';
import Moment from "moment";
import {Link} from "react-router-dom";

class EventCard extends Component {
    render() {
        const {event,key,action,right} = this.props;
        return (
            <div className="column is-one-third" key={key}>
                <div className="card">
                    <div className="card-image">
                        <figure className="image is-3by2">
                            <img src={event.picture?event.picture:"https://bulma.io/images/placeholders/1280x960.png"} alt="Evius.co"/>
                        </figure>
                        <div className="header-event">
                            <div className="is-pulled-left dates">
                                <p className="is-size-7 has-text-white">
                                    <time dateTime={event.datetime_from}>{Moment(event.datetime_from).format('DD MMM,YYYY')}</time>
                                </p>
                                <p className="is-size-7 has-text-white">
                                    <time dateTime={event.datetime_to}>{Moment(event.datetime_to).format('DD MMM,YYYY')}</time>
                                </p>
                            </div>
                            <div className="is-pulled-right cats">
                                <p className="is-size-7 has-text-white"># Categorías</p>
                            </div>
                        </div>
                        <Link to={`${action.url}`}>
                            <button className="button is-primary is-rounded img-see is-small">{action.name}</button>
                        </Link>
                    </div>
                    <div className="card-content">
                        <div className="media">
                            <div className="media-left">
                                <p className="title is-6 has-text-grey-darker has-text-weight-bold">{event.name}</p>
                                <div className="columns">
                                    <div className="column is-one-fifth">
                                                                       <span className="icon is-small has-text-grey">
                                                                           <i className="fas fa-map-marker-alt"/>
                                                                       </span>
                                    </div>
                                    <div className="column subtitle is-7 has-text-grey has-text-weight-bold">{event.location.FormattedAddress}</div>
                                </div>
                            </div>
                            <div className="media-content">
                                {right}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EventCard;