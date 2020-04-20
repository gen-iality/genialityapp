/*global google*/
import React, { Component } from 'react';
import { withRouter, Link } from "react-router-dom";
//redux
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { addLoginInformation } from "../../redux/user/actions";
//Libraries and stuffs
import { CategoriesApi, EventsApi, UsersApi } from "../../helpers/request";
import Loading from "../loaders/loading";
import EventCard from "../shared/eventCard";
import 'react-toastify/dist/ReactToastify.css';
import ErrorServe from "../modal/serverError";

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            user: {},
            error: {},
            loading: true,
            valid: true,
        };
    }

    async componentDidMount() {
        let userId = this.props.match.params.id;
        try {
            const categories = await CategoriesApi.getAll();
            const events = await EventsApi.mine();
            const user = await UsersApi.getProfile(userId, true);
            this.setState({ loading: false, user, events, categories, valid: false }, this.handleScroll);

            console.log(events)
        } catch (e) {
            console.log(e.response);
            this.setState({ timeout: true, loading: false, errorData: { status: e.response.status, message: JSON.stringify(e.response.data) } });
        }
    }

    handleScroll = () => {
        const hash = this.props.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                let topOfElement = element.offsetTop + 60;
                window.scroll({ top: topOfElement })
            }
        }
    };



    render() {
        const { loading, timeout, events, errorData } = this.state;



        return (
            <section className="section profile">
                {
                    loading ? <Loading /> :
                        <div className="container org-profile">
                            <div className="profile-data columns">
                                <div className="column is-8">
                                    <h2 className="data-title">
                                        <small className="is-italic has-text-grey-light has-text-weight-300">Tus</small><br />
                                        <span className="has-text-grey-dark is-size-3">Eventos</span>
                                    </h2>
                                    <div className="columns home is-multiline">
                                        {
                                            events.map((event, key) => {
                                                return <EventCard event={event} key={event._id} action={''} size={'column is-half'} right={
                                                    <div className="edit">
                                                        <Link className="button-edit has-text-grey-light" to={`/event/${event._id}`}>
                                                            <span className="icon is-medium">
                                                                <i className="fas fa-lg fa-cogs" />
                                                            </span>
                                                            <span className="is-size-7 is-italic">Administrar</span>
                                                        </Link>
                                                    </div>
                                                }
                                                />
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="column is-4" id={'events'}>
                                    <h2 className="data-title">
                                        <small className="is-italic has-text-grey-light has-text-weight-300">Tus</small><br />
                                        <span className="has-text-grey-dark is-size-3">Tickets</span>
                                    </h2>
                                    <div className="tickets soon"></div>
                                </div>
                            </div>
                        </div>
                }
                {
                    timeout && (<ErrorServe errorData={errorData} />)
                }
            </section>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    addLoginInformation: bindActionCreators(addLoginInformation, dispatch)
});

export default connect(null, mapDispatchToProps)(withRouter(Events));
