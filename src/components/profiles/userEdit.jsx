import React, {Component} from 'react';
import { withRouter, Link } from "react-router-dom";
import {CategoriesApi, EventsApi} from "../../helpers/request";
import Loading from "../loaders/loading";
import EventCard from "../shared/eventCard";
import LogOut from "../shared/logOut";

class UserEditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: [],
            events: [],
            loading: true
        };
    }

    async componentDidMount() {
        let userId = this.props.match.params.id;
        try {
            const categories = await CategoriesApi.getAll();
            this.setState({});
            const resp = await EventsApi.mine();
            this.setState({loading:false,events:resp.data,categories});
        }catch (e) {
            console.log(e.response);
            this.setState({timeout:true,loading:false});
        }
    }

    async componentWillReceiveProps(nextProps) {
        let userId = nextProps.match.params.id;
        try {
            const categories = await CategoriesApi.getAll();
            this.setState({});
            const resp = await EventsApi.mine();
            this.setState({loading:false,events:resp.data,categories});
        }catch (e) {
            console.log(e.response);
            this.setState({timeout:true,loading:false});
        }
    }

    render() {
        const { loading, timeout, events } = this.state;
        return (
            <section className="section">
                {
                    loading ? <Loading/> :
                        <div className="container org-profile">
                            <div className="columns">
                                Perfil Usuario
                            </div>
                            <div>
                                <h2>Eventos:</h2>
                                <div className="columns home is-multiline is-mobile">
                                    {
                                        events.map((event,key)=>{
                                            return <EventCard event={event} key={event._id}
                                                              action={''}
                                                              right={
                                                                  <Link className="button is-text is-inverted is-primary" to={`/event/${event._id}`}>
                                                                      <span>Editar</span>
                                                                  </Link>}
                                            />
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                }
                {
                    timeout&&(<LogOut/>)
                }
            </section>
        );
    }
}

export default withRouter(UserEditProfile);