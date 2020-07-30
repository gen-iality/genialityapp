import React, { Component } from 'react';
import Moment from "moment";
import { Link, withRouter } from "react-router-dom";
import EventImage from "../../eventimage.png";

class EventCard extends Component {
    render() {
        const { event, action, size, right } = this.props;
        return (
            <div className={size}>
                {
                    event.loader_page && event.loader_page !== "no" && event.data_loader_page !== null ? (
                        <Link to={{ pathname: `/transition/${event._id}`, state: { eventId: event._id, event: event } }} >
                            <div className="card">
                                <div className="card-image">
                                    <figure className="image is-3by2">
                                        {
                                            event.picture ?
                                                <img src={typeof event.picture === 'object' ? event.picture[0] : event.picture} alt="Evius.co" /> :
                                                <img src={EventImage} alt="Evius.co" />
                                        }
                                    </figure>
                                    <div className="header-event">
                                        <div className="is-pulled-left dates">
                                            <p className="is-size-7 has-text-white">
                                                <time dateTime={event.datetime_from}>{Moment(event.datetime_from).format('DD')}</time><br />
                                                <time dateTime={event.datetime_from}>{Moment(event.datetime_from).format('MMM YYYY')}</time>
                                            </p>
                                            <div className="vertical-line"></div>
                                            <p className="is-size-7 has-text-white">
                                                <time dateTime={event.datetime_to}>{Moment(event.datetime_to).format('DD')}</time><br />
                                                <time dateTime={event.datetime_to}>{Moment(event.datetime_to).format('MMM YYYY')}</time>
                                            </p>
                                        </div>
                                        <div className="is-pulled-right cats">
                                            {
                                                event.categories.length >= 1 && <p># {event.categories[0].name}</p>
                                            }
                                            {
                                                event.event_type && <p># {event.event_type.name}</p>
                                            }
                                        </div>
                                    </div>
                                    {
                                        action && (

                                            <button className="img-see button is-white is-small has-text-weight-bold">
                                                {action.name}
                                                <span className="icon is-small">
                                                    <i className="fas fa-angle-right"></i>
                                                </span>
                                            </button>
                                        )
                                    }
                                </div>
                                <div className="card-content">
                                    <div className="media">
                                        <div className="media-content">
                                            <div className="">
                                                <h2 className="title is-size-6 is-medium has-text-grey-dark">{event.name}</h2>
                                            </div>
                                            <div className="subtitle">
                                                <span className="icon is-small has-text-grey">
                                                    <i className="fas fa-map-marker-alt" />
                                                </span>
                                                <span className="is-size-7 is-small has-text-grey-dark subt-location">{event.location.FormattedAddress}</span>
                                            </div>
                                        </div>
                                        <div className="vertical-line"></div>
                                        <div className="media-right">
                                            {right}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ) : (
                            <Link to={`/landing/${event._id}`}>
                                <div className="card">
                                    <div className="card-image">
                                        <figure className="image is-3by2">
                                            {
                                                event.picture ?
                                                    <img src={typeof event.picture === 'object' ? event.picture[0] : event.picture} alt="Evius.co" /> :
                                                    <img src={EventImage} alt="Evius.co" />
                                            }
                                        </figure>
                                        <div className="header-event">
                                            <div className="is-pulled-left dates">
                                                <p className="is-size-7 has-text-white">
                                                    <time dateTime={event.datetime_from}>{Moment(event.datetime_from).format('DD')}</time><br />
                                                    <time dateTime={event.datetime_from}>{Moment(event.datetime_from).format('MMM YYYY')}</time>
                                                </p>
                                                <div className="vertical-line"></div>
                                                <p className="is-size-7 has-text-white">
                                                    <time dateTime={event.datetime_to}>{Moment(event.datetime_to).format('DD')}</time><br />
                                                    <time dateTime={event.datetime_to}>{Moment(event.datetime_to).format('MMM YYYY')}</time>
                                                </p>
                                            </div>
                                            <div className="is-pulled-right cats">
                                                {
                                                    event.categories.length >= 1 && <p># {event.categories[0].name}</p>
                                                }
                                                {
                                                    event.event_type && <p># {event.event_type.name}</p>
                                                }
                                            </div>
                                        </div>
                                        {
                                            action && (

                                                <button className="img-see button is-white is-small has-text-weight-bold">
                                                    {action.name}
                                                    <span className="icon is-small">
                                                        <i className="fas fa-angle-right"></i>
                                                    </span>
                                                </button>
                                            )
                                        }
                                    </div>
                                    <div className="card-content">
                                        <div className="media">
                                            <div className="media-content">
                                                <div className="">
                                                    <h2 className="title is-size-6 is-medium has-text-grey-dark">{event.name}</h2>
                                                </div>
                                                <div className="subtitle">
                                                    <span className="icon is-small has-text-grey">
                                                        <i className="fas fa-map-marker-alt" />
                                                    </span>
                                                    <span className="is-size-7 is-small has-text-grey-dark subt-location">{event.location.FormattedAddress}</span>
                                                </div>
                                            </div>
                                            <div className="vertical-line"></div>
                                            <div className="media-right">
                                                {right}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                }
            </div>
        );
    }
}

export default withRouter(EventCard);
